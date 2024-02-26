import _ from 'lodash';
import { AST_FLAG_VALUE_LIST, AST_TYPE, AST_TYPE_VALUE_LIST, AstFlagDicts, EOFFlag, METHOD_TYPE, METHOD_TYPE_VALUES_LIST, ReservedKeyList, TOKEN_TYPE, TOKEN_TYPE_VALUE_LIST, prefixDicts, directlyReturnFlag } from './constants';
import { Token, TokenChar } from './Token';
import ASTContext from './AstContext';
import ASTItem from './ASTITem';
import { avoidPureArrowFuncitonExpressionNextTokenIsOperator, ensureAllTypeInList, ensureCannotHadAttrsInSameTime } from './utils';
import { isInstanceOf, log } from '../../commonApi';

// TODO 以后扩展属性记得处理这里的拷贝
const storeAttr = ['astItemList', 'charList', 'tokens', 'config', 'configStack', 'setConfig'];
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
    // 字母，下划线开头
    const c = this.nextCharIs()
    if (!c || c === EOFFlag) {
      return []
    }
    const ret = []
    const isAlpha = (c) => c.toLowerCase() !== c.toUpperCase();
    let flag = false;
    if (this.nextCharIs('_') || isAlpha(this.nextCharIs())) {
      flag = true;
      ret.push(...this.eat())
    }
    if (flag) {
      while (
        this.nextCharIsNumber()
       || isAlpha(this.nextCharIs())
       || this.nextCharIs('_')
       || this.nextCharIs('$')
      ) {
        ret.push(...this.eat())
      }
    }
  
    return ret;
  }

  getLastIsfunc = (ret) => (str) => {
    if (!str) {
      throw new Error('STR 必传')
    }
    return _.last(ret)?.char === str
  }

  eatTemplateLiteralString(fc) {
    if (!this.nextCharIs(fc)) {
      return []
    }
    const ret = [...this.eat()]
    const lastIsNot = (c) => _.last(ret)?.char !== c;
    while(this.sourceCode.length && 
      !(
           (this.nextCharIs('`') && lastIsNot('\\'))
        || (this.nextCharIs('${') && lastIsNot('\\') )
      )) {
      ret.push(...this.eat())
    }
    const isNotEnd = (this.nextCharIs('${') && lastIsNot('\\') );
    ret.push(...this.expectChar(isNotEnd ? '${' : '`'))
    return ret;
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
    const token = this.#eatToken(prefixTokens);
    const ret = this.astContext.pushToken(token)
    this.eatingChar = false;
    return ret;
  }

  #eatToken(prefixTokens = []) {

    if (this.proxyMethod(prefixDicts.is, AstFlagDicts.canUseTemplateLiteralMiddleString)) {
      const templateStringEnd = this.eatTemplateLiteralString('}');
      if (templateStringEnd.length) {
          return Token.createToken(
            _.last(templateStringEnd).char === '`' ? 
            TOKEN_TYPE.TemplateLiteralEnd
            : TOKEN_TYPE.TemplateLiteralMiddle, templateStringEnd, prefixTokens)
      }
    }
    // 字符
    for (const item of [
      ['>>>=', TOKEN_TYPE.UnsignedShiftRightEqual],
      ['===', TOKEN_TYPE.StrictEqual],
      ['<<=', TOKEN_TYPE.ShiftLeftEqual],
      ['>>=', TOKEN_TYPE.ShiftRightEqual],
      ['>>>', TOKEN_TYPE.UnsignedShiftRight],
      ['!==', TOKEN_TYPE.NoStrictEqual],
      ['...', TOKEN_TYPE.Spread],
      ['=>', TOKEN_TYPE.Arrow],
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
      ['//', TOKEN_TYPE.SingleLineRemark],
      ['/*', TOKEN_TYPE.MultipleLineRemark],
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
      ['*', TOKEN_TYPE.Star],
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
      [String.fromCharCode(160), TOKEN_TYPE.Split],
      ['\n', TOKEN_TYPE.WrapLine],
    ]) {
      const c = item[0]
      if (this.nextCharIs(c)) {
        let token;
        if (c === '//'){
          const remark = [...this.eat(c)];
          while (this.sourceCode.length && !this.nextCharIs('\n')) {
            remark.push(...this.eat())
          }
          token = Token.createToken(TOKEN_TYPE.SingleLineRemark, remark, prefixTokens)
        } else if (c === '/*') {
          const remark = [...this.eat(c)];
          while (this.sourceCode.length && !(this.nextCharIs('*/') && _.last(remark)?.char !== '\\')) {
            remark.push(...this.eat())
          }
          remark.push(...this.expectChar('*/'))
          token = Token.createToken(TOKEN_TYPE.MultipleLineRemark, remark, prefixTokens)
        } else {
          token = Token.createToken(item[1], this.eat(c), prefixTokens)
        }
        if ([
           TOKEN_TYPE.MultipleLineRemark,
           TOKEN_TYPE.SingleLineRemark,
           TOKEN_TYPE.Split,
           TOKEN_TYPE.WrapLine].includes(token.type)) {
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
      if (!this.proxyMethod(prefixDicts.is, AstFlagDicts.canUseKeyWordAsKey)) {
        for (const x of ReservedKeyList) {
          if (x[0] === wordStr) {
            return Token.createToken(x[1], word, prefixTokens)
          }
        }
      }
      return Token.createToken(TOKEN_TYPE.Word, word, prefixTokens)
    }

    const str = this.eatString()
    if (str.length) {
      return Token.createToken(TOKEN_TYPE.String, str, prefixTokens)
    }

    const templateStringStart = this.eatTemplateLiteralString('`');
    if (templateStringStart.length) {
        return Token.createToken(
          _.last(templateStringStart).char === '`' ? 
          TOKEN_TYPE.WholeTemplateLiteral
          : TOKEN_TYPE.TemplateLiteralStart, templateStringStart, prefixTokens)
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

  save() {
    if (_.size(this.tempTokensStack)) {
      throw new Error('save调用有误');
    }
    this.lastAstContextStack.push(this.lastAstContext)
    this.lastRowColIndexStack.push(this.lastRowColIndex)
    this.lastRowColIndex = [this.row, this.col, this.index];
    this.lastAstContext ={ 
      ..._.cloneDeep({
      ..._.pick(this.astContext, storeAttr.slice(3)),
       sourceCode: this.sourceCode,
      }),
      ..._.reduce(storeAttr.slice(0, 3), (obj, attr) => {
        return Object.assign(obj, {
          [attr]: [...this.astContext[attr]]
        })
      }, {})
   }
  }

  restore() {
    if (_.isNil(this.lastRowColIndex)) {
      throw new Error('restore调用有误');
    }
    this.sourceCode = _.get(this.lastAstContext, 'sourceCode')
    _.forEach(storeAttr, attr=> {
      this.astContext[attr] = this.lastAstContext[attr];
    })
    this.lastAstContext =  this.lastAstContextStack.pop();
    this.row = this.lastRowColIndex[0]
    this.col =  this.lastRowColIndex[1];
    this.index =  this.lastRowColIndex[2]
    this.lastRowColIndex = this.lastRowColIndexStack.pop();
  }

  consume() {
    if (_.isNil(this.lastRowColIndex)) {
      throw new Error('consume调用有误');
    }
    this.lastRowColIndex = this.lastRowColIndexStack.pop()
    this.lastAstContext = this.lastAstContextStack.pop();
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

  getTokenByIndex(index) {
    this.save()
    let tokens 
    for(let i = 0; i < index; i++) {
      tokens = this.eatToken()
    }
    this.restore();
    return tokens;
  }

  markSourceCode(sourceCode) {
    console.log(_.split(sourceCode, ''), 'sourceCode');
    this.astContext = new ASTContext()
    this.row = 0;
    this.col = 0;
    this.index = 0;
    this.lastAstContext = null;
    this.lastRowColIndex = null;
    this.lastAstContextStack = [];
    this.lastRowColIndexStack = [];
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

  proxyMethod(prefix, type, ...params) {
    if (
      !_.includes(_.values(prefixDicts), prefix) ||
      !_.includes(_.values(AstFlagDicts), type)) {
        console.warn(prefix, type)
      throw new Error('方法调用错误');
    }
    if ([prefixDicts.is, prefixDicts.reset].includes(prefix) && _.size(params)) {
      throw new Error(prefix + '方法后面不应该有参数')
    }
    if (prefix === prefixDicts.set && !_.size(params)) {
      throw new Error('set方法后面至少一个参数')
    }
    return this.astContext.methodStore[prefix + _.upperFirst(type)](...params);
  }

  getPriorityAstFunc(attr, tokenType, astType, config = {
  }) {
    const checkLeft = config.checkLeft ? (x) => {
      avoidPureArrowFuncitonExpressionNextTokenIsOperator(x);
      config.checkLeft(x);
    } : avoidPureArrowFuncitonExpressionNextTokenIsOperator;
    const checkRight = config.checkRight ?? ((x) => null);
    return () => {
      const restTokens = [];
      let left = this[attr]()
      while (this.nextTokenIs(tokenType)) {
        const operatorToken = this.eatToken();
        restTokens.push(operatorToken);

        let right =this.wrapInDecorator(AstFlagDicts.cannotUsePureArrowExpression ,() =>this[attr]());
        checkLeft(left);
        checkRight(right);
        left = this.createAstItem({
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

  getSingleOperatorFunc(method, tokenType, config = {}) {
    const checkArgument = config.checkArgument ?? ((x) => x);
    const injectConfig = config.injectConfig ?? ((restTokens) => ({
      restTokens
    }))
    const ret = () => {

      if (this.nextTokenIs(tokenType)) {
        const restTokens = [this.eatToken()];
        const obj = injectConfig.call(this, restTokens[0]);
        if (!obj.restTokens) {
          throw '获取ast错误restTokens 漏传'
        }
        const shouldJudgeIsCannotUsePureArrowFunciton = [METHOD_TYPE.getUnaryOrUpdateOrAwaitExpression].includes(method);
        if (shouldJudgeIsCannotUsePureArrowFunciton) {
          this.proxyMethod(prefixDicts.set, AstFlagDicts.cannotUsePureArrowExpression, true)
        }
       
        let argument  = ret();
        if (shouldJudgeIsCannotUsePureArrowFunciton) {
          this.proxyMethod(prefixDicts.reset, AstFlagDicts.cannotUsePureArrowExpression)
        }
        return this.createAstItem({
          ...obj,
          argument: checkArgument(argument, this.createAstItem(obj)),
        })
      }
      const temp = this[method]();
      if (window.isDebuggering) {
        console.log(method, temp)
      }
      return temp;
    }
    return ret;
  }

  getConfigableFunc([gConfig, list]) {
    if (_.isString(gConfig)) {
      gConfig = {
        type: gConfig
      }
    }
    if (!_.isObject(gConfig) || !_.has(gConfig, 'type') || !_.includes(AST_TYPE_VALUE_LIST, gConfig.type)) {
      throw 'type不是ast类型'
    }
    const decoratorAttrs = _.filter(_.keys(gConfig), x => _.includes(AST_FLAG_VALUE_LIST, x))
    const fn = () => {
      const restTokens = [];
      const flag = {};
      let config = { type: gConfig.type, restTokens };
      gConfig.before?.call?.(this, config);
      let index = 0;
      const taskList = [...list];
      while(index < taskList.length) {
        const item = taskList[index];
        const beforeList = item.before ? [item.before]: [];
        const afterList = item.after ? [item.after] : [];
        ensureCannotHadAttrsInSameTime(item, ['type', 'ifType', 'expectType', 'dynamicType', 'hookType'])
        const { type, ifType, expectType, dynamicType, hookType } = item;
        if (hookType) {

        }
        if (!ifType && _.has(item, 'flagName')) {
          throw new Error('flagName 只能在ifType使用')
        }

        if (!type && !ifType && _.has(item, 'mayBe')) {
          throw new Error('mayBe 只能在type/ifType使用')
        }
        let hookRet = null;
        const wrapInHook = (cb) => {
          _.forEach(beforeList, hook => hook.call(this, config));
          let ifResult = false;
          ifResult = cb.call(this)
         
          _.forEach(afterList, hook => {
            if (ifType && !ifResult) {
              return
            }
            const t = hook.call(this, config, flag);
            if (t) {
              if (hookRet) {
                throw new Error('已经有返回了')
              }
              hookRet = t;
            }
          })
        }
        let ifResult = false;
        _.forEach(AST_FLAG_VALUE_LIST, q => {
          if (_.has(item, q)) {
            beforeList.unshift(() => this.proxyMethod(prefixDicts.set, q, _.get(item, q)));
            afterList.push(() => this.proxyMethod(prefixDicts.reset, q))
          }
        })
        if (type) {
          ensureAllTypeInList(type, METHOD_TYPE_VALUES_LIST)
          ensureCannotHadAttrsInSameTime(item, ['configName', 'groupName'])
          const { configName, groupName, mayBe, getArguments } = item;
          wrapInHook(() => {
            try {
              if (mayBe) {
                this.save()
              }
              const args = _.isFunction(getArguments) ? getArguments(config) : undefined
              if (configName) {
                if (configName === directlyReturnFlag) {
                  config = this[type](args)
                } else {
                  config[configName] = this[type](args)
                }
              } else {
                if (!_.isArray(config[groupName])) {
                  config[groupName] = []
                }
                config[groupName].push(this[type](args));
              }
              if (mayBe) {
                this.consume();
              }
            } catch(e) {
              if (!mayBe || !isInstanceOf(e.token, Token)) {
                throw e;
              }
              if (mayBe) {
                this.restore()
              }
            } 
          })
        
        } else if (expectType) {
          ensureAllTypeInList(expectType, TOKEN_TYPE_VALUE_LIST)
          wrapInHook(() => {
            const token = this.expectToken(expectType);
            restTokens.push(token)
            if (item.configName) {
              const cb = item.after ?? ((config) => _.get(_.last(config.restTokens), 'value'))
              const ret = cb(config);
              if (!_.isString(ret)) {
                throw 'expectType 配置了configName， after函数返回应该为string'
              }
              config[item.configName] = ret;
            };
          })
        } else if (ifType) {
          ensureAllTypeInList(ifType, TOKEN_TYPE_VALUE_LIST)
          wrapInHook(() => {
            ifResult = this.nextTokenIs(ifType);
          
            taskList.splice(index + 1, 0, ...(ifResult ? item.consequent : item.alternate) || []);
            if (ifResult) {
              if (item.flagName) {
                flag[item.flagName] = true;
              }
              if (!item.noEat) {
                restTokens.push(this.eatToken())
              }
              if (item.ifTrueInjectConfig) {
                if (!_.isObject(item.ifTrueInjectConfig)) {
                  throw 'ifTrueInjectConfig 应该为对象'
                }
                _.forEach(item.ifTrueInjectConfig, (v, k) => {
                  _.set(config, k, v);
                })
              }
            }
            if (item.configName) {
              config[item.configName] = ifResult
            }
            return ifResult;
          })
        } else if (dynamicType) {
          if (!_.isFunction(dynamicType)) {
            throw new Error('配置dynamicType错误')
          }
          wrapInHook(() => {
            const methodName = dynamicType.call(this, this.nextTokenIs());
            if (!item.configName ) {
              throw new Error('配置dynamicType必须配置configName')
            }
            if (item.configName === directlyReturnFlag) {
              config = this[methodName]();
            } else {
              config[item.configName] = this[methodName]()
            }
            
          })
        } else if (hookType) {
          wrapInHook(() => {
            if (!_.isFunction(hookType)) {
              throw 'hookType只能为函数'
            }
            config = hookType.call(this, config) ?? config;
          })
        }

        if (item.configName === directlyReturnFlag) {
          // 调了一下午，仅仅是因为没有break......
          break;
        }

        const hasJump = ((!ifType || ifResult) && _.has(item, 'jump'));
        if ((hookRet && (_.has(hookRet, 'jump')))) {
          if (hasJump) {
            throw '跳转冲突'
          }
          index = _.get(hookRet, 'jump');
        } else if (hasJump) {
          index = _.get(item, 'jump')
        } else {
          index++
        }
      }

      const temp = gConfig.after?.call?.(this, config, flag) ?? config;
      if (isInstanceOf(temp, ASTItem)) {
        return temp
      }

      if (!_.includes(AST_TYPE_VALUE_LIST, temp.type)) {
        throw 'after 函数返回有误';
      }
      return this.createAstItem(temp);
    }
    return _.size(decoratorAttrs) ? this.decorator(decoratorAttrs, fn) : fn;
  }

  decorator(attrs, fn, bol = true) {
    return () => {
      if (arguments.length < 2) {
        throw new Error('方法调用至少要2个参数以上')
      }
      if (!_.isFunction(fn)) {
        throw new Error('第2个参数必须是函数')
      }
      let list = attrs;
      if (_.isString(attrs)) {
        list = [[attrs, bol]];
      }
      list = _.map(list, (item) => {
        if (_.isString(item)) {
          return [item, bol]
        }
        if (_.size(item) !== 2 || !_.isArray(item)) {
          console.log(attrs, fn);
          throw new Error('方法调用错误')
        }
        return item;
      })
      _.forEach(list, ([attr, bool]) => {
        this.proxyMethod(prefixDicts.set, attr, bool)
      })
      const ret = fn.call(this)
      _.forEach(list, ([attr]) => {
        this.proxyMethod(prefixDicts.reset, attr)
      })
      return ret;
    };
  }

  wrapInDecorator(flag, cb, bool = true) {
    ensureAllTypeInList(flag, AST_FLAG_VALUE_LIST)
    let attrs = _.flatten([flag])
    _.forEach(attrs, (x) => {
      this.proxyMethod(prefixDicts.set, x, bool)
    })
    const ret = cb()
    _.forEach(attrs, (x) => {
      this.proxyMethod(prefixDicts.reset, x)
    })
    return ret;
  }
}