import _, { every } from "lodash";
import { AST_FLAG_VALUE_LIST, AST_TYPE, AstFlagDicts, CharacterSetAstTokenList, METHOD_TYPE, TOKEN_TYPE, TOKEN_TYPE_VALUE_LIST, prefixDicts } from "./constant";
import RegExpASTItem from "./RegExpASTItem";
import { TokenChar, RegExpToken } from "./Token";
import { SpecialSign, getInfinity, getRestConfigByAssertionToken, getRestConfigByCharacterSetToken, getValueByToken, hexDicts, isHex, throwError } from "./util";
import ASTContext from "./AstContext";
import { ensureAllTypeInList } from "../ast/utils";


// TODO 以后扩展属性记得处理这里的拷贝
const storeAttr = ['astItemList', 'charList', 'tokens', 'config', 'configStack', 'setConfig'];
const splitIndex = 3;

export default class RegExpAst {

  eat(str) {
    const size = _.size(str) || 1;
    const ret = this.sourceCode.splice(0, size);
    if (!_.size(ret)) {
      throwError('语法错误,提前终止', _.last(this.astContext.tokens))
    }
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

    for (const c of hexDicts) {
      if (this.nextCharIs('\\' + c[0])) {
        const mayBe = this.getCharFromIndex(2, c[1])
        if (isHex(mayBe)) {
          return RegExpToken.createToken(TOKEN_TYPE.Character, this.eat('\\' + c[0] + mayBe), prefixTokens)
        }
      }
    }

    for (const x of SpecialSign) { // TODO 慢慢补
      if (this.nextCharIs(x)) {
        return RegExpToken.createToken(TOKEN_TYPE.Character, this.eat(x), prefixTokens)
      }
    }

    // 字符
    for (const str of TOKEN_TYPE_VALUE_LIST) {
      const item = str.split(' ');
      const c = item[0]
      if (_.size(item) !== 2) {
        continue;
      }

      if (this.nextCharIs(c)) {
        if (
          c === ']'

          ||

          (CharacterSetAstTokenList.includes(str)
            && str !== TOKEN_TYPE.Point)
          ||

          (!this.getStateByFlagType(AstFlagDicts.cannotUseSpecialSignExcludeJoin)
            && !['-', '\\', '(?'].includes(c)
          )

          ||

          (c === '(?' && this.getStateByFlagType(AstFlagDicts.canUseGroupPrefix/*
           在环视捕获group使用
           */))

          ||

          (c === '\\' && this.getStateByFlagType(AstFlagDicts.canUseSlant/* 
          在判断引用时使用
         */))

          ||

          (
            c === '-' && this.getStateByFlagType(AstFlagDicts.canUseJoin/*
          在判断getCharacterClassRangeAst 使用
        */)
          )
        ) {
          // console.warn(item[1], c);
          return RegExpToken.createToken(TOKEN_TYPE[item[1]], this.eat(c), prefixTokens)
        }
      }
    }

    if (this.getStateByFlagType(AstFlagDicts.canMatchNum)) {
      const number = this.eatNumber()
      if (number.length) {
        return RegExpToken.createToken(TOKEN_TYPE.Number, number, prefixTokens)
      }
    }

    const x = this.eat()
    // console.warn(x)
    return RegExpToken.createToken(TOKEN_TYPE.Character, x, prefixTokens)
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

  save() {
    // console.log('save --->', _.size( this.lastAstContextStack))
    if (_.size(this.tempTokensStack)) {
      throw new Error('save调用有误');
    }
    this.lastRowColIndex = [this.row, this.col, this.index];
    this.lastAstContext = {
      ..._.cloneDeep({
        ..._.pick(this.astContext, storeAttr.slice(splitIndex)),
        sourceCode: this.sourceCode,
      }),
      ..._.reduce(storeAttr.slice(0, splitIndex), (obj, attr) => {
        return Object.assign(obj, {
          [attr]: _.size(this.astContext[attr])
        })
      }, {})
    }
    this.lastAstContextStack.push(this.lastAstContext)
    this.lastRowColIndexStack.push(this.lastRowColIndex)
  }

  restore() {
    // console.log('restore <---', _.size( this.lastAstContextStack))
    if (_.isNil(this.lastRowColIndex)) {
      throw new Error('restore调用有误');
    }
    this.lastAstContext = this.lastAstContextStack.pop();
    this.lastRowColIndex = this.lastRowColIndexStack.pop();
    this.sourceCode = _.get(this.lastAstContext, 'sourceCode')
    _.forEach(storeAttr.slice(0, splitIndex), attr => {
      const origin = this.astContext[attr];
      const oldLen = this.lastAstContext[attr];
      this.astContext[attr] = origin.splice(oldLen, _.size(origin) - oldLen);
    })
    _.forEach(storeAttr.slice(splitIndex), attr => {
      this.astContext[attr] = this.lastAstContext[attr];
    })
    this.row = this.lastRowColIndex[0]
    this.col = this.lastRowColIndex[1];
    this.index = this.lastRowColIndex[2]
    this.lastAstContext = _.last(this.lastAstContextStack)
    this.lastRowColIndex = _.last(this.lastRowColIndexStack)
  }

  consume() {
    // console.log('consume <---', _.size( this.lastAstContextStack))
    if (_.isNil(this.lastRowColIndex)) {
      throw new Error('consume调用有误');
    }
    this.lastRowColIndexStack.pop()
    this.lastAstContextStack.pop();
    this.lastAstContext = _.last(this.lastAstContextStack)
    this.lastRowColIndex = _.last(this.lastRowColIndexStack)
  }

  getTokenByCallback(index) {
    this.save()
    let tokens
    if (_.isNumber(index)) {
      for (let i = 0; i < index; i++) {
        tokens = this.eatToken()
      }
    } else if (_.isFunction(index)) {
      tokens = index()
    }
    this.restore();
    return tokens;
  }

  proxyMethod(prefix, type, ...params) {
    if (
      !_.includes(_.values(prefixDicts), prefix) ||
      !_.includes(_.values(AstFlagDicts), type)) {
      console.warn(prefix, type)
      throw new Error('方法调用错误');
    }
    if ([prefixDicts.is, prefixDicts.reset, prefix.get].includes(prefix) && _.size(params)) {
      throw new Error(prefix + '方法后面不应该有参数')
    }
    if ([prefixDicts.set, prefixDicts.push].includes(prefix) && !_.size(params)) {
      throw new Error(prefix + '方法后面至少一个参数')
    }

    if (
      type.startsWith('can') && [prefixDicts.push, prefixDicts.get].includes(prefix)
      || type.startsWith('push') && [prefixDicts.set, prefixDicts.is].includes(prefix)) {
      throw new Error('属性错误')
    }

    return this.astContext.methodStore[prefix + _.upperFirst(type)](...params);
  }

  getStateByFlagType(type) {
    ensureAllTypeInList(type, AST_FLAG_VALUE_LIST)
    return this.proxyMethod(prefixDicts.is, type)
  }

  wrapInDecorator(flag, cb, value = true) {
    ensureAllTypeInList(flag, AST_FLAG_VALUE_LIST)
    let attrs = _.flatten([flag])
    _.forEach(attrs, (x) => {
      const isPushType = x.startsWith('push');
      if (isPushType && arguments.length < 3) {
        throw '漏传值'
      }
      this.proxyMethod(isPushType ? prefixDicts.push : prefixDicts.set, x, value)
    })
    const ret = cb()
    _.forEach(attrs, (x) => {
      this.proxyMethod(prefixDicts.reset, x)
    })
    return ret;
  }

  [METHOD_TYPE.getCapturingGroupAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.LeftParenthesis)];
    // 因为这里获取子组的时候可能也有CapturingGroup, 所以index要先获取，不然顺序会乱
    const index = this.astContext.getReferencesIndex()
    const { alternatives, tempRestTokens } = this[METHOD_TYPE.getAlternativeList](
      [TOKEN_TYPE.RightParenthesis]
    );
    restTokens.push(...tempRestTokens);
    restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis))
    const ret =  this.createAstItem({
      type: AST_TYPE.CapturingGroup,
      alternatives,
      restTokens,
      name: null,
      references: [] 
    })
    this.astContext.pushReferences(index, ret);
    return ret;
  }

  [METHOD_TYPE.getCharacterAst]() {
    // console.log(this.nextTokenIs())
    const restTokens = [this.eatToken()];
    return this.createAstItem({
      type: AST_TYPE.Character,
      value: getValueByToken(restTokens[0]),
      restTokens,
    })
  }

  [METHOD_TYPE.getCharacterSetAst]() {
    const restTokens = [this.expectToken(CharacterSetAstTokenList)];
    return this.createAstItem({
      type: AST_TYPE.CharacterSet,
      ...getRestConfigByCharacterSetToken(restTokens[0]),
      restTokens,
    })
  }



  [METHOD_TYPE.getCharacterClassRangeAst]() {
    const min = this[METHOD_TYPE.getCharacterAst]();
    if (!this.nextTokenIs(TOKEN_TYPE.Join)
      || this.getTokenByCallback(2)?.is(TOKEN_TYPE.RightBracket)
    ) {
      return min
    }
    const restTokens = [this.expectToken(TOKEN_TYPE.Join)];
    const max = this[METHOD_TYPE.getCharacterAst]();
    // console.log(min, max);
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

  [METHOD_TYPE.getMayBeClassRangeOrCharacterSetOrCharacterAst]() {
    const token = this.nextTokenIs();
    if (token.is(TOKEN_TYPE.Character)) {
      return this.wrapInDecorator(AstFlagDicts.canUseJoin, () => this[METHOD_TYPE.getCharacterClassRangeAst]())
    }
    if (token.isOneOf(CharacterSetAstTokenList)) {
      return this[METHOD_TYPE.getCharacterSetAst]()
    }
    throwError('未处理', token)
  }

  [METHOD_TYPE.getCharacterClassAst]() {
    const token = this.nextTokenIs()
    if (!token?.isOneOf([TOKEN_TYPE.LeftBracket, TOKEN_TYPE.Exclude])) {
      throwError('语法错误', token)
    }
    const restTokens = [this.eatToken()];
    const negate = restTokens[0].is(TOKEN_TYPE.Exclude);
    const elements = [];
    while (!this.nextTokenIs(TOKEN_TYPE.RightBracket)) {
      elements.push(
        this.wrapInDecorator([
          AstFlagDicts.cannotUseSpecialSignExcludeJoin,
        ], () =>
          this[METHOD_TYPE.getMayBeClassRangeOrCharacterSetOrCharacterAst]()));
    }
    restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket))
    return this.createAstItem({
      type: AST_TYPE.CharacterClass,
      negate,
      elements,
      restTokens,
    })
  }

  [METHOD_TYPE.getAssertionAst]() {
    const token = this.nextTokenIs()
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
      const { alternatives, tempRestTokens } = this[METHOD_TYPE.getAlternativeList]([TOKEN_TYPE.RightParenthesis])
      restTokens.push(...tempRestTokens);
      // console.warn(alternatives)
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
    const { alternatives, tempRestTokens } = this[METHOD_TYPE.getAlternativeList]([TOKEN_TYPE.RightParenthesis])
    restTokens.push(...tempRestTokens)
    restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis))
    return this.createAstItem({
      type: AST_TYPE.Group,
      alternatives,
      restTokens,
    })
  }

  [METHOD_TYPE.getBackreferenceOrCharacterAst]() {
    if (!this.wrapInDecorator(
      AstFlagDicts.canUseSlant
      , () => this.nextTokenIs()?.is(TOKEN_TYPE.Slant)) ||
      this.wrapInDecorator(AstFlagDicts.canMatchNum, () => {
        const token = this.getTokenByCallback(2);
        return !token?.is(TOKEN_TYPE.Number) || !this.astContext.checkBackreferenceByIndex(Number(token.value))
      })) {
      return this[METHOD_TYPE.getCharacterAst]()
    }

    const restTokens = [this.wrapInDecorator(AstFlagDicts.canUseSlant, () => this.expectToken(TOKEN_TYPE.Slant)),
     this.wrapInDecorator(AstFlagDicts.canMatchNum, () => this.expectToken(TOKEN_TYPE.Number))];
    const ref = Number(restTokens[1].value);
    const ret = this.createAstItem({
      type: AST_TYPE.Backreference,
      ref, // TODO 引用数合法问题后续根据CapturingGroup调整
      restTokens
    })
    this.astContext.pushBackreference(ref, ret);
    return ret;
  }

  [METHOD_TYPE.getAtomAst]() {
    const token = this.nextTokenIs();
    switch (token.type) {
      case TOKEN_TYPE.LeftBracket:
      case TOKEN_TYPE.Exclude: return this[METHOD_TYPE.getCharacterClassAst]();
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
    if (this.wrapInDecorator(AstFlagDicts.canUseGroupPrefix, () => this.nextTokenIs())?.is(TOKEN_TYPE.GroupPrefix)) {
      throwError(' Invalid group', token);
    }
    if (token.type === TOKEN_TYPE.LeftParenthesis) {
      return this[METHOD_TYPE.getCapturingGroupAst]()
    }
    if (CharacterSetAstTokenList.includes(token.type)) {
      return this[METHOD_TYPE.getCharacterSetAst]()
    }
    return this[METHOD_TYPE.getBackreferenceOrCharacterAst]()
  }

  [METHOD_TYPE.getQuantifierAst]() {
    const atom = this[METHOD_TYPE.getAtomAst]();
    const restTokens = []
    const token = this.nextTokenIs();
    // console.warn(token, token.is(TOKEN_TYPE.Star))
    const list = [
      [TOKEN_TYPE.Plus, { min: 1, max: getInfinity() }],
      [TOKEN_TYPE.Star, { min: 0, max: getInfinity() }],
      [TOKEN_TYPE.Question, { min: 0, max: 1 }],
    ]
    for (const [type, injectObj] of list) {
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
      this.save();
      try {
        return this.wrapInDecorator(AstFlagDicts.canMatchNum, () => {
          restTokens.push(this.eatToken());
          let n = this.expectToken(TOKEN_TYPE.Number);
          restTokens.push(n)
          const min = Number(n.value);
          let max = min;
          if (this.nextTokenIs(TOKEN_TYPE.Comma)) {
            restTokens.push(this.eatToken());
            if (this.nextTokenIs(TOKEN_TYPE.Number)) {
              n = this.expectToken(TOKEN_TYPE.Number);
              restTokens.push(n)
              max = Number(n.value);
            } else if (this.nextTokenIs(TOKEN_TYPE.RightBrace)) {
              max = getInfinity()
            }
          }
          restTokens.push(this.expectToken(TOKEN_TYPE.RightBrace))
          this.consume()
          return this.createAstItem({
            type: AST_TYPE.Quantifier,
            min,
            max,
            greedy: true,
            element: atom,
            restTokens,
          })
        })
      } catch (e) {
        this.restore()
      }
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

  [METHOD_TYPE.getAlternativeAst](excludeList = []) {
    const elements = [];
    if (!_.size(excludeList) || !this.nextTokenIs(excludeList)) {
      const ast = this[METHOD_TYPE.getQuantifierAst]();
      elements.push(ast);
    }
    while (!this.nextTokenIs([TOKEN_TYPE.Or, TOKEN_TYPE.Div, ...excludeList])) {
      elements.push(this[METHOD_TYPE.getQuantifierAst]());
    }
    return this.createAstItem({
      type: AST_TYPE.Alternative,
      elements,
      restTokens: _.size(elements) ? [] : [_.last(this.astContext.tokens)],
    })
  }

  [METHOD_TYPE.getAlternativeList](excludeList = []) {
    const tempRestTokens = [];
    const alternatives = [];
    alternatives.push(this[METHOD_TYPE.getAlternativeAst](excludeList));
    while (this.nextTokenIs(TOKEN_TYPE.Or)) {
      tempRestTokens.push(this.eatToken());
      alternatives.push(this[METHOD_TYPE.getAlternativeAst](excludeList))
    }
    return {
      alternatives,
      tempRestTokens,
    }
  }

  [METHOD_TYPE.getPatternAst]() {
    const restTokens = [];
    const { alternatives, tempRestTokens } = this[METHOD_TYPE.getAlternativeList]();
    restTokens.push(...tempRestTokens);
    return this.createAstItem({
      type: AST_TYPE.Pattern,
      alternatives,
      restTokens,
    })
  }

  [METHOD_TYPE.getFlagsAst]() {
    const restTokens = []
    while (this.sourceCode.length && !this.nextTokenIs(TOKEN_TYPE.WrapLine)) {
      const token = this.eatToken()
      //TODO 先处理这俩个
      if (!_.includes(['i', 'g', 'm'], token.value)) {
        throwError('未处理的flag类型', token);
      }
      if (_.some(restTokens, ['value', token.value])) {
        throwError('flag类型重复出现', token);
      }
      restTokens.push(token)
    }
    return this.createAstItem({
      type: AST_TYPE.Flags,
      raw: '',
      global: _.some(restTokens, ['value', 'g']),
      ignoreCase: _.some(restTokens, ['value', 'i']),
      multiline: _.some(restTokens, ['value', 'm']),
      unicode: false,
      sticky: false,
      dotAll: false,
      hasIndices: false,
      restTokens: _.size(restTokens) ? restTokens : [_.last(this.astContext.tokens)],
    })
  }

  [METHOD_TYPE.getRegExpLiteralAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.Div)];
    const pattern = this[METHOD_TYPE.getPatternAst]()
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
    if (!_.includes(_.values(AST_TYPE), obj.type)) {
      throw new Error('type 必传')
    }
    if (!_.has(obj, 'restTokens')) {
      console.warn(obj);
      throw new Error('restTokens 漏传')
    }
    return this.astContext.pushAstItem(new RegExpASTItem(obj))
  }

  parse(str) {
    console.log(str)
    this.index = 0;
    this.row = 0;
    this.col = 0;
    this.sourceCode = _.split(str, '');
    this.lastAstContextStack = [];
    this.lastRowColIndexStack = [];
    this.astContext = new ASTContext();
    try {
      const ast = this[METHOD_TYPE.getRegExpLiteralAst]();
      if (_.map(ast.tokens, 'value').join('') !== str) {
        console.warn([_.map(ast.tokens, 'value').join(''), str])
        throw 'token 有遗漏'
      }
      return ast;
    } catch (e) {
      console.log(e, this.astContext)
      throw e;
    }
  }

}