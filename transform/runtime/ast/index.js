import _ from "lodash";
import ASTItem from "./ASTITem";
import { onlyAllowMemberExpressionOrIdentifier, throwError, valueToRaw } from "./utils";
import { isInstanceOf } from "../../commonApi";
import { AST_TYPE, AstConfigDicts, EndStatement, METHOD_TYPE, TOKEN_TYPE } from "./constants";
import { Token } from "./Token";
import { SourceCodeHandleApi } from "./SourceCodeHandleApi";

export default class AST extends SourceCodeHandleApi {

  getPriorityAstFunc(attr, tokenType, astType, config = {
  }) {
    const checkLeft = config.checkLeft ?? (() => null);
    const checkRight = config.checkRight ?? (() => null);
    return () => {
      const restTokens = [];
      let left = this[attr]()
      while (this.nextTokenIs(tokenType)) {
        const operatorToken = this.eatToken();
        restTokens.push(operatorToken);
        let right = this[attr]()
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

  getSingleOperatorFunc(method, tokenType, config = {

  }) {
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
        const argument = ret();
        return this.createAstItem({
          ...obj,
          argument: checkArgument(argument, this.createAstItem(obj)),
        })
      }
      return this[method]();
    }
    return ret;
  }

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
          console.warn(this.astContext.tokens, _.last(this.astContext.tokens).is?.(TOKEN_TYPE.Semicolon))
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
          throw new Error('方法调用错误')
        }
        return item;
      })
      _.forEach(list, ([attr, bool]) => {
        this.astContext.methodStore['set' + _.upperFirst(attr)](bool)
      })
      const ret = fn.call(this)
      _.forEach(list, ([attr, bool]) => {
        this.astContext.methodStore['reset' + _.upperFirst(attr)]()
      })
      return ret;
    };
  }

  [METHOD_TYPE.getLiteralAst]() {
    const token = this.expectToken([TOKEN_TYPE.String, TOKEN_TYPE.Number])
    const ret = this.createAstItem({
      type: AST_TYPE.Literal,
      value: token.is(TOKEN_TYPE.String) ? _.slice(token.value, 1, -1).join('') : token.value,
      raw: valueToRaw(token),
      restTokens: [token],
    })
    // console.error(token);
    return ret;
  }

  [METHOD_TYPE.getIdentifierAst]() {
    const token = this.expectToken([TOKEN_TYPE.Word])
    return this.createAstItem({
      type: AST_TYPE.Identifier,
      name: token.value,
      restTokens: [token],
    })
  }

  [METHOD_TYPE.getArrayExpressionAst]() {
    const methodName = METHOD_TYPE.getSpreadElement;
    const restTokens = [this.eatToken()];
    const elements = [];
    const left = this[methodName]();
    if (left) {
      elements.push(left)
    }
    while (this.nextTokenIs(TOKEN_TYPE.Comma)) {
      restTokens.push(this.eatToken())
      const right = this[methodName]();
      if (right) {
        elements.push(right)
      }
    }
    restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket));
    return this.createAstItem({
      type: AST_TYPE.ArrayExpression,
      elements,
      restTokens,
    })

  }

  [METHOD_TYPE.getFunctionParams]() {
    const restTokens = [this.eatToken()];
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
      params.push(this[METHOD_TYPE.getPatternAst]())
    }
    restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis));
    return {
      restTokens,
      params,
    }
  }

  [METHOD_TYPE.getObjectExpressionPropertyAst]() {
    const matchNextState = (config = [], lastRestTokens = [], lastKey = null, index = 0) => {
      let token = this.nextTokenIs();
      let restTokens = [...lastRestTokens]
      let key = lastKey, value;
      const computedState = 'computed';
      const hadSetOrGet = x => [TOKEN_TYPE.set, TOKEN_TYPE.get].includes(x);
      const isInFunc = x => [TOKEN_TYPE.set, TOKEN_TYPE.get, TOKEN_TYPE.async, TOKEN_TYPE.Mul].includes(x);

      switch (token.type) {
        case TOKEN_TYPE.Word:
          return matchNextState(config, restTokens, this[METHOD_TYPE.getIdentifierAst](), index + 1)
        case TOKEN_TYPE.set:
        case TOKEN_TYPE.get:
          if (index !== 0 ) {
           throwError('未识别的语法', token)
          }
           token = this.eatToken();
          if (_.find(config, hadSetOrGet)) {
            throwError('重复出现setOrGet', token)
          }
          restTokens.push(token)
          return matchNextState([token.type], restTokens, index + 1)

        case TOKEN_TYPE.Mul:
        case TOKEN_TYPE.async:
          if (!(index === 0 || 
              (index === 1 && _.size(config) === 1 && config[0] === TOKEN_TYPE.async))) {
            throwError('未识别的语法', token)
          }
          restTokens.push(this.eatToken());
          return matchNextState(_.map(restTokens, 'type'), restTokens, index + 1);

        case TOKEN_TYPE.LeftBracket:
          restTokens.push(this.eatToken());
          key = this[METHOD_TYPE.getExpAst]();
          restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket));
          return matchNextState([...config, computedState], restTokens, key, index + 1);
        case TOKEN_TYPE.Colon:
          if (!index) {
            throwError('未处理的token', token)
          }
          token = this.eatToken();
          restTokens.push(token);
          if (_.some(config, isInFunc)) {
            throwError('不能出现在函数表达式后', token)
          }
          if (!key) {
            throwError('没有key值', token)
          }
          value = this[METHOD_TYPE.getYieldExpression]()
          return this.createAstItem({
            type: AST_TYPE.Property,
            method: false,
            shorthand: false,
            computed: _.includes(config, computedState),
            kind: 'init',
            key,
            value,
            restTokens
          });
        case TOKEN_TYPE.LeftParenthesis:
          if (!index) {
            throwError('未处理的token', token)
          }
          const { params, restTokens: tempRestTokens } = this[METHOD_TYPE.getFunctionParams]();
          if (_.includes(config, TOKEN_TYPE.set) && _.size(params) !== 1) {
            throwError('set计算函数必须传一个参数', _.last(tempRestTokens));
          }

          if (_.includes(config, TOKEN_TYPE.get) && _.size(params) !== 0) {
            throwError('get计算函数的参数长度应该为0', _.get(tempRestTokens, '1'));
          }
          restTokens.push(...tempRestTokens)
          const body = this[METHOD_TYPE.getBlockStatementAst]();
          const kind = _.find(config, hadSetOrGet);
          return this.createAstItem({
            type: AST_TYPE.Property,
            method: !kind,
            shorthand: false,
            computed: _.includes(config, computedState),
            kind: kind || 'init',
            key,
            value: this.createAstItem({
              type: AST_TYPE.FunctionExpression,
              id: null,
              expression: false,
              generator: _.includes(config, TOKEN_TYPE.Mul),
              async: _.includes(config, TOKEN_TYPE.async),
              params,
              body,
              restTokens
            }),
            restTokens
          });

      }
      if (
        !_.size(config) 
      && key
      && token.is(TOKEN_TYPE.Comma)
      ) {
        return this.createAstItem({
          type: AST_TYPE.Property,
          method: false,
          shorthand: true,
          computed: false,
          key: this.copyAstItem(key),
          kind: _.find(config,) || 'init',
          value: this.copyAstItem(key),
          restTokens,
        })
      }
      throwError('未处理的类型', token)
    }

    return matchNextState();
  }

  [METHOD_TYPE.getObjectExpressionPropertyOrSpreadElementAst]() {
    if (this.nextTokenIs(TOKEN_TYPE.Spread)) {
      return this[METHOD_TYPE.getSpreadElement]()
    }
    return this[METHOD_TYPE.getObjectExpressionPropertyAst]()
  }

  [METHOD_TYPE.getObjectExpressionAst] = this.decorator(AstConfigDicts.canSpreadable, () => {
    const restTokens = [this.eatToken()];
    const properties = [];
    if (!this.nextTokenIs(TOKEN_TYPE.RightBrace)) {
      properties.push(this[METHOD_TYPE.getObjectExpressionPropertyOrSpreadElementAst]())
    }
    while (this.nextTokenIs(TOKEN_TYPE.Comma)) {
      restTokens.push(this.eatToken())
      const ast = this[METHOD_TYPE.getObjectExpressionPropertyOrSpreadElementAst]();
      properties.push(ast)
      if (ast.is(AST_TYPE.RestElement)) {
        break;
      }
    }
    restTokens.push(this.expectToken(TOKEN_TYPE.RightBrace))
    return this.createAstItem({
      type: AST_TYPE.ObjectExpression,
      properties,
      restTokens,
    })
  });

  [METHOD_TYPE.getArrayPatternAst] = this.decorator([
    AstConfigDicts.canRestAble,
    AstConfigDicts.canUseAssignmentPattern,
  ], () => {
    const restTokens = [this.eatToken()];
    const elements = [];
    if (!this.nextTokenIs(TOKEN_TYPE.RightBracket)) {
      elements.push(this[METHOD_TYPE.getPatternAst]())
    }
    while (this.nextTokenIs(TOKEN_TYPE.Comma)) {
      restTokens.push(this.eatToken())
      const ast = this[METHOD_TYPE.getPatternAst]()
      elements.push(ast)
      if (ast.is(AST_TYPE.RestElement)) {
        break;
      }
    }
    restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket))
    return this.createAstItem({
      type: AST_TYPE.ArrayPattern,
      elements,
      restTokens,
    })
  });

  [METHOD_TYPE.getRestElementAst]() {
    const restTokens = [this.eatToken()]
    if (!this.astContext.methodStore.isCanRestAble()) {
      throwError('...不可使用', restTokens[0])
    }
    let argument = this[METHOD_TYPE.getPatternAst]();
    if (argument.is(AST_TYPE.AssignmentPattern) || argument.is(AST_TYPE.RestElement)) {
      throwError('...后面表达式错误', restTokens[0])
    }
    return this.createAstItem({
      type: AST_TYPE.RestElement,
      argument,
      restTokens,
    })
  }

  [METHOD_TYPE.getAssignmentPatternAst]() {
    const left = this[METHOD_TYPE.getIdentifierAst]();
    if (!this.nextTokenIs(TOKEN_TYPE.Equal)) {
      return left
    }
    const restTokens = [this.eatToken()];
    return this.createAstItem({
      type: AST_TYPE.AssignmentPattern,
      left,
      right: this[METHOD_TYPE.getSpreadElement](),
      restTokens,
    })
  }

  [METHOD_TYPE.getAssignmentPatternOrIdentityAst]() {
    if (this.astContext.methodStore.isCanUseAssignmentPattern()) {
      return this[METHOD_TYPE.getAssignmentPatternAst]()
    }
    return this[METHOD_TYPE.getIdentifierAst]()
  }

  [METHOD_TYPE.getObjectPatternPropertyAst]() {
    const token = this.nextTokenIs()
    let key, value, restTokens;
    switch (token.type) {
      case TOKEN_TYPE.LeftBracket:
        restTokens = [this.eatToken()];
        key = this[METHOD_TYPE.getSpreadElement]();
        restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket));
        restTokens.push(this.expectToken(TOKEN_TYPE.Colon));
        value = this[METHOD_TYPE.getPatternAst]();
        return this.createAstItem({
          type: AST_TYPE.Property,
          method: false,
          shorthand: false,
          computed: true,
          kind: 'init',
          key,
          value,
          restTokens,
        })
      case TOKEN_TYPE.Word:
        key = this[METHOD_TYPE.getIdentifierAst]();
        if (!this.nextTokenIs(TOKEN_TYPE.Equal)) {
          if (!this.nextTokenIs(TOKEN_TYPE.Colon)) {
            return this.createAstItem({
              type: AST_TYPE.Property,
              method: false,
              shorthand: true,
              computed: false,
              kind: 'init',
              key: this.copyAstItem(key),
              value: this.copyAstItem(key),
              restTokens: []
            })
          }
          restTokens = [this.eatToken()]
          value = this[METHOD_TYPE.getPatternAst]();
          if (value.is(AST_TYPE.RestElement)) {
            throwError('不能是restElemnt', value.tokens[0],)
          }

          return this.createAstItem({
            type: AST_TYPE.Property,
            method: false,
            shorthand: false,
            computed: false,
            kind: 'init',
            key,
            value,
            restTokens,
          })
        }
        restTokens = [this.eatToken()];
        value = this[METHOD_TYPE.getSpreadElement]();
        return this.createAstItem({
          type: AST_TYPE.Property,
          method: false,
          shorthand: true,
          computed: false,
          kind: 'init',
          key,
          value: this.createAstItem({
            type: AST_TYPE.AssignmentPattern,
            left: key,
            right: value,
            restTokens
          }),
          restTokens,
        })
    }
    throwError('未处理的复制表达式语法', token)
  }

  [METHOD_TYPE.getObjectPatternPropertyOrRestElementAst]() {
    if (this.nextTokenIs(TOKEN_TYPE.Spread)) {
      return this[METHOD_TYPE.getRestElementAst]()
    }
    return this[METHOD_TYPE.getObjectPatternPropertyAst]()
  }

  [METHOD_TYPE.getObjectPatternAst] = this.decorator([AstConfigDicts.canRestAble,
  AstConfigDicts.canUseAssignmentPattern], () => {
    const restTokens = [this.eatToken()];
    const properties = [];
    if (!this.nextTokenIs(TOKEN_TYPE.RightBrace)) {
      properties.push(this[METHOD_TYPE.getObjectPatternPropertyOrRestElementAst]())
    }
    while (this.nextTokenIs(TOKEN_TYPE.Comma)) {
      restTokens.push(this.eatToken())
      const ast = this[METHOD_TYPE.getObjectPatternPropertyOrRestElementAst]();
      properties.push(ast)
      if (ast.is(AST_TYPE.RestElement)) {
        break;
      }
    }
    restTokens.push(this.expectToken(TOKEN_TYPE.RightBrace))
    return this.createAstItem({
      type: AST_TYPE.ObjectPattern,
      properties,
      restTokens,
    })
  });

  [METHOD_TYPE.getPatternAst]() {
    const token = this.nextTokenIs();
    switch (token.type) {
      case TOKEN_TYPE.LeftBracket: return this[METHOD_TYPE.getArrayPatternAst]();
      case TOKEN_TYPE.LeftBrace: return this[METHOD_TYPE.getObjectPatternAst]();
      case TOKEN_TYPE.Spread: return this[METHOD_TYPE.getRestElementAst]();
      case TOKEN_TYPE.Word: return this[METHOD_TYPE.getAssignmentPatternOrIdentityAst]();
    }
    throwError('未允许的复制表达式左边', token)
  }

  [METHOD_TYPE.getVariableDeclaratorAst]() {
    const id = this[METHOD_TYPE.getPatternAst]();
    const restTokens = []
    if (this.nextTokenIs([TOKEN_TYPE.Equal])) {
      restTokens.push(this.eatToken());
      const init = this[METHOD_TYPE.getExpAst]();
      return this.createAstItem({
        type: AST_TYPE.VariableDeclarator,
        id,
        init,
        restTokens,
      })
    }
    return this.createAstItem({
      type: AST_TYPE.VariableDeclarator,
      id,
      restTokens,
    })
  }

  [METHOD_TYPE.getVariableDeclarationStatementAst]() {
    const restTokens = [this.eatToken()];
    const declarations = [];
    const methodName = METHOD_TYPE.getVariableDeclaratorAst;
    const vd = this[methodName]();
    if (vd) {
      declarations.push(vd)
    }
    while (this.nextTokenIs(TOKEN_TYPE.Comma)) {
      restTokens.push(this.eatToken());
      const vd = this[methodName]();
      if (vd) {
        declarations.push(vd)
      }
    }
    if (this.nextTokenIs(TOKEN_TYPE.Semicolon)) {
      restTokens.push(this.eatToken());
    }
    return this.createAstItem({
      type: AST_TYPE.VariableDeclaration,
      declarations,
      kind: restTokens[0].value,
      restTokens,
    })

  }

  [METHOD_TYPE.getPrimaryAst]() {
    const token = this.nextTokenIs();
    switch (token.type) {
      case TOKEN_TYPE.String:
      case TOKEN_TYPE.Number: return this[METHOD_TYPE.getLiteralAst]();
      case TOKEN_TYPE.LeftBrace: return this[METHOD_TYPE.getObjectExpressionAst]();
      case TOKEN_TYPE.LeftBracket: return this[METHOD_TYPE.getArrayExpressionAst]();
      case TOKEN_TYPE.LeftParenthesis:
        const restTokens = [this.eatToken()];
        const ast = this[METHOD_TYPE.getExpAst]();
        ast.restTokens = [...restTokens, ...ast.restTokens || [], this.expectToken(TOKEN_TYPE.RightParenthesis)];
        return this.createAstItem({
          ...ast,
        });
      case TOKEN_TYPE.Word: return this[METHOD_TYPE.getIdentifierAst]();
      case TOKEN_TYPE.this: return this.createAstItem({
        type: AST_TYPE.ThisExpression,
        restTokens: [this.eatToken()]
      })
    }
    throwError('getPrimaryAst未处理的语法', token)
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

  [METHOD_TYPE.getIfStatementAst]() {
    const restTokens = [this.eatToken(), this.expectToken(TOKEN_TYPE.LeftParenthesis)];
    const test = this[METHOD_TYPE.getExpAst]();
    restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis));
    const consequent = this[this.nextTokenIs(TOKEN_TYPE.LeftBrace) ? METHOD_TYPE.getBlockStatementAst : METHOD_TYPE.getStatementOrExpressionAst]();
    const config = {
      type: AST_TYPE.IfStatement,
      test,
      consequent,
      restTokens,
      alternate: null
    };
    if (this.nextTokenIs(TOKEN_TYPE.else)) {
      restTokens.push(this.eatToken())
      config.alternate = this[METHOD_TYPE.getStatementOrExpressionAst]();
    }
    return this.createAstItem(config)
  }

  [METHOD_TYPE.getMemberOrCallExpression]() {
    const methodName = METHOD_TYPE.getPrimaryAst
    let left = this[methodName]()
    let right = null;
    while (this.nextTokenIs([
      TOKEN_TYPE.Point,
      TOKEN_TYPE.OptionalComputedGet,
      TOKEN_TYPE.Optional,
      TOKEN_TYPE.LeftBracket,
      TOKEN_TYPE.LeftParenthesis,
      TOKEN_TYPE.OptionalCall
    ])) {
      let s = this.eatToken();
      if (s.is(TOKEN_TYPE.LeftParenthesis) || s.is(TOKEN_TYPE.OptionalCall)) {
        this.astContext.methodStore.setCanSpreadable(true)
        const methodName = METHOD_TYPE.getSpreadElement;
        const restTokens = [s]
        const optional = s.is(TOKEN_TYPE.OptionalCall);
        const args = [];
        if (!this.nextTokenIs(TOKEN_TYPE.RightParenthesis)) {
          const exp = this[methodName]();
          if (exp) {
            args.push(exp)
          }
        }
        while (this.nextTokenIs(TOKEN_TYPE.Comma)) {
          restTokens.push(this.eatToken())
          const exp = this[methodName]();
          if (exp) {
            args.push(exp)
          }
        }
        restTokens.push(this.expectToken(TOKEN_TYPE.RightParenthesis))
        this.astContext.methodStore.resetCanSpreadable()
        left = this.createAstItem({
          type: AST_TYPE.CallExpression,
          optional,
          callee: left,
          arguments: args,
          restTokens,
        })
      } else {
        const restTokens = [s]
        const computed = s.is(TOKEN_TYPE.LeftBracket) || s.is(TOKEN_TYPE.OptionalComputedGet);
        right = this[computed ? METHOD_TYPE.getExpAst : methodName]()
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
          optional: [TOKEN_TYPE.Optional, TOKEN_TYPE.OptionalComputedGet].includes(restTokens[0].type),
          restTokens,
        })
      }
    }
    return left;
  }

  [METHOD_TYPE.getNewExpression]() {
    const methodName = METHOD_TYPE.getMemberOrCallExpression;
    const restTokens = [];
    if (this.nextTokenIs(TOKEN_TYPE.new)) {
      restTokens.push(this.eatToken())
      const ret = this[METHOD_TYPE.getNewExpression]();
      if (!ret.is(AST_TYPE.CallExpression)) {
        return this.createAstItem({
          type: AST_TYPE.NewExpression,
          callee: ret,
          arguments: [],
          restTokens,
        })
      }
      if (ret.optional) {
        throw new Error(' new 表达式不能是?.调用')
      }
      return this.createAstItem({
        type: AST_TYPE.NewExpression,
        ..._.pick(ret, ['callee', 'arguments']),
        restTokens: [...restTokens, ...ret.tokens],
      })
    }

    return this[methodName]();
  }

  [METHOD_TYPE.getSuffixUpdateExpression]() {
    let argument = this[METHOD_TYPE.getNewExpression]();
    while (this.nextTokenIs([TOKEN_TYPE.SelfAdd, TOKEN_TYPE.SelfSub])) {
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
          return {
            type: AST_TYPE.AwaitExpression,
            restTokens,
          }
        }

        throw new Error('未处理')
      },
      checkArgument(argument, obj) {
        console.log(obj)
        if (obj.is(AST_TYPE.UpdateExpression)) {
          onlyAllowMemberExpressionOrIdentifier(argument, '当前是' + argument.type + ',但++/--符号后面只能是：')
        }
        return argument;
      }
    }
  );

  [METHOD_TYPE.getConditionalExpression]() {
    const methodName = METHOD_TYPE.getOrExpression;
    const restTokens = [];
    let test = this[methodName]();
    if (this.nextTokenIs(TOKEN_TYPE.Question)) {
      restTokens.push(this.eatToken());
      const consequent = this[METHOD_TYPE.getExpAst]();
      if (!consequent) {
        throw new Error('?:缺失表达式')
      }
      restTokens.push(this.expectToken(TOKEN_TYPE.Colon));
      const alternate = this[METHOD_TYPE.getExpAst]();
      if (!alternate) {
        throw new Error('?:缺失表达式')
      }
      test = this.createAstItem({
        type: AST_TYPE.ConditionalExpression,
        test,
        consequent,
        alternate,
        restTokens,
      })
    }
    return test;
  }

  [METHOD_TYPE.getAssignmentExpression] = this.getPriorityAstFunc(METHOD_TYPE.getConditionalExpression, [
    TOKEN_TYPE.Equal,
    TOKEN_TYPE.PlusEqual,
    TOKEN_TYPE.SubEqual,
    TOKEN_TYPE.MulEqual,
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
      onlyAllowMemberExpressionOrIdentifier(ast, '复制表达式右边只能是:')
    }
  });


  [METHOD_TYPE.getYieldExpression] = this.getSingleOperatorFunc(METHOD_TYPE.getAssignmentExpression,
    TOKEN_TYPE.yield,
    {
      injectConfig(token) {
        const restTokens = [token]
        if (!this.astContext.methodStore.isCanYieldable()) {
          throw new Error('不允许' + TOKEN_TYPE.yield);
        }
        let delegate = false;
        if (this.nextTokenIs(TOKEN_TYPE.Star)) {
          delegate = true;
          restTokens.push(this.eatToken());
        }
        return {
          type: AST_TYPE.YieldExpression,
          restTokens,
          delegate,
        }
      },
    }
  );

  [METHOD_TYPE.getSpreadElement]() {
    const method = METHOD_TYPE.getYieldExpression;
    if (this.nextTokenIs(TOKEN_TYPE.Spread)) {
      if (!this.astContext.methodStore.isCanSpreadable()) {
        throw new Error('未允许使用' + TOKEN_TYPE.Spread)
      }
      const restTokens = [this.eatToken()];
      const argument = this[METHOD_TYPE.getExpAst]();
      return this.createAstItem({
        type: AST_TYPE.SpreadElement,
        argument,
        restTokens,
      })
    }
    return this[method]()
  }

  [METHOD_TYPE.getSequenceExpression]() {
    const method = METHOD_TYPE.getSpreadElement;
    const ast = this[method]();
    const expressions = [ast]
    const restTokens = [];
    while (this.nextTokenIs(TOKEN_TYPE.Comma)) {
      restTokens.push(this.eatToken());
      const next = this[method]();
      expressions.push(next)
    }
    if (expressions.length > 1) {
      return this.createAstItem({
        type: AST_TYPE.SequenceExpression,
        expressions,
        restTokens,
      })
    }

    return ast;
  }

  [METHOD_TYPE.getExpAst]() {
    return this[METHOD_TYPE.getSequenceExpression]();
  }

  [METHOD_TYPE.getExpressionStatementAst]() {
    const expression = this[METHOD_TYPE.getExpAst]();
    const restTokens = [];
    if (this.nextTokenIs(TOKEN_TYPE.Semicolon)) {
      restTokens.push(this.eatToken())
    }
    const obj = {
      type: AST_TYPE.ExpressionStatement,
      expression,
      restTokens
    };
    if (expression.is(AST_TYPE.Literal) && _.startsWith(expression.value, 'use ')) {
      obj.directive = expression.value;
    }
    return this.createAstItem(obj);
  }

  [METHOD_TYPE.getSleepStatement]() {
    const restTokens = [this.eatToken()];
    const argument = this[METHOD_TYPE.getExpAst]();
    return this.createAstItem({
      type: AST_TYPE.SleepStatement,
      argument,
      restTokens
    });
  }

  [METHOD_TYPE.getReturnStatementAst]() {
    const restTokens = [this.eatToken()];
    const argument = this[METHOD_TYPE.getExpAst]();
    if (this.nextTokenIs(TOKEN_TYPE.Semicolon)) {
      restTokens.push(this.eatToken())
    }
    return this.createAstItem({
      type: AST_TYPE.ReturnStatement,
      argument,
      restTokens
    });
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
      case TOKEN_TYPE.let:
      case TOKEN_TYPE.var:
      case TOKEN_TYPE.const:
        return this[METHOD_TYPE.getVariableDeclarationStatementAst]();
      case TOKEN_TYPE.if:
        return this[METHOD_TYPE.getIfStatementAst]();
      case TOKEN_TYPE.LeftBrace:
        return this[METHOD_TYPE.getBlockStatementAst]();
      // case TOKEN_TYPE.EOF:
      //   return this.createAstItem({
      //     type: EndStatement,
      //     restTokens: [this.eatToken()]
      //   });
      default:
        return this[METHOD_TYPE.getExpressionStatementAst]();
    }
    // console.error(token.type)
    // const e = new Error(`${token.startRow}行:${token.startCol}列-${token.endRow}行:${token.endCol}列  ${token.value} getStatementOrExpressionAst未处理的语法`);
    // e.token = token
    // throw e;
  }

  getAst() {
    const body = [];
    let eofToken 
    try {
      body.push(...this.getBlockStatementBodyContent(TOKEN_TYPE.EOF));
      if (!(eofToken =this.expectToken(TOKEN_TYPE.EOF))) {
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
    for (const [methodName, getFn, operator, expression] of [
      [
        METHOD_TYPE.getDoubleStarExpression,
        'getPriorityAstFunc',
        [
          TOKEN_TYPE.DoubleStar
        ],
        AST_TYPE.BinaryExpression
      ],
      [
        METHOD_TYPE.getMulOrDivOrModExpression,
        'getPriorityAstFunc',
        [
          TOKEN_TYPE.Mul,
          TOKEN_TYPE.Div,
          TOKEN_TYPE.Mod
        ],
        AST_TYPE.BinaryExpression
      ],
      [
        METHOD_TYPE.getSubOrPlusExpression,
        'getPriorityAstFunc',
        [
          TOKEN_TYPE.Plus,
          TOKEN_TYPE.Subtract,
        ],
        AST_TYPE.BinaryExpression
      ],
      [
        METHOD_TYPE.getShiftExpression,
        'getPriorityAstFunc',
        [
          TOKEN_TYPE.ShiftLeft,
          TOKEN_TYPE.ShiftRight,
          TOKEN_TYPE.UnsignedShiftRight
        ],
        AST_TYPE.BinaryExpression
      ],
      [
        METHOD_TYPE.getCompareExpression,
        'getPriorityAstFunc',
        [
          TOKEN_TYPE.Less,
          TOKEN_TYPE.LessEqual,
          TOKEN_TYPE.Great,
          TOKEN_TYPE.GreatEqual,
          TOKEN_TYPE.in,
          TOKEN_TYPE.instanceof
        ],
        AST_TYPE.BinaryExpression
      ],
      [
        METHOD_TYPE.getEqualOrNoExpression,
        'getPriorityAstFunc',
        [
          TOKEN_TYPE.NoCompare,
          TOKEN_TYPE.Compare,
          TOKEN_TYPE.NoStrictEqual,
          TOKEN_TYPE.StrictEqual,
        ],
        AST_TYPE.BinaryExpression
      ],
      [
        METHOD_TYPE.getSingelAndExpression,
        'getPriorityAstFunc',
        TOKEN_TYPE.SingelAnd,
        AST_TYPE.BinaryExpression
      ],
      [
        METHOD_TYPE.getSingleXorExpression,
        'getPriorityAstFunc',
        TOKEN_TYPE.SingleXor,
        AST_TYPE.BinaryExpression
      ],
      [
        METHOD_TYPE.getSingleOrExpression,
        'getPriorityAstFunc',
        TOKEN_TYPE.SingleOr,
        AST_TYPE.BinaryExpression
      ],
      [
        METHOD_TYPE.getAndExpression,
        'getPriorityAstFunc',
        TOKEN_TYPE.And,
        AST_TYPE.LogicalExpression
      ],
      [
        METHOD_TYPE.getDoubleQuestionExpression,
        'getPriorityAstFunc',
        TOKEN_TYPE.DoubleQuestion,
        AST_TYPE.LogicalExpression,
      ],
      [
        METHOD_TYPE.getOrExpression,
        'getPriorityAstFunc',
        TOKEN_TYPE.OR,
        AST_TYPE.LogicalExpression,
      ]
    ]) {
      this[methodName] = this[getFn](methodNameList[methodNameList.length - 1], operator, expression);
      methodNameList.push(methodName)
    }
  }

}
