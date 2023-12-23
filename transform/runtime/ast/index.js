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
  constructor(type, value, prefixTokens = []) {
    this.type = type;
    this.chars = value;
    this.value = value.map(c => c.char).join('');
    this.startRow = value[0].row;
    this.startCol = value[0].col;
    this.start = value[0].index;
    this.endRow = _.last(value).row;
    this.endCol = _.last(value).col;
    this.end = _.last(value).index;
    if (_.size(prefixTokens) && _.some(prefixTokens, c => !(c instanceof Token))) {
      throw new Error('无效相关token');
    }
    this.prefixTokens = prefixTokens;
  }

  static createToken(...args) {
    return new Token(...args);
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
  EOF: 'EOF',
}

const EOFFlag = 'EOF';
const EndStatement = 'EndStatement';

export default class AST {

  nextCharIs(str) {
    if (_.isNil(str)) {
      return this.sourceCode[0]
    }
    if (Array.isArray(str)) {
      return str.some(c => this.nextCharIs(c))
    }
    const size = _.size(str);
    const target = this.sourceCode.slice(0, size).join('');
    return str === target;
  }

  expectChar(str) {
    if (!this.nextCharIs(str)) {
      throw new Error(`预期是${str}的字符串`)
    }
    return this.eat(str)
  }

  expectToken(type) {
    if (!this.nextTokenIs(type)) {
      throw new Error(`预期是${type}的token`)
    }
    return this.eatToken()
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
    if (!c || c === EOFFlag) {
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
    ret.push(this.expectChar(c))
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

  eatToken(prefixTokens = []) {
    // 字符
    for (const item of [
      ['===', TOKEN_TYPE.STRICT_EQUAL],
      ['&&', TOKEN_TYPE.AND],
      ['||', TOKEN_TYPE.OR],
      ['?.', TOKEN_TYPE.OPTIONAL],
      ['.', TOKEN_TYPE.POINT],
      [' ', TOKEN_TYPE.SPLIT],
      [String.fromCharCode(160), TOKEN_TYPE.SPLIT],
      ['\n', TOKEN_TYPE.SPLIT],
    ]) {
      const c = item[0]
      if (this.nextCharIs(c)) {
        const token =  Token.createToken(item[1], this.eat(c), prefixTokens)
        if (token.type === TOKEN_TYPE.SPLIT) {
          return this.eatToken([...prefixTokens, token]);
        }
        return token;
      }
    }

    const number = this.eatNumber()
    if (number.length) {
      return Token.createToken(TOKEN_TYPE.NUMBER, number, prefixTokens)
    }

    const word = this.eatWord()
    if (word.length) {
      return Token.createToken(TOKEN_TYPE.WORD, word, prefixTokens)
    }

    const str = this.eatString()
    if (str.length) {
      return Token.createToken(TOKEN_TYPE.STRING, str, prefixTokens)
    }
    
    const len = this.sourceCode.length
    if (len > 0) {
      if (len === 1 && this.sourceCode[0] === EOFFlag) {
        const ret = Token.createToken(TOKEN_TYPE.EOF, this.eat(), prefixTokens);
        return ret;
      }
      console.error(this.nextCharIs())
      throw new Error('未处理的token')
    }
  }

  markSourceCode(sourceCode) {
    this.row = 0;
    this.col = 0;
    this.index = 0;
    const c = sourceCode.split('')
    c.push(EOFFlag)
    this.sourceCode = c
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
    const token = this.expectToken([TOKEN_TYPE.STRING, TOKEN_TYPE.NUMBER])
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
    const token = this.expectToken([TOKEN_TYPE.WORD])
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

  getPriorityAstFunc(attr, tokenType, astType) {
    return () => {
      const restTokens = [];
      let left = this[attr]()
      while (this.nextTokenIs(tokenType)) {
        const operatorToken = this.eatToken();
        restTokens.push(operatorToken);
        let right = this[attr]()
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
    this.sourceCode.unshift(..._.map(_.flatten(_.map(token.prefixTokens, 'chars'), 'char'), 'char'), ..._.map(token.chars, 'char'))
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
    const token = this.nextTokenIs();
    console.log('语句开始', token, this.sourceCode.length)
    switch (token.type) {
      case TOKEN_TYPE.NUMBER:
      case TOKEN_TYPE.STRING:
        return new ASTItem({
          type: 'ExpressionStatement',
          expression: this.getPrimaryAst(),
        });
      case TOKEN_TYPE.WORD:
        return this.getExpressionStatementAst();
      case TOKEN_TYPE.EOF:
        return new ASTItem({
          type: EndStatement,
          restTokens: [this.eatToken()]
        });
    }
    console.error(token.type)
    throw new Error('未处理的语法');
  }

  getAst() {
    const body = [];
    while (this.sourceCode.length) {
      const ast = this.getStatementAst()
      if (ast) {
        body.push(ast)
      }
    }
    if (_.get(body.pop(), 'type') !== EndStatement) {
      throw new Error(body,'解析出错');
    }
    return new ASTItem({
      type: 'Program',
      body,
      sourceType: 'module',
    })
  }

}
