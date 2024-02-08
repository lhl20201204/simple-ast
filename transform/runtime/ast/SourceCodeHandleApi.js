import _ from 'lodash';
import { AST_TYPE, EOFFlag, ReservedKeyList, TOKEN_TYPE } from './constants';
import { Token, TokenChar } from './Token';
import ASTContext from './AstContext';
import ASTItem from './ASTITem';
const TOKEN_TYPE_VALUE_LIST = _.values(TOKEN_TYPE)
export class SourceCodeHandleApi {
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
    if (_.isNil(type) || !this.nextTokenIs(type)) {
      const token = this.eatToken();;
      const e = new Error(`${token.startRow}行:${token.startCol}列-${token.endRow}行:${token.endCol}列  预期是${type}`);
      e.token = token
      throw e;
    }
    return this.eatToken();
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

      const tc = new TokenChar({
        col: curCol,
        char: c,
        row: curRow,
        index: this.index++,
      })
      if (this.eatingChar) {
        this.astContext.pushTokenChar(tc)
      }
      return tc;
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

    while (!this.nextCharIs('\n') && (!this.nextCharIs(c) || lastIs('\\')) && this.sourceCode.length) {
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
    this.eatingChar = true;
    const ret = this.astContext.pushToken(this.#eatToken(prefixTokens))
    this.eatingChar = false;
    return ret;
  }

  #eatToken(prefixTokens = []) {
    // 字符
    for (const item of [
      ['>>>=', TOKEN_TYPE.UnsignedShiftRightEqual],
      ['===', TOKEN_TYPE.StrictEqual],
      ['?.[', TOKEN_TYPE.OptionalComputedGet],
      ['?.(', TOKEN_TYPE.OptionalCall],
      ['<<=', TOKEN_TYPE.ShiftLeftEqual],
      ['>>=', TOKEN_TYPE.ShiftRightEqual],
      ['>>>', TOKEN_TYPE.UnsignedShiftRight],
      ['!==', TOKEN_TYPE.NoStrictEqual],
      ['...', TOKEN_TYPE.Spread],
      ['++', TOKEN_TYPE.SelfAdd],
      ['--', TOKEN_TYPE.SelfSub],
      ['**', TOKEN_TYPE.DoubleStar],
      ['>>', TOKEN_TYPE.ShiftRight],
      ['<<', TOKEN_TYPE.ShiftLeft],
      ['^=', TOKEN_TYPE.XorEqual],
      ['<=', TOKEN_TYPE.LessEqual],
      ['>=', TOKEN_TYPE.GreatEqual],
      ['!=', TOKEN_TYPE.NoCompare],
      ['&&', TOKEN_TYPE.And],
      ['||', TOKEN_TYPE.OR],
      ['==', TOKEN_TYPE.Compare],
      ['?.', TOKEN_TYPE.Optional],
      ['+=', TOKEN_TYPE.PlusEqual],
      ['-=', TOKEN_TYPE.SubEqual],
      ['*=', TOKEN_TYPE.StarEqual],
      ['/=', TOKEN_TYPE.DivEqual],
      ['%=', TOKEN_TYPE.ModEqual],
      ['&=', TOKEN_TYPE.SingleAndEqual],
      ['|=', TOKEN_TYPE.SingleOrEqual],
      ['^=', TOKEN_TYPE.XorEqual],
      ['??', TOKEN_TYPE.DoubleQuestion],
      ['{', TOKEN_TYPE.LeftBrace],
      ['}', TOKEN_TYPE.RightBrace],
      ['<', TOKEN_TYPE.Less],
      ['>', TOKEN_TYPE.Great],
      ['~', TOKEN_TYPE.Non],
      ['!', TOKEN_TYPE.Exclamation],
      ['%', TOKEN_TYPE.Mod],
      ['|', TOKEN_TYPE.SingleOr],
      ['^', TOKEN_TYPE.SingleXor],
      ['&', TOKEN_TYPE.SingelAnd],
      ['?', TOKEN_TYPE.Question],
      [':', TOKEN_TYPE.Colon],
      ['.', TOKEN_TYPE.Point],
      [' ', TOKEN_TYPE.Split],
      ['*', TOKEN_TYPE.Mul],
      ['/', TOKEN_TYPE.Div],
      ['+', TOKEN_TYPE.Plus],
      ['-', TOKEN_TYPE.Subtract],
      ['(', TOKEN_TYPE.LeftParenthesis],
      [')', TOKEN_TYPE.RightParenthesis],
      ['[', TOKEN_TYPE.LeftBracket],
      [']', TOKEN_TYPE.RightBracket],
      [',', TOKEN_TYPE.Comma],
      [';', TOKEN_TYPE.Semicolon],
      ['=', TOKEN_TYPE.Equal],
      ['*', TOKEN_TYPE.Star],
      [String.fromCharCode(160), TOKEN_TYPE.Split],
      ['\n', TOKEN_TYPE.WrapLine],
    ]) {
      const c = item[0]
      if (this.nextCharIs(c)) {
        const token = Token.createToken(item[1], this.eat(c), prefixTokens)
        if ([TOKEN_TYPE.Split, TOKEN_TYPE.WrapLine].includes(token.type)) {
          return this.#eatToken([...prefixTokens, token]);
        }
        return token;
      }
    }

    const number = this.eatNumber()
    if (number.length) {
      return Token.createToken(TOKEN_TYPE.Number, number, prefixTokens)
    }

    const word = this.eatWord()
    if (word.length) {
      const wordStr = _.map(word, 'char').join('');
      for (const x of ReservedKeyList) {
        if (x[0] === wordStr) {
          return Token.createToken(x[1], word, prefixTokens)
        }
      }
      return Token.createToken(TOKEN_TYPE.Word, word, prefixTokens)
    }

    const str = this.eatString()
    if (str.length) {
      return Token.createToken(TOKEN_TYPE.String, str, prefixTokens)
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
    const token = this.#eatToken();
    if (!token) {
      return null;
    }
    this.sourceCode.unshift(..._.map(_.flatten(_.map(token.prefixTokens, 'chars'), 'char'), 'char'), ..._.map(token.chars, 'char'))
    this.row = temp[0];
    this.col = temp[1];
    this.index = temp[2]
    if (arguments.length === 0) {
      return token
    }

    if ((_.isString(type) && !_.includes(TOKEN_TYPE_VALUE_LIST, type)) || (Array.isArray(type) &&
     type.some(x => !_.includes(TOKEN_TYPE_VALUE_LIST, x)))) {
      console.warn(...arguments);
      throw new Error('错误的TOKEN_type')
    }
    if (Array.isArray(type)) {
      return type.some(t => this.nextTokenIs(t))
    }
    return token.type === type;
  }


  markSourceCode(sourceCode) {
    console.log(_.split(sourceCode, ''), 'sourceCode');
    this.astContext = new ASTContext()
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
    return ret.filter(c => c.type !== TOKEN_TYPE.Split);
  }

  setSourceCode(sourceCode) {
    return this.markSourceCode(sourceCode)
  }

  createAstItem(obj) {
    if (!_.includes(_.values(AST_TYPE),obj.type)) {
      throw new Error('type 必传')
    }
    if (!_.has(obj, 'restTokens')) {
      console.warn(obj);
      throw new Error('restTokens 漏传')
    }
    return this.astContext.pushAstItem(new ASTItem(obj))
  }

  copyAstItem(ast) {
    return this.createAstItem({ ...ast, restTokens: ast.tokens });
  }
}