import _ from "lodash";
import { avoidPureArrowFuncitonExpressionNextTokenIsOperator, checkThrowIfSameName, getValueOfLiteralToken, onlyAllowMemberExpressionOrIdentifier, throwError, valueToRaw } from "./utils";
import { isInstanceOf, log } from "../../commonApi";
import { AST_TYPE, AstFlagDicts, METHOD_TYPE, TOKEN_TYPE, commonLiteral, definePriorityConfig, prefixDicts } from "./constants";
import { Token } from "./Token";
import { SourceCodeHandleApi } from "./SourceCodeHandleApi";
import { MethodConfig } from "./MethodConfig";

export default class AST extends SourceCodeHandleApi {
  getBlockStatementBodyContent(type) {
    const body = []
    while (this.sourceCode.length && !this.nextTokenIs(type)) {
      const current = this.nextTokenIs();
      if (body.length) {
        if (
          isInstanceOf(current, Token) &&
          !_.last(this.astContext.tokens).is?.(TOKEN_TYPE.Semicolon) &&
          !_.find(current.prefixTokens, ['type', TOKEN_TYPE.WrapLine])
        ) {
          // console.warn(this.astContext.tokens, _.last(this.astContext.tokens).is?.(TOKEN_TYPE.Semicolon))
          throwError('前面可能缺少运算符', current)
        }

      }
      const ast = this[METHOD_TYPE.getStatementOrExpressionAst]()
      if (ast) {
        body.push(ast)
      }
    }
    return body;
  }

  [METHOD_TYPE.getLiteralAst]() {
    const token = this.expectToken([
      TOKEN_TYPE.String,
      TOKEN_TYPE.Number,
      TOKEN_TYPE.true,
      TOKEN_TYPE.false,
      TOKEN_TYPE.null,
    ])
    return (this.createAstItem({
      type: AST_TYPE.Literal,
      value: getValueOfLiteralToken(token),
      raw: valueToRaw(token),
      restTokens: [token],
    }));
  }

  [METHOD_TYPE.getIdentifierAst]() {
    const token = this.expectToken([
      TOKEN_TYPE.Word,
      TOKEN_TYPE.undefined,
      TOKEN_TYPE.NaN,
      TOKEN_TYPE.arguments
    ])
    return this.createAstItem({
      type: AST_TYPE.Identifier,
      name: token.value,
      restTokens: [token],
    })
  }

  [METHOD_TYPE.getFunctionParams] = this.decorator([
    AstFlagDicts.canRestable,
    AstFlagDicts.canUseAssignmentPattern,
  ], () => {
    const restTokens = [this.expectToken(TOKEN_TYPE.LeftParenthesis)];
    const params = [];
    if (this.nextTokenIs(TOKEN_TYPE.RightParenthesis)) {
      restTokens.push(this.eatToken())
      return {
        restTokens,
        params,
      }
    }
    params.push(this[METHOD_TYPE.getPatternAst]())
    while (this.nextTokenIs(TOKEN_TYPE.Comma)) {
      restTokens.push(this.eatToken());
      if (!this.nextTokenIs(TOKEN_TYPE.RightParenthesis)) {
        const ast = this[METHOD_TYPE.getPatternAst]();
        params.push(ast)
        if (ast.is(AST_TYPE.RestElement)) {
          break;
        }
      }
    }
    restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis));
    checkThrowIfSameName(params)
    return {
      restTokens,
      params,
    }
  });

  [METHOD_TYPE.getObjectPropertyMethod]() {
    if (!this.nextTokenIs(TOKEN_TYPE.LeftParenthesis)) {
      throwError('预期是左括号', this.nextTokenIs())
    }
    const { params, restTokens } = this[METHOD_TYPE.getFunctionParams]();
    return {
      params,
      restTokens,
      body: this[METHOD_TYPE.getBlockStatementAst](),
    }
  }


  [METHOD_TYPE.getObjectProperties](config) {
    const token = this.nextTokenIs();
    const restTokens = []
    if (!token.is(TOKEN_TYPE.Word) && !token.is(TOKEN_TYPE.LeftBracket)) {
      throwError('未处理的对象属性', token)
    }
    const computed = token.is(TOKEN_TYPE.LeftBracket);
    if (computed) {
      restTokens.push(this.eatToken())
    }
    const key = this[computed ? METHOD_TYPE.getExpAst : METHOD_TYPE.getIdentifierAst]();
    if (computed) {
      restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket))
    }
    if ((computed && !this.nextTokenIs(TOKEN_TYPE.LeftParenthesis)) 
    || this.nextTokenIs(TOKEN_TYPE.Colon)) {
      restTokens.push(this.expectToken(TOKEN_TYPE.Colon));
      const value = this[METHOD_TYPE.getYieldExpression]();
      return {
        method: false,
        key,
        value,
        computed,
        restTokens,
        shorthand: false,
      }
    } 
  if (computed || this.nextTokenIs(TOKEN_TYPE.LeftParenthesis)) {
    if (config.async) {
      this.proxyMethod(prefixDicts.set, AstFlagDicts.canAwaitable, true);
    }
    if (config.generator) {
      this.proxyMethod(prefixDicts.set, AstFlagDicts.canYieldable, true)
    }
    const value = this[METHOD_TYPE.getObjectPropertyMethod]();
    if (config.async) {
      this.proxyMethod(prefixDicts.reset, AstFlagDicts.canAwaitable)
    }
    if (config.generator) {
      this.proxyMethod(prefixDicts.reset, AstFlagDicts.canYieldable)
    }
    return {
      method: true,
      key,
      value,
      computed,
      restTokens,
      shorthand: false,
    }
  }
   return {
    method: false,
    key,
    value: this.copyAstItem(key),
    computed: false,
    restTokens,
    shorthand: true,
   }
  }

  [METHOD_TYPE.getArrowFunctionExpressionAst]() {
    if (this.proxyMethod(prefixDicts.is, AstFlagDicts.cannotUsePureArrowExpression)) {
      const restTokens = [this.expectToken(TOKEN_TYPE.LeftParenthesis)];
      this.proxyMethod(prefixDicts.set, AstFlagDicts.cannotUsePureArrowExpression, false)
      const ast = this[METHOD_TYPE.getExpAst]();
      this.proxyMethod(prefixDicts.reset, AstFlagDicts.cannotUsePureArrowExpression);
      const ret = this.createAstItem({
        ...ast,
        restTokens: [...restTokens, ...ast.tokens, this.expectToken(TOKEN_TYPE.RightParenthesis)]
      })
      if (this.nextTokenIs(TOKEN_TYPE.Arrow)) {
        throwError('可能需要对箭头函数加括号', this.nextTokenIs())
      }
      return ret;
    }
    this.save();

    let restTokens = [this.expectToken(TOKEN_TYPE.LeftParenthesis)];
    if (this.nextTokenIs(TOKEN_TYPE.RightParenthesis)) {
      restTokens.push(this.eatToken(), this.expectToken(TOKEN_TYPE.Arrow));
      const body = this[this.nextTokenIs(TOKEN_TYPE.LeftBrace) ? METHOD_TYPE.getBlockStatementAst : METHOD_TYPE.getSpreadElement]();
      this.consume()
      return this.createAstItem({
        type: AST_TYPE.ArrowFunctionExpression,
        id: null,
        expression: !body.is(AST_TYPE.BlockStatement),
        generator: false,
        async: false,
        params: [],
        body,
        restTokens
      })
    }
    try {
      const expressions = [];
      const ast = this[METHOD_TYPE.getSpreadElement]();
      expressions.push(ast)
      let lastIsComma = false;
      while (this.nextTokenIs(TOKEN_TYPE.Comma)) {
        restTokens.push(this.eatToken())
        if (!this.nextTokenIs(TOKEN_TYPE.RightParenthesis)) {
          expressions.push(this[METHOD_TYPE.getSpreadElement]());
        } else {
          lastIsComma = true;
        }
      }
      restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis));

      if (!this.nextTokenIs(TOKEN_TYPE.Arrow)) {
        if (lastIsComma) {
          throwError('表达式结尾不能是', restTokens[restTokens.length - 2])
        }
        const c = _.find(expressions, ['type', AST_TYPE.SpreadElement])
        if (c) {
          throwError('表达式内不能使用', c.tokens[0])
        }
        this.consume()
        if (_.size(expressions) === 1) {
          const ast = expressions[0];
          return this.createAstItem({
            ...ast,
            restTokens: [restTokens[0], ...ast.tokens, restTokens[1]]
          });
        }
        return this.createAstItem({
          type: AST_TYPE.SequenceExpression,
          expressions,
          restTokens,
        })
      }
    } catch (e) {
      console.log(e);
      if (isInstanceOf(e.token, Token)) {
        throw e;
      }
    }
    this.restore()
    const { params, restTokens: tempRestTokens } = this[METHOD_TYPE.getFunctionParams]();
    restTokens = tempRestTokens;
    restTokens.push(this.expectToken(TOKEN_TYPE.Arrow));
    const body = this[this.nextTokenIs(TOKEN_TYPE.LeftBrace) ? METHOD_TYPE.getBlockStatementAst : METHOD_TYPE.getSpreadElement]();
    return this.createAstItem({
      type: AST_TYPE.ArrowFunctionExpression,
      id: null,
      expression: !body.is(AST_TYPE.BlockStatement),
      generator: false,
      async: false,
      params,
      body,
      restTokens,
    })
  }

  [METHOD_TYPE.getBlockStatementAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.LeftBrace)];
    const body = this.getBlockStatementBodyContent(TOKEN_TYPE.RightBrace)
    restTokens.push(this.expectToken(TOKEN_TYPE.RightBrace))
    return this.createAstItem({
      type: AST_TYPE.BlockStatement,
      body,
      restTokens,
    })
  }

  [METHOD_TYPE.getNewExpression]() {
    let restTokens = [];
    while(this.nextTokenIs(TOKEN_TYPE.new)) {
      restTokens.push(this.eatToken());
      let callee = this[METHOD_TYPE.getNewExpression]();
      let s = this.nextTokenIs();
      while(s.is(TOKEN_TYPE.Point) || s.is(TOKEN_TYPE.Optional) || s.is(TOKEN_TYPE.LeftBracket)) {
        s = this.eatToken();
        restTokens.push(s)
        let optional = [TOKEN_TYPE.Optional].includes(s.type);
        if (optional && this.nextTokenIs(TOKEN_TYPE.LeftParenthesis)) {
          throwError('无法在new 表达式使用', this.nextTokenIs())
        }
        const computed = s.is(TOKEN_TYPE.LeftBracket) 
          || (s.is(TOKEN_TYPE.Optional) && this.nextTokenIs(TOKEN_TYPE.LeftBracket));
  
        if (optional && computed) {
          restTokens.push(this.expectToken(TOKEN_TYPE.LeftBracket))
        }
        if (computed) {
          callee = this.createAstItem({
            type: AST_TYPE.MemberExpression,
            object: callee,
            property:  this[METHOD_TYPE.getExpAst](),
            computed,
            optional,
            restTokens
          })
        } else {
          this.proxyMethod(prefixDicts.set, AstFlagDicts.cannotUsePureArrowExpression, true)
          callee = this.createAstItem({
            type: AST_TYPE.MemberExpression,
            object: callee,
            property: this[METHOD_TYPE.getPrimaryAst](),
            computed,
            optional,
            restTokens,
          })
          this.proxyMethod(prefixDicts.reset, AstFlagDicts.cannotUsePureArrowExpression)
        }
        if (computed) {
          restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket))
        }
        s = this.nextTokenIs()
      }
      // const arguments = [];
      let args = []
      if (this.nextTokenIs(TOKEN_TYPE.LeftParenthesis)) {
        this.proxyMethod(prefixDicts.set, AstFlagDicts.canSpreadable, true)
        const methodName = METHOD_TYPE.getSpreadElement;
        restTokens.push(this.expectToken(TOKEN_TYPE.LeftParenthesis));
        if (!this.nextTokenIs(TOKEN_TYPE.RightParenthesis)) {
          args.push(this[methodName]())
        }
        while (this.nextTokenIs(TOKEN_TYPE.Comma)) {
          restTokens.push(this.eatToken())
          if (!this.nextTokenIs(TOKEN_TYPE.RightParenthesis)) {
            args.push(this[methodName]())
          }
        }
        restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis))
        this.proxyMethod(prefixDicts.reset, AstFlagDicts.canSpreadable)
      }
      return log(this.createAstItem({
        type: AST_TYPE.NewExpression,
        callee,
        arguments: args,
        restTokens,
      }))
    }
    return this[METHOD_TYPE.getPrimaryAst]()
  }

  [METHOD_TYPE.getMemberOrCallExpression]() {
    const methodName = METHOD_TYPE.getNewExpression
    let left = this[methodName]();
    // console.log('ret2', left);
    let right = null;
    while (this.nextTokenIs([
      TOKEN_TYPE.Point,
      TOKEN_TYPE.Optional,
      TOKEN_TYPE.LeftBracket,
      TOKEN_TYPE.LeftParenthesis,
    ])) {
      // console.warn('enter', left)
      avoidPureArrowFuncitonExpressionNextTokenIsOperator(left);
      let s = this.eatToken();
      if (s.is(TOKEN_TYPE.LeftParenthesis) || (s.is(TOKEN_TYPE.Optional) && this.nextTokenIs(TOKEN_TYPE.LeftParenthesis))) {
        this.proxyMethod(prefixDicts.set, AstFlagDicts.canSpreadable, true)
        const methodName = METHOD_TYPE.getSpreadElement;
        const restTokens = [s]
        const optional = s.is(TOKEN_TYPE.Optional);
        if (optional) {
          restTokens.push(this.expectToken(TOKEN_TYPE.LeftParenthesis));
        }
        const args = [];
        if (!this.nextTokenIs(TOKEN_TYPE.RightParenthesis)) {
          args.push(this[methodName]())
        }
        while (this.nextTokenIs(TOKEN_TYPE.Comma)) {
          restTokens.push(this.eatToken())
          if (!this.nextTokenIs(TOKEN_TYPE.RightParenthesis)) {
            args.push(this[methodName]())
          }
        }
        restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis))
        this.proxyMethod(prefixDicts.reset, AstFlagDicts.canSpreadable)
        left = this.createAstItem({
          type: AST_TYPE.CallExpression,
          optional,
          callee: left,
          arguments: args,
          restTokens,
        })
      } else {
        const restTokens = [s]
        const computed = s.is(TOKEN_TYPE.LeftBracket) || (s.is(TOKEN_TYPE.Optional) && this.nextTokenIs(TOKEN_TYPE.LeftBracket));
        let optional = [TOKEN_TYPE.Optional].includes(restTokens[0].type);
        if (optional && computed) {
          restTokens.push(this.expectToken(TOKEN_TYPE.LeftBracket))
        }
        if (computed) {
          right = this[METHOD_TYPE.getExpAst]()
        } else {
          this.proxyMethod(prefixDicts.set, AstFlagDicts.cannotUsePureArrowExpression, true)
          right = this[METHOD_TYPE.getPrimaryAst]()
          this.proxyMethod(prefixDicts.reset, AstFlagDicts.cannotUsePureArrowExpression)
        }
        if (!right) {
          throw new Error(AST_TYPE.MemberExpression + '属性错误')
        }
        if (computed) {
          restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket))
        }

        left = this.createAstItem({
          type: AST_TYPE.MemberExpression,
          object: left,
          property: right,
          computed,
          optional,
          restTokens,
        })
      }
    }
    // console.log('ret1', left)
    return left;
  }

  [METHOD_TYPE.getSuffixUpdateExpression]() {
    let argument = this[METHOD_TYPE.getMemberOrCallExpression]();
    while (this.nextTokenIs([TOKEN_TYPE.SelfAdd, TOKEN_TYPE.SelfSub])) {
      avoidPureArrowFuncitonExpressionNextTokenIsOperator(argument);
      onlyAllowMemberExpressionOrIdentifier(argument, '++, -- 前面只能是')
      const restTokens = [this.eatToken()]
      argument = this.createAstItem({
        type: AST_TYPE.UpdateExpression,
        operator: restTokens[0].value,
        prefix: false,
        argument,
        restTokens,
      })
    }
    return argument;
  }

  [METHOD_TYPE.getUnaryOrUpdateOrAwaitExpression] = this.getSingleOperatorFunc(
    METHOD_TYPE.getSuffixUpdateExpression,
    [
      TOKEN_TYPE.Non,
      TOKEN_TYPE.Exclamation,
      TOKEN_TYPE.Plus,
      TOKEN_TYPE.Subtract,
      TOKEN_TYPE.typeof,
      TOKEN_TYPE.void,
      TOKEN_TYPE.delete,
      TOKEN_TYPE.await,
      TOKEN_TYPE.SelfAdd,
      TOKEN_TYPE.SelfSub,
    ],
    {
      injectConfig(token) {
        const restTokens = [token];
        if ([
          TOKEN_TYPE.Non,
          TOKEN_TYPE.Exclamation,
          TOKEN_TYPE.Plus,
          TOKEN_TYPE.Subtract,
          TOKEN_TYPE.typeof,
          TOKEN_TYPE.void,
          TOKEN_TYPE.delete,
          TOKEN_TYPE.SelfAdd,
          TOKEN_TYPE.SelfSub
        ].some(x => token.is(x))) {
          return {
            type: token.is(TOKEN_TYPE.SelfAdd) || token.is(TOKEN_TYPE.SelfSub) ? AST_TYPE.UpdateExpression : AST_TYPE.UnaryExpression,
            prefix: true,
            operator: token.value,
            restTokens,
          }
        }
        if (token.is(TOKEN_TYPE.await)) {
          if (!this.proxyMethod(prefixDicts.is, AstFlagDicts.canAwaitable)) {
            throwError('当前不在async函数结构体不允许使用', token)
          }
          return {
            type: AST_TYPE.AwaitExpression,
            restTokens,
          }
        }

        throw new Error('未处理')
      },
      checkArgument(argument, obj) {
        if (obj.is(AST_TYPE.UpdateExpression)) {
          onlyAllowMemberExpressionOrIdentifier(argument, '当前是' + argument.type + ',但++/--符号后面只能是：')
        }
        return argument;
      }
    }
  );

  [METHOD_TYPE.getAssignmentExpression] = this.getPriorityAstFunc(METHOD_TYPE.getConditionalExpression, [
    TOKEN_TYPE.Equal,
    TOKEN_TYPE.PlusEqual,
    TOKEN_TYPE.SubEqual,
    TOKEN_TYPE.StarEqual,
    TOKEN_TYPE.DivEqual,
    TOKEN_TYPE.ModEqual,
    TOKEN_TYPE.ShiftLeftEqual,
    TOKEN_TYPE.ShiftRightEqual,
    TOKEN_TYPE.UnsignedShiftRightEqual,
    TOKEN_TYPE.SingleAndEqual,
    TOKEN_TYPE.XorEqual,
    TOKEN_TYPE.SingleOrEqual,
  ], AST_TYPE.AssignmentExpression, {
    checkLeft(ast) {
      onlyAllowMemberExpressionOrIdentifier(ast, '赋值表达式左边只能是:')
    }
  });

  _innerGetFunctionAst = (type) => {
    return () => {
      const token = this.eatToken();
      const restTokens = [token]
      const isAysnc = token.is(TOKEN_TYPE.async);
      let onlyCanBeArrowFunction = isAysnc;
      if (isAysnc) {
        if (type === AST_TYPE.getFunctionDeclarationAst || this.nextTokenIs(TOKEN_TYPE.function)) {
          onlyCanBeArrowFunction = false;
          restTokens.push(this.expectToken(TOKEN_TYPE.function))
        }
      }
      const generator = this.nextTokenIs(TOKEN_TYPE.Star);
      if (generator) {
        if (onlyCanBeArrowFunction) {
          throwError('箭头函数不能出现', this.nextTokenIs())
        }
        restTokens.push(this.eatToken())
      }
      let id = null;
      if (type === AST_TYPE.getFunctionDeclarationAst || (this.nextTokenIs(TOKEN_TYPE.Word))) {
        if (onlyCanBeArrowFunction) {
          throwError('箭头函数不能出现函数名字', this.nextTokenIs())
        }
        id = this[METHOD_TYPE.getIdentifierAst]();
      }

      const { restTokens: tempRestTokens,
        params, } = this[METHOD_TYPE.getFunctionParams]();
      restTokens.push(...tempRestTokens);

      if (onlyCanBeArrowFunction) {
        restTokens.push(this.expectToken(TOKEN_TYPE.Arrow))
      }
      if (generator) {
        this.proxyMethod(prefixDicts.set, AstFlagDicts.canYieldable, generator)
      }
      const body = this[!onlyCanBeArrowFunction || this.nextTokenIs(TOKEN_TYPE.LeftBrace) ? METHOD_TYPE.getBlockStatementAst : METHOD_TYPE.getSpreadElement]();
      if (generator) {
        this.proxyMethod(prefixDicts.reset, AstFlagDicts.canYieldable)
      }

      const ret = this.createAstItem({
        type: onlyCanBeArrowFunction ? AST_TYPE.ArrowFunctionExpression : type,
        id,
        expression: !body.is(AST_TYPE.BlockStatement),
        generator,
        async: isAysnc,
        params,
        body,
        restTokens
      })
      // console.log('ret0', ret)
      return ret;
    }
  }

  [METHOD_TYPE.getFunctionDeclarationAst] = this._innerGetFunctionAst(AST_TYPE.FunctionDeclaration);

  [METHOD_TYPE.getFunctionExpressionOrWithArrowAst] = this._innerGetFunctionAst(AST_TYPE.FunctionExpression);

  [METHOD_TYPE.getStatementOrExpressionAst]() {
    const token = this.nextTokenIs();
    switch (token.type) {
      case TOKEN_TYPE.Semicolon:
        return this.createAstItem({
          type: AST_TYPE.EmptyStatement,
          restTokens: [this.eatToken()],
        })
      case TOKEN_TYPE.sleep:
        return this[METHOD_TYPE.getSleepStatement]();
      case TOKEN_TYPE.return:
        return this[METHOD_TYPE.getReturnStatementAst]();
      case TOKEN_TYPE.let:
      case TOKEN_TYPE.var:
      case TOKEN_TYPE.const:
        return this[METHOD_TYPE.getVariableDeclarationStatementAst]();
      case TOKEN_TYPE.if:
        return this[METHOD_TYPE.getIfStatementAst]();
      case TOKEN_TYPE.while:
        return this[METHOD_TYPE.getWhileStatementAst]();
      case TOKEN_TYPE.LeftBrace:
        return this[METHOD_TYPE.getBlockStatementAst]();
      case TOKEN_TYPE.async:
      case TOKEN_TYPE.function:
        return this[METHOD_TYPE.getFunctionDeclarationAst]();
      default:
        return this[METHOD_TYPE.getExpressionStatementAst]();
    }
  }

  getAst() {
    const body = [];
    let eofToken
    try {
      body.push(...this.getBlockStatementBodyContent(TOKEN_TYPE.EOF));
      if (!(eofToken = this.expectToken(TOKEN_TYPE.EOF))) {
        throw new Error(body, '解析出错');
      }
    } catch (e) {
      if (isInstanceOf(e.token, Token)) {
        e.errorInfo = {
          ...this.astContext,
          errorToken: e.token,
          restSourceCode: this.sourceCode,
        }
        throw e;
      } else {
        throw e;
      }
    } finally {
      console.log(this.astContext)
    }
    return this.createAstItem({
      type: AST_TYPE.Program,
      body,
      sourceType: 'module',
      restTokens: eofToken.prefixTokens
    })
  }

  constructor() {
    super();
    const methodNameList = [METHOD_TYPE.getUnaryOrUpdateOrAwaitExpression];
    for (const [methodName, getFn, operator, expression] of definePriorityConfig) {
      this[methodName] = this[getFn](methodNameList[methodNameList.length - 1], operator, expression);
      methodNameList.push(methodName)
    }
    const methodList = [...Reflect.ownKeys(this.__proto__), ...Reflect.ownKeys(this)];
    _.forEach(MethodConfig, (v, k) => {
      if (methodList.includes(k)) {
        console.log('跳过', k)
      } else {
        this[k] = this.getConfigableFunc(v)
      }
    })
  }
}
