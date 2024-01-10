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

  is(type) {
    return this.type === type;
  }

  static createToken(...args) {
    return new Token(...args);
  }
}

const TOKEN_TYPE = {
  SPLIT: '  SPLIT',
  POINT: '. POINT',
  STRICT_EQUAL: '=== STRICT_EQUAL',
  AND: '&& AND',
  OR: '|| OR',
  MUl: '* MUl',
  DIV: '/ DIV',
  PLUS: '+ PLUS',
  SUBTRACT: '- SUBTRACT',
  WORD: 'WORD',
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  OPTIONAL: '?. OPTIONAL',
  OPTIONALCall: '?.( OPTIONALCall',
  EOF: 'EOF',
  QUESTION: '? QUESTION',
  COLON: ': COLON',
  LeftParenthesis: '( LeftParenthesis',
  RightParenthesis: ') RightParenthesis',
  LeftBracket: '[ LeftBracket',
  RightBracket: '] RightBracket',
  COMMA: ', COMMA',
  SEMICOLON: '; SEMICOLON',
  EQUAL: '= EQUAL',
  NEW: 'NEW',
  CONST: 'CONST',
}

const AST_TYPE = {
  Program: 'Program',
  Literal: 'Literal',
  Identifier: 'Identifier',
  MemberExpression: 'MemberExpression',
  NewExpression: 'NewExpression',
  ArrayExpression: 'ArrayExpression',
  BinaryExpression: 'BinaryExpression',
  LogicalExpression: 'LogicalExpression',
  ConditionalExpression: 'ConditionalExpression',
  VariableDeclaration: 'VariableDeclaration',
  VariableDeclarator: 'VariableDeclarator',
  CallExpression: 'CallExpression',
  ExpressionStatement: 'ExpressionStatement',
}

const ReservedKeyList = [
 [ 'new', TOKEN_TYPE.NEW],
 ['const', TOKEN_TYPE.CONST]
]


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
    if (_.isNil(type) || !this.nextTokenIs(type) ) {
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
      ['?.(', TOKEN_TYPE.OPTIONALCall],
      ['?.', TOKEN_TYPE.OPTIONAL],
      ['?', TOKEN_TYPE.QUESTION], 
      [':', TOKEN_TYPE.COLON],
      ['.', TOKEN_TYPE.POINT],
      [' ', TOKEN_TYPE.SPLIT],
      ['*', TOKEN_TYPE.MUl],
      ['/', TOKEN_TYPE.DIV],
      ['+', TOKEN_TYPE.PLUS],
      ['-', TOKEN_TYPE.SUBTRACT],
      ['(', TOKEN_TYPE.LeftParenthesis],
      [')', TOKEN_TYPE.RightParenthesis],
      ['[', TOKEN_TYPE.LeftBracket],
      [']', TOKEN_TYPE.RightBracket],
      [',', TOKEN_TYPE.COMMA],
      [';', TOKEN_TYPE.SEMICOLON],
      ['=', TOKEN_TYPE.EQUAL],
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
      const wordStr = _.map(word, 'char').join('');
      for(const x of ReservedKeyList) {
        if (x[0] === wordStr) {
         return Token.createToken(x[1], word, prefixTokens)
        }
      }
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

  nextTokenIs(type) {
    const temp = [ 
      this.row,
      this.col,
      this.index
    ]
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
      type: AST_TYPE.Literal,
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
      type: AST_TYPE.Identifier,
      name: token.value,
      restTokens: [token],
    })
  }

  getMemberExpressionAst() {
    const methodName = 'getIdentifierAst'
    let left = this[methodName]()
    let right = null;
    while (this.nextTokenIs([TOKEN_TYPE.POINT, TOKEN_TYPE.OPTIONAL, TOKEN_TYPE.LeftBracket])) {
      let s = this.eatToken();
      const restTokens = [s]
      if (s.is(TOKEN_TYPE.OPTIONAL) && this.nextTokenIs(TOKEN_TYPE.LeftBracket)) {
        s = this.eatToken()
        restTokens.push(s)
      }
      right = this[methodName]()
      if (!right) {
        throw new Error(AST_TYPE.MemberExpression + '属性错误')
      }

      const computed = s.is(TOKEN_TYPE.LeftBracket)
      if (computed) {
        restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket))
      }

      left = new ASTItem({
        type: AST_TYPE.MemberExpression,
        object: left,
        property: right,
        computed,
        optional: restTokens[0].type === TOKEN_TYPE.OPTIONAL,
        restTokens,
      })

    }
    return left;
  }

  getNewExpressionAst() {
    const methodName = 'getExpAst'
    const restTokens = [];
    const args = [];
    restTokens.push(this.eatToken());
    const callee = this[methodName]();
    if (this.nextTokenIs(TOKEN_TYPE.LeftParenthesis)) {
      restTokens.push(this.eatToken());
      if (this.nextTokenIs(TOKEN_TYPE.RightParenthesis)) {
        restTokens.push(this.eatToken());
        return new ASTItem({
          type: AST_TYPE.NewExpression,
          callee,
          arguments: args,
          restTokens,
        })
      }
      // TODO
    }

    return new ASTItem({
      type: AST_TYPE.NewExpression,
      callee,
      arguments: args,
      restTokens,
    })
  }

  getArrayExpressionAst() {
    const methodName = 'getExpAst';
    const restTokens = [this.eatToken()];
    const elements = [];
    const left = this[methodName]();
    if (left) {
      elements.push(left)
    }
    while(this.nextTokenIs(TOKEN_TYPE.COMMA)) {
      restTokens.push(this.eatToken()) 
      const right = this[methodName]();
      if (right) {
        elements.push(right)
      }
    }
    restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket));
    return new ASTItem({
      type: AST_TYPE.ArrayExpression,
      elements,
      restTokens,
    })

  }

  getPriorityAstFunc(attr, tokenType, astType) {
    return () => {
      const restTokens = [];
      let left = this[attr]()
      while (this.nextTokenIs(tokenType)) {
        const operatorToken = this.eatToken();
        restTokens.push(operatorToken);
        let right = this[attr]()
        if (!right) {
          throw new Error('不匹配');
        }
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

  getPrimaryAst() {
    const token = this.nextTokenIs();
    switch (token.type) {
      case TOKEN_TYPE.STRING:
      case TOKEN_TYPE.NUMBER: return this.getLiteralAst();
      case TOKEN_TYPE.NEW: return this.getNewExpressionAst();
      case TOKEN_TYPE.LeftBracket: return this.getArrayExpressionAst();
      case TOKEN_TYPE.LeftParenthesis: 
             const restTokens = [ this.eatToken()];
             const ast = this.getExpAst();
             ast.restTokens = [...restTokens, ...ast.restTokens || [], this.expectToken(TOKEN_TYPE.RightParenthesis)];
             return new ASTItem({
              ...ast,
             });
      case TOKEN_TYPE.WORD: return this.getMemberExpressionAst();
    }
    throw new Error('未处理的语法');
  }

  getMulDivAst = this.getPriorityAstFunc('getPrimaryAst', [
    TOKEN_TYPE.MUl,
    TOKEN_TYPE.DIV,
  ], AST_TYPE.BinaryExpression) 

  getBinaryAst = this.getPriorityAstFunc('getMulDivAst', [
    TOKEN_TYPE.STRICT_EQUAL,
    TOKEN_TYPE.PLUS,
    TOKEN_TYPE.SUBTRACT
  ], AST_TYPE.BinaryExpression) 


  getAndAst = this.getPriorityAstFunc
    ('getBinaryAst', TOKEN_TYPE.AND, AST_TYPE.LogicalExpression);

  getExpAst() {
    const methodName = 'getAndAst'
    const restTokens = [];
    const test = this[methodName]();
    if (this.nextTokenIs(TOKEN_TYPE.QUESTION)) {
      restTokens.push(this.eatToken());
      const consequent = this[methodName]();
      if (!consequent) {
        throw new Error('?:缺失表达式')
      }
      restTokens.push(this.expectToken(TOKEN_TYPE.COLON));
      const alternate = this[methodName]();
      if (!alternate) {
        throw new Error('?:缺失表达式')
      }
      return new ASTItem({
        type: AST_TYPE.ConditionalExpression,
        test,
        consequent,
        alternate,
        restTokens,
      })
    }

    if (this.nextTokenIs([TOKEN_TYPE.LeftParenthesis, TOKEN_TYPE.OPTIONALCall])) {
      
      const restTokens = []
      const optional = this.nextTokenIs(TOKEN_TYPE.OPTIONALCall);
      restTokens.push(this.eatToken())
      const args = [];
      const exp = this.getExpAst();
      if (exp) {
        args.push(exp)
      }
      while(this.nextTokenIs(TOKEN_TYPE.COMMA)) {
        restTokens.push(this.eatToken())
        const exp = this.getExpAst();
        if (exp) {
          args.push(exp)
        }
      }
      restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis))
      return new ASTItem({
        type: AST_TYPE.CallExpression,
        optional,
        callee: test,
        arguments: args,
        restTokens,
      })
    }
    return test;
  }

  getExpressionStatementAst() {
    const expression = this.getExpAst();
    const restTokens = [];
    if (this.nextTokenIs(TOKEN_TYPE.SEMICOLON)) {
      restTokens.push(this.eatToken())
    }
    return new ASTItem({
      type: AST_TYPE.ExpressionStatement,
      expression,
      restTokens
    });
  }

  getVariableDeclaratorAst() {
    const id = this.getIdentifierAst();
    const restTokens = []
    if (this.nextTokenIs([TOKEN_TYPE.EQUAL])) {
      restTokens.push(this.eatToken());
      const init = this.getExpAst();
      return new ASTItem({
        type: AST_TYPE.VariableDeclarator,
        id,
        init,
        restTokens,
      })
    }
    return new ASTItem({
      type: AST_TYPE.VariableDeclarator,
      id,
      restTokens,
    })
  }

  getVariableDeclarationAst() {
    const restTokens = [this.eatToken()];
    const declarations = [];
    const vd = this.getVariableDeclaratorAst();
    if (vd) {
      declarations.push(vd)
    }
    while(this.nextTokenIs(TOKEN_TYPE.COMMA)) {
      restTokens.push(this.eatToken());
      const vd = this.getVariableDeclaratorAst();
      if (vd) {
        declarations.push(vd)
      }
    }
    if (this.nextTokenIs(TOKEN_TYPE.SEMICOLON)) {
      restTokens.push(this.eatToken());
    }
    return new ASTItem({
      type: AST_TYPE.VariableDeclaration,
      declarations,
      kind: restTokens[0].value,
      restTokens,
    })
    
  }

  getStatementAst() {
    const token = this.nextTokenIs();
    // console.log('语句开始', token, this.sourceCode.length)
    switch (token.type) {
      case TOKEN_TYPE.NUMBER:
      case TOKEN_TYPE.STRING:
        return new ASTItem({
          type: ASTItem.ExpressionStatement,
          expression: this.getPrimaryAst(),
        });
      case TOKEN_TYPE.CONST: return this.getVariableDeclarationAst();
      case TOKEN_TYPE.NEW: 
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
      type: AST_TYPE.Program,
      body,
      sourceType: 'module',
    })
  }

}
