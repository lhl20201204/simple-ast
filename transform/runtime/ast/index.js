import _ from "lodash";
import { avoidPureArrowFuncitonExpressionNextTokenIsOperator, checkShouldWrapLine, checkThrowIfSameName, ensureAllTypeInList, getValueOfLiteralToken, onlyAllowMemberExpressionOrIdentifier, rawToCooked, throwError, tokenHadWrapLine, valueToRaw } from "./utils";
import { isInstanceOf, log } from "../../commonApi";
import { AST_TYPE, AstFlagDicts, METHOD_TYPE, TOKEN_TYPE, TOKEN_TYPE_VALUE_LIST, commonLiteral, definePriorityConfig, prefixDicts } from "./constants";
import { Token } from "./Token";
import { SourceCodeHandleApi } from "./SourceCodeHandleApi";
import { MethodConfig } from "./MethodConfig";

export default class AST extends SourceCodeHandleApi {  
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
          const params = [this[METHOD_TYPE.getIdentifierAst]()];
          const { expression, tempRestTokens, body } = this.getArrowFunctionBody();
          restTokens.push(...tempRestTokens);
          return this.createAstItem({
            type: AST_TYPE.ArrowFunctionExpression,
            id: null,
            expression,
            generator: false,
            async: isAysnc,
            params,
            body,
            restTokens,
          })
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
      let body 
      if (!onlyCanBeArrowFunction || this.nextTokenIs(TOKEN_TYPE.LeftBrace) ) {
        body = this.getFunctionBodyAst()
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
      return ret;
    }
  }

  _innerGetPropertyOrMethod = (tokenType) => (config) => {
    ensureAllTypeInList(tokenType, TOKEN_TYPE_VALUE_LIST);
    const token = this.wrapInDecorator(AstFlagDicts.canUseKeyWordAsKey, () => this.nextTokenIs());

    const restTokens = []
    if (!token.is(TOKEN_TYPE.Word) && !token.is(TOKEN_TYPE.LeftBracket)) {
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
    } else {
      key = this.wrapInDecorator(AstFlagDicts.canUseKeyWordAsKey, () => this[METHOD_TYPE.getIdentifierAst]()) 
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
        restTokens,
        shorthand: false,
      }
    }
    if (computed || this.nextTokenIs(TOKEN_TYPE.LeftParenthesis)) {
      const value =this.wrapInDecorator([
        config.async && AstFlagDicts.canAwaitable,
        config.generator && AstFlagDicts.canYieldable
      ].filter(x => !!x), () => this[METHOD_TYPE.getObjectPropertyMethod]())
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
      value: tokenType === TOKEN_TYPE.Colon ?  this.copyAstItem(key) : null,
      computed: false,
      restTokens,
      shorthand: true,
    }
  }

  getBlockStatementBodyContent(type) {
    const body = []
    while (this.sourceCode.length && !this.nextTokenIs(type)) {
      const current = this.nextTokenIs();
      if (body.length) {
        checkShouldWrapLine(body, current)
      }
      const ast = this[METHOD_TYPE.getStatementOrExpressionAst]()
      if (ast) {
        body.push(ast)
      }
    }
    return body;
  }

  getFunctionBodyAst() {
    return this.wrapInDecorator(AstFlagDicts.canReturnable, () => this[METHOD_TYPE.getBlockStatementAst]());
  }

  getArrowFunctionBody () {
    const tempRestTokens = [this.expectToken(TOKEN_TYPE.Arrow)];
    const expression = !this.nextTokenIs(TOKEN_TYPE.LeftBrace);
    let  body = null;
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
      return this.wrapInDecorator(AstFlagDicts.canUseTemplateLiteralMiddleString, ()=> this[type](...args)) 
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

  [METHOD_TYPE.getIdentifierOrArrowFunctionAst]() {
    const key = this[METHOD_TYPE.getIdentifierAst]()
    const restTokens = []
    if (this.nextTokenIs(TOKEN_TYPE.Arrow)) {
      const { expression, tempRestTokens, body } = this.getArrowFunctionBody();
      restTokens.push(...tempRestTokens);
      return this.createAstItem({
        type: AST_TYPE.ArrowFunctionExpression,
        id: null,
        async: false,
        expression,
        generator: false,
        params: [ key],
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
          if(t.is(TOKEN_TYPE.Word) && tokenHadWrapLine(t)) {
            throwError('async 函数后面不能换行', t);
          }
        }
      }
      if (this.nextTokenIs(TOKEN_TYPE.Star)) {
        restTokens.push(this.eatToken());
        generator = true;
      }
    } else if (this.nextTokenIs([TOKEN_TYPE.set, TOKEN_TYPE.get])) {
      const token = this.eatToken();
      restTokens.push(token);
      if ( this.nextTokenIs([TOKEN_TYPE.Colon, TOKEN_TYPE.LeftParenthesis, TOKEN_TYPE.Comma])) {
        hadReback = true;
        this.restore()
      } else {
        kind = token.value
      }
    }
    if (!hadReback) {
      this.consume()
    }
    const { key, value, computed, restTokens: tempRestTokens, method, shorthand} = this[METHOD_TYPE.getObjectProperties]({
      async: isAsync,
      generator,
    });
    restTokens.push(...tempRestTokens)
    if (method) {
      restTokens.push(...value.restTokens);
      if (kind === commonLiteral.set) {
        if (_.size(value.params)!== 1) {
          throwError('setter的参数有且仅有1个', _.head(value.restTokens))
        }
      } 
      if (kind === commonLiteral.get) {
        if (_.size(value.params)!== 0) {
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
    if ( isAsync || generator) {
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
    const shouldReback = (tokens = [], isSetOrGetter) =>{ 
      const mayBeWordToken = this.wrapInDecorator(AstFlagDicts.canUseKeyWordAsKey, () => this.nextTokenIs());
      let t 
      return !(_.some([ ...tokens], x => mayBeWordToken.is(x)) 
      
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
    } else if (this.nextTokenIs([TOKEN_TYPE.set, TOKEN_TYPE.get])) {
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
    const { key, value, computed, restTokens: tempRestTokens, method} = this[METHOD_TYPE.getClassPropertyOrMethod]({
      async: isAsync,
      generator,
    });
    restTokens.push(...tempRestTokens)
    if (method) {
      restTokens.push(...value.restTokens);
      if (kind === commonLiteral.set) {
        if (_.size(value.params)!== 1) {
          throwError('setter的参数有且仅有1个', _.head(value.restTokens))
        }
      } 
      if (kind === commonLiteral.get) {
        if (_.size(value.params)!== 0) {
          throwError('getter不能有参数', _.head(value.restTokens))
        }
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
    if ( isAsync || generator) {
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
    const restTokens = [ this.expectToken(TOKEN_TYPE.LeftBrace)];
    const body = []
    const  skipSemicolon = () => {
      while(this.nextTokenIs(TOKEN_TYPE.Semicolon)) {
        restTokens.push(this.eatToken())
      }
    }
    while(!this.nextTokenIs(TOKEN_TYPE.RightBrace)) {
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

  [METHOD_TYPE.getClassDeclarationAst]() {
    const restTokens = [this.expectToken(TOKEN_TYPE.class)];
    const id = this[METHOD_TYPE.getIdentifierAst]();
    let superClass = null;
    if (this.nextTokenIs(TOKEN_TYPE.extends)) {
      restTokens.push(this.eatToken());
      superClass = this[METHOD_TYPE.getMemberOrCallExpression]();
    }
    const body = this[METHOD_TYPE.getClassBodyAst]();
    return this.createAstItem({
      type: AST_TYPE.ClassDeclaration,
      id,
      superClass,
      body,
      restTokens,
    })
  }

  [METHOD_TYPE.getObjectProperties]= this._innerGetPropertyOrMethod(TOKEN_TYPE.Colon);

  [METHOD_TYPE.getClassPropertyOrMethod] = this._innerGetPropertyOrMethod(TOKEN_TYPE.Equal);

  [METHOD_TYPE.getArrowFunctionExpressionAst]() {
    if (this.proxyMethod(prefixDicts.is, AstFlagDicts.cannotUsePureArrowExpression)) {
      const restTokens = [this.expectToken(TOKEN_TYPE.LeftParenthesis)];
      const ast = this.wrapInDecorator(AstFlagDicts.cannotUsePureArrowExpression, ()=>this[METHOD_TYPE.getExpAst](), false);
      
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
      restTokens.push(this.eatToken());
      const { expression, tempRestTokens, body } = this.getArrowFunctionBody();
      restTokens.push(...tempRestTokens);
      this.consume()
      return this.createAstItem({
        type: AST_TYPE.ArrowFunctionExpression,
        id: null,
        expression,
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
    const { expression, tempRestTokens: tempT, body } = this.getArrowFunctionBody();
    restTokens.push(...tempT);
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
      let callee = this[METHOD_TYPE.getNewExpression]();
      let s = this.nextTokenIs();
      while (s.is(TOKEN_TYPE.Point) || s.is(TOKEN_TYPE.Optional) || s.is(TOKEN_TYPE.LeftBracket)) {
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
            property: this[METHOD_TYPE.getExpAst](),
            computed,
            optional,
            restTokens
          })
        } else {
          callee = this.wrapInDecorator([
            AstFlagDicts.cannotUsePureArrowExpression,
            AstFlagDicts.canUseKeyWordAsKey
          ], () =>this.createAstItem({
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
          right = this.wrapInDecorator([ 
            AstFlagDicts.cannotUsePureArrowExpression, 
            AstFlagDicts.canUseKeyWordAsKey
          ],()=> this[METHOD_TYPE.getPrimaryAst]())
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
      case TOKEN_TYPE.throw:
        return this[METHOD_TYPE.getThrowStatementAst]();
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
