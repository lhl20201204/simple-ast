import _, { every } from "lodash";
import { AST_TYPE, CharacterSetAstTokenList, METHOD_TYPE, TOKEN_TYPE, TOKEN_TYPE_VALUE_LIST } from "./constant";
import RegExpASTItem from "./RegExpASTItem";
import { TokenChar, RegExpToken } from "./Token";
import { getInfinity, getRestConfigByAssertionToken, getRestConfigByCharacterSetToken, getValueByToken, throwError } from "./util";
import ASTContext from "./AstContext";

export default class RegExpAst  {

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

  getCharFromIndex(index, size) {
    return this.sourceCode.slice(index, index + size).join('');
  }

  eatToken(prefixTokens = []) {
    this.eatingChar = true;
    const token = this.#eatToken(prefixTokens);
    this.astContext.pushToken(token)
    this.eatingChar = false;
    return token;
  }

  #eatToken(prefixTokens = []) {
    // 字符
    for (const str of TOKEN_TYPE_VALUE_LIST) {
      const item = str.split(' ');
      const c = item[0]
      if (_.size(item) !== 2) {
        continue;
      }
      if (this.nextCharIs(c)) {
        return RegExpToken.createToken(TOKEN_TYPE[item[1]], this.eat(c), prefixTokens)
      }
    }

    const number = this.eatNumber()
    if (number.length) {
      return RegExpToken.createToken(TOKEN_TYPE.Number, number, prefixTokens)
    }

    if (this.nextCharIs('\\u')) {
      const mayBe = this.getCharFromIndex(2, 4)
      if (_.every(mayBe, c => /[0-9A-Fa-f]/.match(c))) {
        return RegExpToken.createToken(TOKEN_TYPE.Character, this.eat('\\u' + mayBe), prefixTokens)
      }
    }

    return RegExpToken.createToken(TOKEN_TYPE.Character, this.eat(), prefixTokens)
  }

  expectToken(type) {
    if (_.isNil(type) || !this.nextTokenIs(type)) {
      // console.log(new Error().stack)
      const token = this.eatToken();
      // console.log(type, this.astContext)
      const e = new Error(`${token.startRow}行:${token.startCol}列-${token.endRow}行:${token.endCol}列  预期是${type}`);
      e.token = token
      throw e;
    }
    return this.eatToken();
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

  [METHOD_TYPE.getCapturingGroupAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.LeftParenthesis)];
    const { alternatives, tempRestTokens } = this[METHOD_TYPE.getAlternativeList]();
    restTokens.push(...tempRestTokens);
    return this.createAstItem({
      type: AST_TYPE.CapturingGroup,
      alternatives,
      restTokens,
    })
  }

  [METHOD_TYPE.getCharacterAst]() {
    // console.log(this.nextTokenIs())
    const restTokens = [ this.expectToken([TOKEN_TYPE.Character, TOKEN_TYPE.Number])];
    return this.createAstItem({
      type: AST_TYPE.Character,
      value: getValueByToken(restTokens[0]),
      restTokens,
    })
  }

  [METHOD_TYPE.getCharacterSetAst]() {
    const restTokens = [this.expectToken(CharacterSetAstTokenList)];
    return this.createAstItem( {
      type: AST_TYPE.CharacterSet,
      ...getRestConfigByCharacterSetToken(restTokens[0]),
      restTokens,
    })
  }

  [METHOD_TYPE.getCharacterClassRangeAst]() {
    const min = this[METHOD_TYPE.getCharacterAst]();
    if (!this.nextTokenIs(TOKEN_TYPE.Join)) {
      return min
    }
    const restTokens = [this.expectToken(TOKEN_TYPE.Join)];
    const max = this[METHOD_TYPE.getCharacterAst]();
    if (max.value < min.value) {
      throwError('range start>end', restTokens[0])
    }
    return this.createAstItem({
      type: AST_TYPE.CharacterClassRange,
      min,
      max,
      restTokens,
    })
  }

  [METHOD_TYPE.getCharacterClassAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.LeftBracket, TOKEN_TYPE.Exclude)];
    const negate = restTokens[0].is(TOKEN_TYPE.Exclude);
    const elements = [];
    while(!this.nextTokenIs(TOKEN_TYPE.RightBracket)) {
      elements.push(this[METHOD_TYPE.getCharacterClassRangeAst]());
    }
    restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket))
    return this.createAstItem({
      type: AST_TYPE.CharacterClass,
      negate,
      elements,
      restTokens,
    })
  }

  getGroupLikeAlternatives() {
    return [ this[METHOD_TYPE.getAlternativeAst]()]
  }

  [METHOD_TYPE.getAssertionAst]() {
    const token = this.nextTokenIs();
    if (token.isOneOf([TOKEN_TYPE.Start, TOKEN_TYPE.End, TOKEN_TYPE.DemarcationLine, TOKEN_TYPE.NotDemarcationLine])) {
      return this.createAstItem({
        type: AST_TYPE.Assertion,
        ...getRestConfigByAssertionToken(token),
        restTokens: [this.eatToken()]
      })
    } 

    if (token.isOneOf([
      TOKEN_TYPE.LookAheagNegate,
      TOKEN_TYPE.Lookahead,
      TOKEN_TYPE.Lookbehind,
      TOKEN_TYPE.LookbehindNegate
    ])) {
      const restTokens = [this.eatToken()];
      const alternatives = this.getGroupLikeAlternatives();
      restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis))
      return this.createAstItem({
        type: AST_TYPE.Assertion,
        ...getRestConfigByAssertionToken(token),
        alternatives,
        restTokens,
      })
    }
    throwError('未处理的类型', token)
  }

  [METHOD_TYPE.getGroupAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.Group)];
    const alternatives = this.getGroupLikeAlternatives();
    restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis))
    return this.createAstItem({
      type: AST_TYPE.Group,
      alternatives,
      restTokens,
    })
  }

  [METHOD_TYPE.getAtomAst] () {
    const token = this.nextTokenIs();
    switch(token.type) {
      case TOKEN_TYPE.LeftParenthesis:  return this[METHOD_TYPE.getCapturingGroupAst]();
      case TOKEN_TYPE.LeftBracket:
      case TOKEN_TYPE.Exclude: return this[METHOD_TYPE.getCharacterClassAst]();
      case TOKEN_TYPE.Character: return this[METHOD_TYPE.getCharacterClassRangeAst]();
      case TOKEN_TYPE.Start:
      case TOKEN_TYPE.End:
      case TOKEN_TYPE.Lookahead:
      case TOKEN_TYPE.Lookbehind:
      case TOKEN_TYPE.LookAheagNegate:
      case TOKEN_TYPE.LookbehindNegate:
      case TOKEN_TYPE.NotDemarcationLine:
      case TOKEN_TYPE.DemarcationLine: return this[METHOD_TYPE.getAssertionAst]();
      case TOKEN_TYPE.Group: return this[METHOD_TYPE.getGroupAst]();
    }
    if (CharacterSetAstTokenList.includes(token.type)) {
      return this[METHOD_TYPE.getCharacterSetAst]()
    }

    throwError('未处理的', token);
  }

  [METHOD_TYPE.getQuantifierAst] () {
    const atom = this[METHOD_TYPE.getAtomAst]();
    const restTokens = []
    const token = this.nextTokenIs();
    // console.warn(token, token.is(TOKEN_TYPE.Star))
    const list = [
      [TOKEN_TYPE.Plus, { min: 1, max: getInfinity() }],
      [TOKEN_TYPE.Star, { min: 0, max: getInfinity()}],
      [TOKEN_TYPE.Question, {min: 0, max: 1}],
    ]
    for(const [type, injectObj ] of list) {
      if (token.is(type)) {
        restTokens.push(this.eatToken())
        return this.createAstItem({
          type: AST_TYPE.Quantifier,
           ...injectObj,
          greedy: true,
          element: atom,
          restTokens,
        })
      }
    }
    if (token.is(TOKEN_TYPE.LeftBrace)) {
      restTokens.push(this.eatToken());
      let n = this.expectToken(TOKEN_TYPE.Number);
      restTokens.push(n)
      const min = Number(n.value);
      let max = min;
      if (this.nextTokenIs(TOKEN_TYPE.Comma)) {
        restTokens.push(this.eatToken());
        n = this.expectToken(TOKEN_TYPE.Number);
        restTokens.push(n)
        max = Number(n.value);
      }
      restTokens.push(this.expectToken(TOKEN_TYPE.RightBrace))
      return this.createAstItem({
        type: AST_TYPE.Quantifier,
          min,
          max,
          greedy: true,
          element: atom,
          restTokens,
      })
    }
    if (token.is(TOKEN_TYPE.NotGreedyMatch)) {
      restTokens.push(this.eatToken());
      return this.createAstItem({
        type: AST_TYPE.Quantifier,
          min: 0,
          max: getInfinity(),
          greedy: false,
          element: atom,
          restTokens,
      })
    }
    return atom;
  }

  [METHOD_TYPE.getAlternativeAst] () {
    const elements = [];
    const ast = this[METHOD_TYPE.getQuantifierAst]();
    elements.push(ast);
    while(!this.nextTokenIs([TOKEN_TYPE.Or, TOKEN_TYPE.Div])) {
      elements.push(this[METHOD_TYPE.getQuantifierAst]());
    }
    return this.createAstItem({
      type: AST_TYPE.Alternative,
      elements,
      restTokens: [],
    })
  }

  [METHOD_TYPE.getAlternativeList] () {
    const tempRestTokens = [];
    const alternatives = [];
    alternatives.push(this[METHOD_TYPE.getAlternativeAst]());
    while(this.nextTokenIs(TOKEN_TYPE.Or)) {
      tempRestTokens.push(this.eatToken());
      if (!this.nextTokenIs(TOKEN_TYPE.Div)) {
        alternatives.push(this[METHOD_TYPE.getAlternativeAst]())
      }
    }
    return {
      alternatives,
      tempRestTokens,
    }
  }

  [METHOD_TYPE.getPatternAst] () {
    const restTokens = [];
    const { alternatives, tempRestTokens} = this[METHOD_TYPE.getAlternativeList]();
    restTokens.push(...tempRestTokens);
    return this.createAstItem({
      type: AST_TYPE.Pattern,
      alternatives,
      restTokens,
    })
  }

  [METHOD_TYPE.getFlagsAst] () {
    const restTokens = []
    while(this.sourceCode.length) {
      const token = this.eatToken()
      //TODD 先处理这俩个
      if (!_.includes(['i', 'g', 'm'], token.value)) {
        throwError('未处理的flag类型', token);
      }
      if (_.some(restTokens, ['value', token.value])) {
        throwError('flag类型重复出现', token);
      }
      restTokens.push(token)
    }
    // TODO 
    return this.createAstItem({
      type: AST_TYPE.Flags,
      raw: '',
      global: _.some(restTokens, ['value', 'g']),
      ignoreCase:  _.some(restTokens, ['value', 'i']),
      multiline:  _.some(restTokens, ['value', 'm']),
      unicode: false,
      sticky: false,
      dotAll: false,
      hasIndices: false,
      restTokens: _.size(restTokens) ? restTokens : [_.last(this.astContext.tokens)],
    })
  }

  [METHOD_TYPE.getRegExpLiteralAst] () {
    const restTokens = [this.expectToken(TOKEN_TYPE.Div)];
    const pattern =  this[METHOD_TYPE.getPatternAst]()
    restTokens.push(this.expectToken(TOKEN_TYPE.Div));
    let flags = this[METHOD_TYPE.getFlagsAst]()
    return this.createAstItem({
      type: AST_TYPE.RegExpLiteral,
      pattern,
      flags,
      restTokens,
    })
  }
  
  createAstItem(obj) {
    if (!_.includes(_.values(AST_TYPE),obj.type)) {
      throw new Error('type 必传')
    }
    if (!_.has(obj, 'restTokens')) {
      console.warn(obj);
      throw new Error('restTokens 漏传')
    }
     return this.astContext.pushAstItem(new RegExpASTItem(obj))
  }

  parse(str) {
    this.index = 0;
    this.row = 0;
    this.col = 0;
    this.sourceCode = _.split(str, '');
    this.astContext = new ASTContext();
    try {
      const ast =  this[METHOD_TYPE.getRegExpLiteralAst]();
      if (_.map(ast.tokens, 'value').join('') !== str) {
        throw 'token 有遗漏'
      }
      return ast;
    } catch(e) {
      console.log(e, this.astContext)
      throw e;
    }
  }

}