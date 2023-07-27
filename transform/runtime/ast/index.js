// left: 'this.type === Literal',
// operator: '&&',
// right: 'this.parent.left.operator === typeof'

import _ from "lodash";
import ASTItem from "./ASTITem";
import { valueToRaw } from "./utils";
import { isInstanceOf } from "../../commonApi";

class TokenChar {
  constructor(value) {
    Object.assign(this, value)
  }
}

class Token {
  constructor(type, value) {
    this.type = type;
    this.chars = value;
    this.value = value.map(c => c.char).join('');
    this.startRow = value[0].row;
    this.startCol = value[0].col;
    this.start = value[0].index;
    this.endRow = _.last(value).row;
    this.endCol = _.last(value).col;
    this.end = _.last(value).index;
  }
}

const TOKEN_TYPE = {
  SPLIT: 'SPLIT',
  POINT: 'POINT',
  STRICT_EQUAL: 'STRICT_EQUAL',
  AND: 'AND',
  OR: 'OR',
  WORD: 'WORD',
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  OPTIONAL: 'OPTIONAL',
}

export default class AST {

  nextCharIs(str) {
    if (!str) {
      return this.sourceCode[0]
    }
    if (Array.isArray(str)) {
      return str.some(c => this.nextCharIs(c))
    }
    const size = _.size(str)
    return str === this.sourceCode.slice(0, size).join('');
  }

  expect(str) {
    if (!this.nextCharIs(str)) {
      throw new Error(`预期是${str}`)
    }
    return this.eat(str)
  }

  eat(str) {
    const size = _.size(str) || 1;
    const ret = this.sourceCode.splice(0, size);
    return ret.map(c => {
      let curRow = this.row
      let curCol = this.col++;
      if (c === '\n') {
        this.row++;
        this.col = 0;
      }
      return new TokenChar({
        col: curCol,
        char: c,
        row: curRow,
        index: this.index++,
      })
    })
  }

  eatWord() {
    const c = this.nextCharIs()
    if (!c) {
      return []
    }
    if (c.toLowerCase() !== c.toUpperCase()) {
      return _.flatten([this.eat(), ...this.eatWord()])
    }
    return [];
  }

  getLastIsfunc = (ret) => (str) => {
    if (!str) {
      throw new Error('STR 必传')
    }
    return _.last(ret)?.char === str
  }

  eatString() {
    const c = this.nextCharIs()
    if (!c || !['\'', '\"'].includes(c)) {
      return []
    }
    const ret = [this.eat()]
    const lastIs = this.getLastIsfunc(ret)

    while (!this.nextCharIs(c) || lastIs('\\')) {
      ret.push(this.eat())
    }
    ret.push(this.expect(c))
    return _.flatten(ret);
  }

  nextCharIsNumber(t) {
    const c = t || this.nextCharIs();
    return (c >= '0' && c <= '9')
  }

  eatNumber() {
    const c = this.nextCharIs()
    if (!c || !this.nextCharIsNumber(c)) {
      return []
    }
    const ret = []
    while (this.nextCharIsNumber()) {
      ret.push(this.eat())
    }
    return _.flatten(ret);
  }

  eatToken() {
    // 字符
    for (const item of [
      ['===', TOKEN_TYPE.STRICT_EQUAL],
      ['&&', TOKEN_TYPE.AND],
      ['||', TOKEN_TYPE.OR],
      ['?.', TOKEN_TYPE.OPTIONAL],
      ['.', TOKEN_TYPE.POINT],
      [' ', TOKEN_TYPE.SPLIT],
      ['\n', TOKEN_TYPE.SPLIT],
    ]) {
      const c = item[0]
      if (this.nextCharIs(c)) {
        return new Token(item[1], this.eat(c))
      }
    }

    const number = this.eatNumber()
    if (number.length) {
      return new Token(TOKEN_TYPE.NUMBER, number)
    }

    const word = this.eatWord()
    if (word.length) {
      return new Token(TOKEN_TYPE.WORD, word)
    }

    const str = this.eatString()
    if (str.length) {
      return new Token(TOKEN_TYPE.STRING, str)
    }
    if (this.sourceCode.length) {
      console.error(this.nextCharIs())
      throw new Error('未处理的token')
    }
  }

  markSourceCode(sourceCode) {
    this.row = 0;
    this.col = 0;
    this.index = 0;
    this.sourceCode = sourceCode.split('')
    // console.log(this.sourceCode);
    return this;
  }

  analysis() {
    if (!this.sourceCode) {
      throw new Error('获取源码失败')
    }
    const ret = [];
    while (this.sourceCode.length) {
      ret.push(this.eatToken())
    }
    return ret.filter(c => c.type !== TOKEN_TYPE.SPLIT);
  }

  setSourceCode(sourceCode) {
    return this.markSourceCode(sourceCode)
  }

  getLiteralAst() {
    const token = this.eatToken()
    const ret = new ASTItem({
      type: 'Literal',
      value: token.value,
      raw: valueToRaw(token.value),
      restTokens: [token],
    })
    // console.error(token);
    return ret;
  }

  getIdentifierAst() {
    const token = this.eatToken()
    return new ASTItem({
      type: 'Identifier',
      name: token.value,
      restTokens: [token],
    })
  }

  getMemberExpressionAst() {
    let left = this.getIdentifierAst()
    let right = null;
    while (this.nextTokenIs([TOKEN_TYPE.POINT, TOKEN_TYPE.OPTIONAL])) {
      const restTokens = [this.eatToken()]
      right = this.getIdentifierAst()
      left = new ASTItem({
        type: 'MemberExpression',
        object: left,
        property: right,
        computed: false,
        optional: restTokens[0].type === TOKEN_TYPE.OPTIONAL,
        restTokens,
      })
    }
    return left;
  }

  getPrimaryAst() {
    const token = this.nextTokenIs();
    switch (token.type) {
      case TOKEN_TYPE.STRING:
      case TOKEN_TYPE.NUMBER: return this.getLiteralAst();
      case TOKEN_TYPE.WORD: return this.getMemberExpressionAst();
    }
    throw new Error('未处理的语法');
  }

  eatSplit() {
    const restTokens = []
    while (this.nextTokenIs(TOKEN_TYPE.SPLIT)) {
      restTokens.push(this.eatToken())
    }
    return restTokens;
  }

  getPriorityAstFunc(attr, tokenType, astType) {
    return () => {
      const restTokens = this.eatSplit();
      let left = this[attr]()
      restTokens.push(...this.eatSplit())
      while (this.nextTokenIs(tokenType)) {
        const operatorToken = this.eatToken();
        restTokens.push(operatorToken, ...this.eatSplit());
        let right = this[attr]()
        restTokens.push(...this.eatSplit());
        left = new ASTItem({
          type: astType,
          left,
          right,
          operator: operatorToken.value,
          restTokens,
        })
      }
      if (!isInstanceOf(left, ASTItem)) {
        throw new Error('类型错误')
      }
      return left;
    }
  }

  getBinaryAst = this.getPriorityAstFunc('getPrimaryAst', TOKEN_TYPE.STRICT_EQUAL, 'BinaryExpression')

  getAndAst = this.getPriorityAstFunc
    ('getBinaryAst', TOKEN_TYPE.AND, 'LogicalExpression');

  getExpressionStatementAst() {
    const expression = this.getAndAst();
    return new ASTItem({
      type: 'ExpressionStatement',
      expression,
    });
  }

  nextTokenIs(type) {
    const temp = [ 
      this.row,
      this.col,
      this.index]
    const token = this.eatToken();
    if (!token) {
      return null;
    }
    this.sourceCode.unshift(..._.map(token.chars, 'char'))
    this.row = temp[0];
    this.col = temp[1];
    this.index = temp[2]
    if (!type) {
      return token
    }
    if (Array.isArray(type)) {
      return type.some(t => this.nextTokenIs(t))
    }
    return token.type === type;
  }

  getStatementAst() {
    this.eatSplit()
    const token = this.nextTokenIs();
    switch (token.type) {
      case TOKEN_TYPE.NUMBER:
      case TOKEN_TYPE.STRING:
        return new ASTItem({
          type: 'ExpressionStatement',
          expression: this.getPrimaryAst(),
        });
      case TOKEN_TYPE.WORD:
        return this.getExpressionStatementAst();
    }
    console.error(token.type)
    throw new Error('未处理的语法');
  }

  getAst() {
    const restTokens = this.eatSplit()
    const body = [];
    while (this.sourceCode.length) {
      const ast = this.getStatementAst()
      if (ast) {
        body.push(ast)
      }
    }
    return new ASTItem({
      type: 'Program',
      body,
      sourceType: 'module',
      restTokens
    })
  }

}
