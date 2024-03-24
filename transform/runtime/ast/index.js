import _ from "lodash";
import { avoidPureArrowFuncitonExpressionNextTokenIsOperator, checkShouldWrapLine, checkThrowIfSameName, ensureAllTypeInList, getValueOfLiteralToken, isSetOrGetTokenLike, isUnhandleError, onlyAllowMemberExpressionOrIdentifier, rawToCooked, throwError, tokenHadWrapLine, valueToRaw } from "./utils";
import { isInstanceOf, log } from "../../commonApi";
import { AST_TYPE, AstFlagDicts, IdentifierAstTokenTypeList, LiteralAstTokenTypeList, METHOD_TYPE, TOKEN_TYPE, TOKEN_TYPE_VALUE_LIST, commonLiteral, definePriorityConfig, prefixDicts } from "./constants";
import { Token } from "./Token";
import { SourceCodeHandleApi } from "./SourceCodeHandleApi";
import { MethodConfig } from "./MethodConfig";
import ASTItem from "./ASTITem";

export default class AST extends SourceCodeHandleApi {
  _innerGetFunctionAst = (type) => {
    return () => {
      const token = this.eatToken();
      const restTokens = [token]
      const isAysnc = token.is(TOKEN_TYPE.async);
      let onlyCanBeArrowFunction = isAysnc;
      const isMayBeDeclarationOrArrowExpression = type === AST_TYPE.FunctionDeclaration;
      if (isAysnc) {
        if (this.nextTokenIs(TOKEN_TYPE.function)) {
          onlyCanBeArrowFunction = false;
          restTokens.push(this.expectToken(TOKEN_TYPE.function))
        }
      }

      if (onlyCanBeArrowFunction && this.proxyMethod(prefixDicts.is, AstFlagDicts.cannotUsePureArrowExpression)) {
        throwError('如果是箭头函数可能需要加个括号', this.nextTokenIs())
      }
      const generator = this.nextTokenIs(TOKEN_TYPE.Star);
      if (generator) {
        if (onlyCanBeArrowFunction) {
          throwError('箭头函数不能出现', this.nextTokenIs())
        }
        restTokens.push(this.eatToken())
      }
      // console.log('onlyCanBeArrowFunction', onlyCanBeArrowFunction, isMayBeDeclarationOrArrowExpression, type)
      let id = null;
      if (isMayBeDeclarationOrArrowExpression || (this.nextTokenIs(TOKEN_TYPE.Word))) {
        if (onlyCanBeArrowFunction) {
          let params = null;
          if (this.nextTokenIs(TOKEN_TYPE.LeftParenthesis)) {
            const { params: tParams, tempRestTokens } = this[METHOD_TYPE.getFunctionParams]();
            restTokens.push(...tempRestTokens);
            params = tParams;
          } else {
            params = [this[METHOD_TYPE.getIdentifierAst]()];
          }
          const { expression, tempRestTokens, body } = this.getArrowFunctionBody();
          restTokens.push(...tempRestTokens);
          let t = this.createAstItem({
            type: AST_TYPE.ArrowFunctionExpression,
            id: null,
            expression,
            generator: false,
            async: isAysnc,
            params,
            body,
            restTokens,
          })
          return isMayBeDeclarationOrArrowExpression ? this.createAstItem({
            type: AST_TYPE.ExpressionStatement,
            expression: t,
            restTokens: []
          }) : t;
        }
        id = this[METHOD_TYPE.getIdentifierAst]();
      }

      const { tempRestTokens,
        params, } = this[METHOD_TYPE.getFunctionParams]();
      restTokens.push(...tempRestTokens);

      if (onlyCanBeArrowFunction) {
        restTokens.push(this.expectToken(TOKEN_TYPE.Arrow))
      }
      if (generator) {
        this.proxyMethod(prefixDicts.set, AstFlagDicts.canYieldable, generator)
      }
      let body
      if (!onlyCanBeArrowFunction || this.nextTokenIs(TOKEN_TYPE.LeftBrace)) {
        if (isAysnc) {
          this.proxyMethod(prefixDicts.set, AstFlagDicts.canAwaitable, true)
        }
        body = this.getFunctionBodyAst()
        if (isAysnc) {
          this.proxyMethod(prefixDicts.reset, AstFlagDicts.canAwaitable);
        }
      } else {
        body = this[METHOD_TYPE.getSpreadElement]();
      }

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
      return isMayBeDeclarationOrArrowExpression && onlyCanBeArrowFunction ? this.createAstItem({
        type: AST_TYPE.ExpressionStatement,
        expression: ret,
        restTokens: []
      }) : ret;
    }
  }

  _innerGetBreakOrContinue = (tokenType, canFlag, astType) => () => {
    const restTokens = [this.expectToken(tokenType)];
    if (!this.proxyMethod(prefixDicts.is, canFlag)) {
      throwError('不能在非循环代码块内', _.last(restTokens))
    }
    const token = this.nextTokenIs();

    if (token.is(TOKEN_TYPE.Semicolon) || tokenHadWrapLine(token)) {
      if (token.is(TOKEN_TYPE.Semicolon)) {
        restTokens.push(this.eatToken());
      }
      return this.createAstItem({
        type: astType,
        label: null,
        restTokens,
      })
    }

    const list = this.proxyMethod(prefixDicts.get, AstFlagDicts.pushLabelAddToContext);
    let label = null;
    if (_.size(list) && this.nextTokenIs(IdentifierAstTokenTypeList)) {
      label = this[METHOD_TYPE.getIdentifierAst]();
      if (!_.includes(list, label.name)) {
        throwError('未找到label', _.last(label.tokens))
      }
    }
    if (this.nextTokenIs(TOKEN_TYPE.Semicolon)) {
      restTokens.push(this.eatToken())
    }
    return this.createAstItem({
      type: astType,
      label,
      restTokens,
    })

  }

  _innerGetPropertyOrMethod = (tokenType) => (config) => {
    ensureAllTypeInList(tokenType, TOKEN_TYPE_VALUE_LIST);
    const token = this.wrapInDecorator(AstFlagDicts.canUseKeyWordAsKey, () => this.nextTokenIs());

    const restTokens = []
    if (!token.isOneOf([
      TOKEN_TYPE.LeftBracket,
      ...IdentifierAstTokenTypeList,
      ...LiteralAstTokenTypeList
    ])) {
      throwError('未处理的对象属性', token)
    }
    const computed = token.is(TOKEN_TYPE.LeftBracket);
    if (computed) {
      restTokens.push(this.eatToken())
    }
    let key
    if (computed) {
      key = this[METHOD_TYPE.getExpAst]();
      restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket))
    } else if (this.wrapInDecorator(AstFlagDicts.canUseKeyWordAsKey, () => this.nextTokenIs(IdentifierAstTokenTypeList))) {
      key = this.wrapInDecorator(AstFlagDicts.canUseKeyWordAsKey, () => this[METHOD_TYPE.getIdentifierAst]())
    } else {
      key = this[METHOD_TYPE.getLiteralAst]()
    }
    if ((computed && !this.nextTokenIs(TOKEN_TYPE.LeftParenthesis))
      || this.nextTokenIs(tokenType)) {

      let value = null;
      if (tokenType === TOKEN_TYPE.Colon || this.nextTokenIs(TOKEN_TYPE.Equal)) {
        restTokens.push(this.expectToken(tokenType));
        value = this[METHOD_TYPE.getYieldExpression]();
      }
      return {
        method: false,
        key,
        value,
        computed,
        tempRestTokens: restTokens,
        shorthand: false,
      }
    }
    if (computed || this.nextTokenIs(TOKEN_TYPE.LeftParenthesis)) {
      const value = this.wrapInDecorator([
        config.async && AstFlagDicts.canAwaitable,
        config.generator && AstFlagDicts.canYieldable
      ].filter(x => !!x), () => this[METHOD_TYPE.getObjectPropertyMethod]())
      return {
        method: true,
        key,
        value,
        computed,
        tempRestTokens: restTokens,
        shorthand: false,
      }
    }
    return {
      method: false,
      key,
      value: tokenType === TOKEN_TYPE.Colon ? this.copyAstItem(key) : null,
      computed: false,
      tempRestTokens: restTokens,
      shorthand: true,
    }
  }

  _innerGetReturnOrYield = (tokenType, flagType, astType, argumentType) => () => {
    const restTokens = [this.expectToken(tokenType)];
    const isYieldExp = TOKEN_TYPE.yield === tokenType;
    if (!this.proxyMethod(prefixDicts.is, flagType)) {
      throwError('不能在非' + (isYieldExp ? 'generator' : '') + '函数内', _.last(restTokens))
    }
    const token = this.nextTokenIs();
    let isEnd = false;
    let argument = null;
    if (token.is(TOKEN_TYPE.Semicolon)) {
      isEnd = true;
      restTokens.push(this.eatToken());
    }
    if (tokenHadWrapLine(token)) {
      isEnd = true;
    }

    let delegate = false;
    if (!isEnd) {
      this.save()
      let t = this.nextTokenIs()
      try {
        if (isYieldExp) {
          if (this.nextTokenIs(TOKEN_TYPE.Star)) {
            delegate = true;
            restTokens.push(this.eatToken())
          }
        }
        argument = this[argumentType]()
        if (this.nextTokenIs(TOKEN_TYPE.Semicolon)) {
          restTokens.push(this.eatToken())
        }
        this.consume()
      } catch (e) {
        if (!_.isEqual(t, e.token)) {
          throw e;
        }
        this.restore()
      }
    }
    const obj = {
      type: astType,
      argument,
      restTokens,
    };
    if (isYieldExp) {
      obj.delegate = delegate
    }
    return this.createAstItem(obj)
  }

  _innerGetArrayOrObjectPattern = ([leftTokenType, rightTokenType], methodType, astType, attrType ,flagType) => {
    const commonFlag = [AstFlagDicts.canRestable,
      AstFlagDicts.canUseAssignmentPattern,
    ]
    if (flagType) {
      commonFlag.push(flagType)
    }
     return this.decorator(commonFlag, () => {
      const restTokens = [this.expectToken(leftTokenType)];
      const properties = []
      while (!this.nextTokenIs(rightTokenType)) {
        // console.log(properties);
        const ast = this[methodType]();
        properties.push(ast);
        if (ast.is(AST_TYPE.RestElement)) {
          break;
        }
        if (!this.nextTokenIs(rightTokenType)) {
          restTokens.push(this.expectToken(TOKEN_TYPE.Comma))
        }
      }
      restTokens.push(this.expectToken(rightTokenType));
      return this.createAstItem({
        type: astType,
        [attrType]: properties,
        restTokens,
      })
     })

  }

  getBlockStatementBodyContent(type) {
    const body = []
    let flag = true;
    while (this.sourceCode.length && !this.nextTokenIs(type)) {
      const current = this.nextTokenIs();
      if (body.length) {
        checkShouldWrapLine(body, current)
      }
      const ast = this[METHOD_TYPE.getStatementOrExpressionAst]()
      if (ast) {
        if (flag && ast.is(AST_TYPE.ExpressionStatement) && ast.expression.is(AST_TYPE.Literal)) {
          ast.set('directive', _.slice(ast.expression.raw, 1, -1).join(''))
        } else {
          flag =false
        }
        body.push(ast)
      }
    }
    return body;
  }

  getFunctionBodyAst() {
    return this.wrapInDecorator(AstFlagDicts.canReturnable, () => this[METHOD_TYPE.getBlockStatementAst]());
  }

  getArrowFunctionBody() {
    const tempRestTokens = [this.expectToken(TOKEN_TYPE.Arrow)];
    const expression = !this.nextTokenIs(TOKEN_TYPE.LeftBrace);
    let body = null;
    if (expression) {
      body = this[METHOD_TYPE.getSpreadElement]()
    } else {
      body = this.getFunctionBodyAst()
    }
    return {
      expression,
      tempRestTokens,
      body,
    }
  }

  [METHOD_TYPE.getTemplateLiteralAst]() {
    let token = this.expectToken([
      TOKEN_TYPE.WholeTemplateLiteral,
      TOKEN_TYPE.TemplateLiteralStart,
    ])
    const tokenToTemplateElement = (token) => {
      const raw = _.slice(token.value, 1,
        token.is(TOKEN_TYPE.TemplateLiteralStart)
          || token.is(TOKEN_TYPE.TemplateLiteralMiddle)
          ? -2 :
          -1).join('');
      return this.createAstItem({
        type: AST_TYPE.TemplateElement,
        tail: token.is(TOKEN_TYPE.WholeTemplateLiteral)
          || token.is(TOKEN_TYPE.TemplateLiteralEnd),
        value: {
          raw,
          cooked: rawToCooked(raw),
        },
        restTokens: [token],
      });
    }

    const quasis = [tokenToTemplateElement(token)];
    const expressions = [];
    const getMayBeMiddleToken = (type) => (...args) => {
      return this.wrapInDecorator(AstFlagDicts.canUseTemplateLiteralMiddleString, () => this[type](...args))
    }
    const nextIsMayBeMiddleToken = getMayBeMiddleToken('nextTokenIs');
    const eatMayBeMiddleToken = getMayBeMiddleToken('eatToken');

    if (!token.is(TOKEN_TYPE.WholeTemplateLiteral)) {
      if (nextIsMayBeMiddleToken([
        TOKEN_TYPE.TemplateLiteralMiddle,
        TOKEN_TYPE.TemplateLiteralEnd])) {
        throwError('前面可能缺少表达式', nextIsMayBeMiddleToken())
      }
      expressions.push(this[METHOD_TYPE.getExpAst]());
      token = nextIsMayBeMiddleToken()
      while (token.is(TOKEN_TYPE.TemplateLiteralMiddle)) {
        quasis.push(tokenToTemplateElement(eatMayBeMiddleToken()))
        expressions.push(this[METHOD_TYPE.getExpAst]());
        token = nextIsMayBeMiddleToken()
      }
      token = eatMayBeMiddleToken()
      if (!token.is(TOKEN_TYPE.TemplateLiteralEnd)) {
        throwError('预期是', token)
      }
      quasis.push(tokenToTemplateElement(token))
    }
    return this.createAstItem({
      type: AST_TYPE.TemplateLiteral,
      expressions,
      quasis,
      restTokens: []
    })
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
    const token = this.expectToken(IdentifierAstTokenTypeList)
    const isPrivate = _.startsWith(token.value, '#');
    return this.createAstItem({
      type: isPrivate ? AST_TYPE.PrivateIdentifier : AST_TYPE.Identifier,
      name: _.slice(token.value, Number(isPrivate)).join(''),
      restTokens: [token],
    })
  }

  [METHOD_TYPE.getBreakStatementAst] = this._innerGetBreakOrContinue(TOKEN_TYPE.break,
    AstFlagDicts.canBreakable, AST_TYPE.BreakStatement);

  [METHOD_TYPE.getContinueStatementAst] = this._innerGetBreakOrContinue(TOKEN_TYPE.continue,
    AstFlagDicts.canContinueable, AST_TYPE.ContinueStatement);

  [METHOD_TYPE.getIdentifierOrArrowFunctionAst]() {
    const key = this[METHOD_TYPE.getIdentifierAst]()
    const restTokens = []
    if (this.nextTokenIs(TOKEN_TYPE.Arrow)) {
      if (this.proxyMethod(prefixDicts.is, AstFlagDicts.cannotUsePureArrowExpression)) {
        throwError('箭头函数可能需要加一个括号包着', this.nextTokenIs())
      }
      const { expression, tempRestTokens, body } = this.getArrowFunctionBody();
      restTokens.push(...tempRestTokens);
      return this.createAstItem({
        type: AST_TYPE.ArrowFunctionExpression,
        id: null,
        async: false,
        expression,
        generator: false,
        params: [key],
        body,
        restTokens,
      })
    }
    return key;
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
        tempRestTokens: restTokens,
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
      tempRestTokens: restTokens,
      params,
    }
  });

  [METHOD_TYPE.getObjectPropertyMethod]() {
    if (!this.nextTokenIs(TOKEN_TYPE.LeftParenthesis)) {
      throwError('预期是左括号', this.nextTokenIs())
    }
    const { params, tempRestTokens } = this[METHOD_TYPE.getFunctionParams]();
    return {
      params,
      restTokens: tempRestTokens,
      body: this.getFunctionBodyAst(),
    }
  }

  [METHOD_TYPE.getObjectExpressionPropertyAst]() {
    const restTokens = [];
    let isAsync = this.nextTokenIs(TOKEN_TYPE.async);
    let generator = false;
    let kind = commonLiteral.init;
    let hadReback = false;
    this.save();
    if (isAsync || this.nextTokenIs(TOKEN_TYPE.Star)) {
      if (isAsync) {
        restTokens.push(this.eatToken())
        if (
          this.nextTokenIs([TOKEN_TYPE.Colon, TOKEN_TYPE.LeftParenthesis, TOKEN_TYPE.Comma])
        ) {
          hadReback = true;
          this.restore()
          isAsync = false;
        } else {
          let t = this.wrapInDecorator(AstFlagDicts.canUseKeyWordAsKey, () => this.nextTokenIs());
          if (t.is(TOKEN_TYPE.Word) && tokenHadWrapLine(t)) {
            throwError('async 函数后面不能换行', t);
          }
        }
      }
      if (this.nextTokenIs(TOKEN_TYPE.Star)) {
        restTokens.push(this.eatToken());
        generator = true;
      }
    } else if (isSetOrGetTokenLike(this.nextTokenIs())) {
      const token = this.eatToken();
      restTokens.push(token);
      if (this.nextTokenIs([TOKEN_TYPE.Colon, TOKEN_TYPE.LeftParenthesis, TOKEN_TYPE.Comma])) {
        hadReback = true;
        this.restore()
      } else {
        kind = token.value
      }
    }
    if (!hadReback) {
      this.consume()
    }
    const { key, value, computed, tempRestTokens, method, shorthand } = this[METHOD_TYPE.getObjectProperties]({
      async: isAsync,
      generator,
    });
    restTokens.push(...tempRestTokens)
    if (method) {
      restTokens.push(...value.restTokens);
      if (kind === commonLiteral.set) {
        if (_.size(value.params) !== 1) {
          throwError('setter的参数有且仅有1个', _.head(value.restTokens))
        }
      }
      if (kind === commonLiteral.get) {
        if (_.size(value.params) !== 0) {
          throwError('getter不能有参数', _.head(value.restTokens))
        }
      }
      return this.createAstItem({
        type: AST_TYPE.Property,
        method: kind === commonLiteral.init,
        shorthand,
        computed,
        key,
        kind,
        value: this.createAstItem({
          type: AST_TYPE.FunctionExpression,
          id: null,
          expression: false,
          generator,
          async: isAsync,
          params: value.params,
          body: value.body,
          restTokens: value.restTokens,
        }),
        restTokens,
      })
    }
    if (isAsync || generator) {
      throwError('后面应该是' + (isAsync ? 'async' : 'generator') + '函数', _.last(key?.tokens))
    }
    if ([commonLiteral.set, commonLiteral.get].includes(kind)) {
      throwError(kind + 'ter必须是函数', _.last(key?.tokens))
    }
    return this.createAstItem({
      type: AST_TYPE.Property,
      method: false,
      shorthand,
      computed,
      key,
      value,
      kind,
      restTokens,
    })
  }

  [METHOD_TYPE.getMethodDefinitionOrPropertyDefinition]() {
    const restTokens = [];
    let isAsync = this.nextTokenIs(TOKEN_TYPE.async);
    let generator = false;
    let kind = commonLiteral.method;
    let hadReback = false;
    this.save();
    const shouldReback = (tokens = [], isSetOrGetter) => {
      const mayBeWordToken = this.wrapInDecorator(AstFlagDicts.canUseKeyWordAsKey, () => this.nextTokenIs());
      let t
      return !(_.some([...tokens], x => mayBeWordToken.is(x))

        || (
          mayBeWordToken.is(TOKEN_TYPE.LeftBracket)
          && !(!isSetOrGetter && tokenHadWrapLine(mayBeWordToken)
            && (t = this.getTokenByCallback(() => {
              this.eatToken();
              this[METHOD_TYPE.getExpAst]();
              this.eatToken();
              return this.nextTokenIs()
            }), t?.is(TOKEN_TYPE.Semicolon) || t?.is(TOKEN_TYPE.Equal)))
        )
        || (
          mayBeWordToken.is(TOKEN_TYPE.Word)
          && !(!isSetOrGetter && tokenHadWrapLine(mayBeWordToken)
            && (t = this.getTokenByCallback(2), t?.is(TOKEN_TYPE.Semicolon) || t?.is(TOKEN_TYPE.Equal))
          ))
      )
    }
    if (isAsync || this.nextTokenIs(TOKEN_TYPE.Star)) {
      if (isAsync) {
        restTokens.push(this.eatToken())
        if (shouldReback([TOKEN_TYPE.Star], false)) {
          hadReback = true;
          this.restore()
          isAsync = false;
        }
      }
      if (this.nextTokenIs(TOKEN_TYPE.Star)) {
        restTokens.push(this.eatToken());
        generator = true;
      }
    } else if (isSetOrGetTokenLike(this.nextTokenIs())) {
      const token = this.eatToken();
      restTokens.push(token);
      if (shouldReback([], true)) {
        hadReback = true;
        this.restore()
      } else {
        kind = token.value
      }
    }
    if (!hadReback) {
      this.consume()
    }
    const { key, value, computed, tempRestTokens, method } = this[METHOD_TYPE.getClassPropertyOrMethod]({
      async: isAsync,
      generator,
    });
    restTokens.push(...tempRestTokens)
    if (method) {
      restTokens.push(...value.restTokens);
      if (kind === commonLiteral.set) {
        if (_.size(value.params) !== 1) {
          throwError('setter的参数有且仅有1个', _.head(value.restTokens))
        }
      }
      if (kind === commonLiteral.get) {
        if (_.size(value.params) !== 0) {
          throwError('getter不能有参数', _.head(value.restTokens))
        }
      }

      if (key.is(AST_TYPE.Identifier) && key.name === commonLiteral.constructor) {
        if (isAsync || generator) {
          throwError('不能是async/generator', _.last(key.tokens))
        }
        kind = commonLiteral.constructor
      }
      return {
        type: AST_TYPE.MethodDefinition,
        computed,
        key,
        kind,
        value: this.createAstItem({
          type: AST_TYPE.FunctionExpression,
          id: null,
          expression: false,
          generator,
          async: isAsync,
          params: value.params,
          body: value.body,
          restTokens: value.restTokens,
        }),
        restTokens,
      }
    }
    if (isAsync || generator) {
      throwError('后面应该是' + (isAsync ? 'async' : 'generator') + '函数', _.last(key?.tokens))
    }
    if ([commonLiteral.set, commonLiteral.get].includes(kind)) {
      throwError(kind + 'ter必须是函数', _.last(key?.tokens))
    }
    if (this.nextTokenIs(TOKEN_TYPE.Semicolon)) {
      restTokens.push(this.eatToken())
    }
    return {
      type: AST_TYPE.PropertyDefinition,
      computed,
      key,
      value,
      restTokens,
    }

  }

  [METHOD_TYPE.getMethodDefinitionOrPropertyDefinitionOrStaticBlockAst]() {
    const token = this.nextTokenIs();
    const restTokens = []
    let isStatic = false;
    if (token.is(TOKEN_TYPE.static)) {
      isStatic = true;
      restTokens.push(this.eatToken())
      if (this.nextTokenIs(TOKEN_TYPE.LeftBrace)) {
        restTokens.push(this.eatToken())
        const body = this.getBlockStatementBodyContent(TOKEN_TYPE.RightBrace);
        restTokens.push(this.expectToken(TOKEN_TYPE.RightBrace))
        return this.createAstItem({
          type: AST_TYPE.StaticBlock,
          body,
          restTokens,
        })
      }
    }
    const ret = this[METHOD_TYPE.getMethodDefinitionOrPropertyDefinition]();
    return this.createAstItem({
      ...ret,
      static: isStatic,
      restTokens: [...restTokens, ...ret.restTokens],
    })
  }

  [METHOD_TYPE.getClassBodyAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.LeftBrace)];
    const body = []
    const skipSemicolon = () => {
      while (this.nextTokenIs(TOKEN_TYPE.Semicolon)) {
        restTokens.push(this.eatToken())
      }
    }
    while (!this.nextTokenIs(TOKEN_TYPE.RightBrace)) {
      skipSemicolon()
      const nextToken = this.nextTokenIs()
      if (!nextToken.is(TOKEN_TYPE.RightBrace)) {
        if (body.length > 0) {
          checkShouldWrapLine(body, nextToken)
        }
        const ast = this[METHOD_TYPE.getMethodDefinitionOrPropertyDefinitionOrStaticBlockAst]();
        body.push(ast);
      }
      skipSemicolon()
    }
    restTokens.push(this.expectToken(TOKEN_TYPE.RightBrace));
    return this.createAstItem({
      type: AST_TYPE.ClassBody,
      body,
      restTokens,
    })
  }

  _innerGetClassAst = (astType, isExp = false) => () => {
    const restTokens = [this.expectToken(TOKEN_TYPE.class)];
    let id = null;
    if (!isExp || this.nextTokenIs(IdentifierAstTokenTypeList)) {
      id = this[METHOD_TYPE.getIdentifierAst]();
    }
    let superClass = null;
    if (this.nextTokenIs(TOKEN_TYPE.extends)) {
      restTokens.push(this.eatToken());
      superClass = this[METHOD_TYPE.getMemberOrCallExpression]();
    }
    const body = this[METHOD_TYPE.getClassBodyAst]();
    return this.createAstItem({
      type: astType,
      id,
      superClass,
      body,
      restTokens,
    })
  };

  [METHOD_TYPE.getClassExpressionAst] = this._innerGetClassAst(AST_TYPE.ClassExpression, true);

  [METHOD_TYPE.getClassDeclarationAst] = this._innerGetClassAst(AST_TYPE.ClassDeclaration, false);
  
  [METHOD_TYPE.getArrayPatternAst] = this._innerGetArrayOrObjectPattern(
    [TOKEN_TYPE.LeftBracket, TOKEN_TYPE.RightBracket],
    METHOD_TYPE.getPatternAst,
    AST_TYPE.ArrayPattern,
    'elements',
  );

  [METHOD_TYPE.getObjectProperties] = this._innerGetPropertyOrMethod(TOKEN_TYPE.Colon);

  [METHOD_TYPE.getClassPropertyOrMethod] = this._innerGetPropertyOrMethod(TOKEN_TYPE.Equal);

  [METHOD_TYPE.getParenthesisAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.LeftParenthesis)];
    const ast = this.wrapInDecorator(AstFlagDicts.cannotUsePureArrowExpression, () => this[METHOD_TYPE.getExpAst](), false);

    const ret = this.createAstItem({
      ...ast,
      restTokens: [...restTokens, ...ast.tokens, this.expectToken(TOKEN_TYPE.RightParenthesis)]
    })
    return ret;
  }

  [METHOD_TYPE.getParenthesiOrArrowFunctionExpressionAst]() {
    if (this.proxyMethod(prefixDicts.is, AstFlagDicts.cannotUseParenthesis)) {
      throwError('未识别的语法', this.nextTokenIs())
    }
    if (this.proxyMethod(prefixDicts.is, AstFlagDicts.cannotUsePureArrowExpression)) {
      const ret = this[METHOD_TYPE.getParenthesisAst]();
      if (this.nextTokenIs(TOKEN_TYPE.Arrow)) {
        throwError('可能需要对箭头函数加括号', this.nextTokenIs())
      }
      return ret;
    }
    this.save();
    let flag = false;
    const restTokens = [];
    try {
      const { params, tempRestTokens: tempRestTokens2 } = this[METHOD_TYPE.getFunctionParams]();
      restTokens.push(...tempRestTokens2);
      if (this.nextTokenIs(TOKEN_TYPE.Arrow)) {
        flag = true;
      } else {
        throw '非箭头函数'
      }
      const {
        expression,
        tempRestTokens,
        body,
      } = this.getArrowFunctionBody();
      restTokens.push(...tempRestTokens)
      this.consume()
      return this.createAstItem({
        type: AST_TYPE.ArrowFunctionExpression,
        id: null,
        expression,
        generator: false,
        async: false,
        params,
        body,
        restTokens,
      })
    } catch (e) {
      if (!flag) {
        this.restore()
      } else {
        throw e
      }
    }
  
    return this[METHOD_TYPE.getParenthesisAst]()
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
    while (this.nextTokenIs(TOKEN_TYPE.new)) {
      restTokens.push(this.eatToken());
      let callee = this.wrapInDecorator(AstFlagDicts.cannotUseParenthesis ,() =>this[METHOD_TYPE.getNewExpression]());
      let s = this.nextTokenIs();
      while (s.is(TOKEN_TYPE.Point) || s.is(TOKEN_TYPE.Optional) || s.is(TOKEN_TYPE.LeftBracket)) {
        s = this.eatToken();
        restTokens.push(s)
        let optional = [TOKEN_TYPE.Optional].includes(s.type);
        if (optional) {
          throwError('无法在new 表达式使用链式', this.nextTokenIs())
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
            property: this[METHOD_TYPE.getExpAst](),
            computed,
            optional,
            restTokens
          })
        } else {
          callee = this.wrapInDecorator([
            AstFlagDicts.cannotUsePureArrowExpression,
            AstFlagDicts.canUseKeyWordAsKey,
            AstFlagDicts.cannotUseParenthesis
          ], () => this.createAstItem({
            type: AST_TYPE.MemberExpression,
            object: callee,
            property: this[METHOD_TYPE.getPrimaryAst](),
            computed,
            optional,
            restTokens,
          }))
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
      return (this.createAstItem({
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
    let isOptional = false;
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
        this.proxyMethod(prefixDicts.set, AstFlagDicts.canSpreadable, true);
        this.proxyMethod(prefixDicts.set, AstFlagDicts.cannotUsePureArrowExpression, false)
        const methodName = METHOD_TYPE.getSpreadElement;
        const restTokens = [s]
        const optional = s.is(TOKEN_TYPE.Optional);
        if (optional) {
          isOptional = true
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
        this.proxyMethod(prefixDicts.reset, AstFlagDicts.cannotUsePureArrowExpression)
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
        if (optional) {
          isOptional = true
        }
        if (optional && computed) {
          restTokens.push(this.expectToken(TOKEN_TYPE.LeftBracket))
        }
        if (computed) {
          right = this[METHOD_TYPE.getExpAst]()
        } else {
          right = this.wrapInDecorator([
            AstFlagDicts.cannotUsePureArrowExpression,
            AstFlagDicts.canUseKeyWordAsKey,
            AstFlagDicts.cannotUseParenthesis
          ], () => this[METHOD_TYPE.getPrimaryAst]())
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
    return isOptional ? this.createAstItem({
      type: AST_TYPE.ChainExpression,
      expression: left,
      restTokens: []
    }) : left;
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

  [METHOD_TYPE.getFunctionDeclarationAst] = this._innerGetFunctionAst(AST_TYPE.FunctionDeclaration);

  [METHOD_TYPE.getFunctionExpressionOrWithArrowAst] = this._innerGetFunctionAst(AST_TYPE.FunctionExpression);


  [METHOD_TYPE.getExpressionStatementOrLabelStatementAst]() {
    const token = this.nextTokenIs();
    let t = null;
    if (!token.isOneOf(IdentifierAstTokenTypeList) || !(
      t = this.getTokenByCallback(2),
      t.is(TOKEN_TYPE.Colon)
    )) {
      return this[METHOD_TYPE.getExpressionStatementAst]()
    }
    const restTokens = []
    const label = this[METHOD_TYPE.getIdentifierAst]();
    restTokens.push(this.expectToken(TOKEN_TYPE.Colon))
    const body = this.wrapInDecorator(AstFlagDicts.pushLabelAddToContext, () => this[METHOD_TYPE.getWhileStatementAst](), label.name);
    return this.createAstItem({
      type: AST_TYPE.LabeledStatement,
      label,
      body,
      restTokens,
    })
  }

  [METHOD_TYPE.getObjectPatternAst] = this._innerGetArrayOrObjectPattern(
    [TOKEN_TYPE.LeftBrace, TOKEN_TYPE.RightBrace],
    METHOD_TYPE.getObjectPatternPropertyOrRestElementAst,
    AST_TYPE.ObjectPattern,
    'properties',
    AstFlagDicts.canUseKeyWordAsKey
  );

  [METHOD_TYPE.getForOfInStatementAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.for)];
    let onlyCanbeForOF = this.nextTokenIs(TOKEN_TYPE.await);
    if (onlyCanbeForOF) {
      let t = this.eatToken();
      restTokens.push(t)
      if (!this.proxyMethod(prefixDicts.is, AstFlagDicts.canAwaitable)) {
        throwError('无法出现在非async 模块内', t)
      }
    }

    const matchDeclarationOrExpression = () => {
      let left;
      let isDeclartionToken = null;
      if (this.nextTokenIs([TOKEN_TYPE.const, TOKEN_TYPE.let, TOKEN_TYPE.var])) {
        let token = this.eatToken();
        restTokens.push(token);
        isDeclartionToken = token;
      }
      left = this[METHOD_TYPE.getPatternAst]();
      if (isDeclartionToken) {
        left = this.createAstItem({
          type: AST_TYPE.VariableDeclaration,
          declarations: [
            this.createAstItem({
              type: AST_TYPE.VariableDeclarator,
              id: left,
              init: null,
              restTokens: [],
            })
          ],
          kind: isDeclartionToken.value,
          restTokens: [isDeclartionToken]
        })
      }
      return left;
    }

    const getBody = () => {
      let body = null;
      if (this.nextTokenIs(TOKEN_TYPE.LeftBrace)) {
        body = this.wrapInDecorator([
          AstFlagDicts.canBreakable,
          AstFlagDicts.canContinueable,
        ], () => this[METHOD_TYPE.getBlockStatementAst]())
      } else {
        body = this[METHOD_TYPE.getStatementOrExpressionAst]()
      }
      return body;
    }
    restTokens.push(this.expectToken(TOKEN_TYPE.LeftParenthesis))
    if (onlyCanbeForOF) {
      let left = matchDeclarationOrExpression();
      restTokens.push(this.expectToken(TOKEN_TYPE.of));
      const right = this[METHOD_TYPE.getYieldExpression]();
      restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis));
      return this.createAstItem({
        type: AST_TYPE.ForOfStatement,
        await: onlyCanbeForOF,
        left,
        right,
        body: getBody(),
        restTokens,
      })
    }
    this.save()
    const matchForFromSecondSemicolon = (init, shouldNotConsume) => {
      let test = null;
      if (!this.nextTokenIs(TOKEN_TYPE.Semicolon)) {
        test = this[METHOD_TYPE.getExpAst]();
      }
      restTokens.push(this.expectToken(TOKEN_TYPE.Semicolon))
      let update = null;
      if (!this.nextTokenIs(TOKEN_TYPE.RightParenthesis)) {
        update = this[METHOD_TYPE.getExpAst]();
      }
      restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis))
      if (!shouldNotConsume) {
        this.consume();
      }
      return this.createAstItem({
        type: AST_TYPE.ForStatement,
        init,
        test,
        update,
        body: getBody(),
        restTokens,
      })
    }
    if (this.nextTokenIs(TOKEN_TYPE.Semicolon)) {
      restTokens.push(this.eatToken());
      return matchForFromSecondSemicolon(null)
    }

    let left = matchDeclarationOrExpression();
    if (!this.nextTokenIs([TOKEN_TYPE.of,
    TOKEN_TYPE.in])) {
      this.restore();
      const isDeclaration = this.nextTokenIs([
        TOKEN_TYPE.const,
        TOKEN_TYPE.let,
        TOKEN_TYPE.var,
      ]);
      left = isDeclaration ? this[METHOD_TYPE.getVariableDeclarationStatementAst]()
        : this[METHOD_TYPE.getExpAst]();
      if (isDeclaration) {
        if (!_.last(left.tokens).is(TOKEN_TYPE.Semicolon)) {
          throwError('预期是;', _.last(left.tokens))
        }
      } else {
        restTokens.push(this.expectToken(TOKEN_TYPE.Semicolon))
      }

      return matchForFromSecondSemicolon(left, true)
    }
    const kindToken = this.eatToken()
    restTokens.push(kindToken)
    const right = this[METHOD_TYPE.getYieldExpression]();
    restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis))
    this.consume()
    const isOfType = kindToken.value === 'of';
    return this.createAstItem({
      type: isOfType ?
        AST_TYPE.ForOfStatement : AST_TYPE.ForInStatement,
      left,
      right,
      body: getBody(),
      restTokens,
      ...isOfType ? {
        await: false,
      } : {

      },
    })

  }

  [METHOD_TYPE.getSwitchCaseAst]() {
    const nextToken = this.expectToken([TOKEN_TYPE.case, TOKEN_TYPE.default]);
    const isCaseType = nextToken.is(TOKEN_TYPE.case);
    const restTokens = [nextToken];
    let test = null;
    if (isCaseType) {
      test = this[METHOD_TYPE.getExpAst]()
    }
    restTokens.push(this.expectToken(TOKEN_TYPE.Colon));

    const consequent = this.wrapInDecorator(
      AstFlagDicts.canBreakable
      , () => this.getBlockStatementBodyContent([
        TOKEN_TYPE.RightBrace,
        TOKEN_TYPE.case,
        TOKEN_TYPE.default]))
    return this.createAstItem({
      type: AST_TYPE.SwitchCase,
      consequent,
      test,
      restTokens,
    })
  }

  [METHOD_TYPE.getSwitchStatementAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.switch),
    this.expectToken(TOKEN_TYPE.LeftParenthesis)];
    const discriminant = this[METHOD_TYPE.getExpAst]();
    restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis));
    restTokens.push(this.expectToken(TOKEN_TYPE.LeftBrace));
    const cases = []
    if (this.nextTokenIs(TOKEN_TYPE.RightBrace)) {
      restTokens.push(this.eatToken())
    } else {
      while (this.nextTokenIs([TOKEN_TYPE.case, TOKEN_TYPE.default])) {
        if (cases.length > 0) {
          checkShouldWrapLine(cases, this.nextTokenIs())
        }
        const ast = this[METHOD_TYPE.getSwitchCaseAst]();
        cases.push(ast)
      }
      restTokens.push(this.expectToken(TOKEN_TYPE.RightBrace))
    }
    return this.createAstItem({
      type: AST_TYPE.SwitchStatement,
      discriminant,
      cases,
      restTokens,
    })
  }

  [METHOD_TYPE.getTryStatementAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.try)];
    const block = this[METHOD_TYPE.getBlockStatementAst]();
    const token = this.nextTokenIs();
    let handler = null;
    if (token.is(TOKEN_TYPE.catch)) {
      const restTokens = [this.eatToken()]
      let param = null;
      if (this.nextTokenIs(TOKEN_TYPE.LeftParenthesis)) {
        const { params, tempRestTokens: tempT } = this[METHOD_TYPE.getFunctionParams]();
        restTokens.push(...tempT);
        if (_.size(params) !== 1) {
          throwError('catch 参数有且仅有一个', _.last(tempT))
        }
        param = params[0];
      }
      handler = this.createAstItem({
        type: AST_TYPE.CatchClause,
        param,
        body: this[METHOD_TYPE.getBlockStatementAst](),
        restTokens,
      })
    }
    let finalizer = null;
    if (this.nextTokenIs(TOKEN_TYPE.finally)) {
      restTokens.push(this.eatToken())
      finalizer = this[METHOD_TYPE.getBlockStatementAst]()
    }
    if (!finalizer && !handler) {
      throwError('try 后面至少需要一个catch/finally', this.nextTokenIs())
    }
    return this.createAstItem({
      type: AST_TYPE.TryStatement,
      block,
      handler,
      finalizer,
      restTokens,
    })
  }

  [METHOD_TYPE.getDoWhileStatementAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.do)];
    const body = this.wrapInDecorator([AstFlagDicts.canBreakable, AstFlagDicts.canContinueable], () => this[METHOD_TYPE.getBlockStatementAst]());
    restTokens.push(this.expectToken(TOKEN_TYPE.while), this.expectToken(TOKEN_TYPE.LeftParenthesis));
    const test = this[METHOD_TYPE.getExpAst]()
    restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis));
    return this.createAstItem({
      type: AST_TYPE.DoWhileStatement,
      test,
      body,
      restTokens,
    })
  }

  [METHOD_TYPE.getSuperAst]() {
    return this.createAstItem({
      type: AST_TYPE.Super,
      restTokens: [this.expectToken(TOKEN_TYPE.super)]
    })
  }

  [METHOD_TYPE.getReturnStatementAst] = this._innerGetReturnOrYield(TOKEN_TYPE.return, AstFlagDicts.canReturnable,
    AST_TYPE.ReturnStatement, METHOD_TYPE.getExpAst);

  [METHOD_TYPE.getYieldAst] = this._innerGetReturnOrYield(TOKEN_TYPE.yield, AstFlagDicts.canYieldable,
    AST_TYPE.YieldExpression, METHOD_TYPE.getYieldExpression);

  [METHOD_TYPE.getYieldExpression]() {
    let t = null;
    if (this.nextTokenIs(TOKEN_TYPE.yield)) {
      return this[METHOD_TYPE.getYieldAst]()
    }
    return this[METHOD_TYPE.getAssignmentExpression]()
  }

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
      case TOKEN_TYPE.throw:
        return this[METHOD_TYPE.getThrowStatementAst]();
      case TOKEN_TYPE.break:
        return this[METHOD_TYPE.getBreakStatementAst]();
      case TOKEN_TYPE.continue:
        return this[METHOD_TYPE.getContinueStatementAst]();
      case TOKEN_TYPE.for:
        return this[METHOD_TYPE.getForOfInStatementAst]();
      case TOKEN_TYPE.switch:
        return this[METHOD_TYPE.getSwitchStatementAst]();
      case TOKEN_TYPE.try:
        return this[METHOD_TYPE.getTryStatementAst]();
      case TOKEN_TYPE.do:
        return this[METHOD_TYPE.getDoWhileStatementAst]();
      case TOKEN_TYPE.let:
      case TOKEN_TYPE.var:
      case TOKEN_TYPE.const:
        return this[METHOD_TYPE.getVariableDeclarationStatementAst]();
      case TOKEN_TYPE.class:
        return this[METHOD_TYPE.getClassDeclarationAst]();
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
        return this[METHOD_TYPE.getExpressionStatementOrLabelStatementAst]();
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
