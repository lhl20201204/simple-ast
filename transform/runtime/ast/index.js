// left: 'this.type === Literal',
// operator: '&&',
// right: 'this.parent.left.operator === typeof'

import _ from "lodash";
import ASTItem from "./ASTITem";
import { onlyAllowMemberExpressionOrIdentifier, valueToRaw } from "./utils";
import { isInstanceOf } from "../../commonApi";
import { AST_TYPE, EndStatement, METHOD_TYPE, TOKEN_TYPE } from "./constants";
import { Token } from "./Token";
import { SourceCodeHandleApi } from "./SourceCodeHandleApi";

export default class AST extends SourceCodeHandleApi{

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
        if (!right) {
          throw new Error('不匹配');
        }
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

  getSingleOperatorFunc(method, tokenType, config ={

  }) {
    const checkArgument = config.checkArgument ?? ((x) => x);
    const injectConfig = config.injectConfig ?? ((restTokens) => ({
      restTokens
    }))
    const ret = () => {
     if(this.nextTokenIs(tokenType)) {
      const restTokens = [this.eatToken()];
      const obj = injectConfig.bind(this, restTokens[0]);
      if (!obj.restTokens) {
        throw new Error('restTokens 漏传')
      }
      return this.createAstItem({
        ...obj,
        argument: checkArgument(ret(), obj),
      })
    }
    return this[method]();
    }
    return ret;
  }


  [METHOD_TYPE.getLiteralAst]() {
    const token = this.expectToken([TOKEN_TYPE.String, TOKEN_TYPE.Number])
    const ret = this.createAstItem({
      type: AST_TYPE.Literal,
      value: token.is(TOKEN_TYPE.String)? _.slice(token.value, 1,-1).join('') : token.value,
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

  // [METHOD_TYPE.getMemberExpressionAst]() {
  //   const methodName = METHOD_TYPE.getIdentifierAst
  //   let left = this[methodName]()
  //   let right = null;
  //   while (this.nextTokenIs([
  //     TOKEN_TYPE.Point,
  //     TOKEN_TYPE.OptionalComputedGet,
  //     TOKEN_TYPE.Optional,
  //     TOKEN_TYPE.LeftBracket
  //   ])) {
  //     let s = this.eatToken();
  //     const restTokens = [s]
  //     const computed = s.is(TOKEN_TYPE.LeftBracket) || s.is(TOKEN_TYPE.OptionalComputedGet);
  //     right = this[computed ? METHOD_TYPE.getExpAst : methodName]()
  //     if (!right) {
  //       throw new Error(AST_TYPE.MemberExpression + '属性错误')
  //     }

  //     if (computed) {
  //       restTokens.push(this.expectToken(TOKEN_TYPE.RightBracket))
  //     }

  //     left = this.createAstItem({
  //       type: AST_TYPE.MemberExpression,
  //       object: left,
  //       property: right,
  //       computed,
  //       optional: [TOKEN_TYPE.Optional, TOKEN_TYPE.OptionalComputedGet].includes(restTokens[0].type),
  //       restTokens,
  //     })

  //   }
  //   return left;
  // }

  [METHOD_TYPE.getArrayExpressionAst]() {
    const methodName = METHOD_TYPE.getExpAst;
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

  [METHOD_TYPE.getObjectPropertyAstOrSpreadElement]() {
    if (this.nextTokenIs(TOKEN_TYPE.Spread)) {
      return this[METHOD_TYPE.getSpreadElement]()
    }
    // TODO 
  }

  [METHOD_TYPE.getObjectExpressionAst]() {
    const methodName = METHOD_TYPE.getObjectPropertyAstOrSpreadElement;
    this.astContext.setSpreadable(true)
    const restTokens = [this.eatToken()];
    const properties = [];
    if (!this.nextTokenIs(TOKEN_TYPE.RightBrace)) {
      const left = this[methodName]();
      if (left) {
        properties.push(left)
      }
    }
    while (this.nextTokenIs(TOKEN_TYPE.Comma)) {
      restTokens.push(this.eatToken())
      const right = this[methodName]();
      if (right) {
        properties.push(right)
      }
    }
    this.astContext.setSpreadable(false)
    restTokens.push(this.expectToken(TOKEN_TYPE.RightBrace));
    return this.createAstItem({
      type: AST_TYPE.ObjectExpression,
      properties,
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
    }
    const e = new Error(`${token.startRow}行:${token.startCol}列-${token.endRow}行:${token.endCol}列  ${token.value} getPrimaryAst未处理的语法`);
    e.token = token;
    console.log(token.type, new Error().stack)
    throw e;
  }

  [METHOD_TYPE.getVariableDeclaratorAst]() {
    const id = this[METHOD_TYPE.getIdentifierAst]();
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
      const methodName = METHOD_TYPE.getExpAst;
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
      if (ret.type !== AST_TYPE.CallExpression) {
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
        restTokens,
      })
    }

    return this[methodName]();
  }

  [METHOD_TYPE.getSuffixUpdateExpression]() {
    let argument = this[METHOD_TYPE.getNewExpression]();
    while (this.nextTokenIs([TOKEN_TYPE.SelfAdd, TOKEN_TYPE.SelfSub])) {
      onlyAllowMemberExpressionOrIdentifier(argument, '++, -- 前面只能是')
      const restTokens = [this.eatToken()]
      argument =this.createAstItem({
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
        if ([TOKEN_TYPE.Non,
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
        if (obj.type === AST_TYPE.UpdateExpression) {
          onlyAllowMemberExpressionOrIdentifier(argument, '++, --后面只能是：')
        }
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
        if (!this.astContext.canYieldable()) {
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

  [METHOD_TYPE.getSpreadElement](){
    const method = METHOD_TYPE.getYieldExpression;
    if (this.nextTokenIs(TOKEN_TYPE.Spread)) {
      if (!this.astContext.isSpreadable()) {
        throw new Error('未允许使用' + TOKEN_TYPE.Spread )
      }
      const restTokens = [this.eatToken()];
      const argument = this[METHOD_TYPE.getExpAst]();
      return this.createAstItem({
        type: AST_TYPE.SpreadElement,
        restTokens,
        argument,
      })
    }
    return this[method]()
  }

  [METHOD_TYPE.getSequenceExpression]() {
    const method = METHOD_TYPE.getSpreadElement;
    const ast = this[method]();
    const expressions = [ast]
    const restTokens = [];
    while(this.nextTokenIs(TOKEN_TYPE.Comma)) {
      restTokens.push(this.eatToken());
      const next = this[method]();
      expressions.push(next)
    }
    if (expressions.length > 1) {
      return this.createAstItem({
        type: AST_TYPE.SequenceExpression,
        restTokens,
        expressions,
      })
    } 

    return ast;
  }

  [METHOD_TYPE.getExpAst]() {
    return this[METHOD_TYPE.getConditionalExpression]();
  }

  [METHOD_TYPE.getExpressionStatementAst]() {
    const expression = this[METHOD_TYPE.getExpAst]();
    const restTokens = [];
    if (this.nextTokenIs(TOKEN_TYPE.Semicolon)) {
      restTokens.push(this.eatToken())
    }
    return this.createAstItem({
      type: AST_TYPE.ExpressionStatement,
      expression,
      restTokens
    });
  }

  // [METHOD_TYPE.getYieldExpression]() {
  //   const restTokens = [this.eatToken()];
  //   let delegate = false;
  //   if (this.nextTokenIs(TOKEN_TYPE.Star)) {
  //     restTokens.push(this.eatToken())
  //     delegate = true;
  //   }
  //   const argument = this[METHOD_TYPE.getExpAst]();
  //   return this.createAstItem({
  //     type: AST_TYPE.YieldExpression,
  //     delegate,
  //     argument,
  //     restTokens,
  //   })
  // }

  [METHOD_TYPE.getStatementOrExpressionAst]() {
    const token = this.nextTokenIs();
    switch (token.type) {
      case TOKEN_TYPE.Semicolon:
        return this.createAstItem({
          type: AST_TYPE.EmptyStatement,
          restTokens: [this.eatToken()],
        })
      case TOKEN_TYPE.let:
      case TOKEN_TYPE.var:
      case TOKEN_TYPE.const:
        return this[METHOD_TYPE.getVariableDeclarationStatementAst]();
      case TOKEN_TYPE.EOF:
        return this.createAstItem({
          type: EndStatement,
          restTokens: [this.eatToken()]
        });
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
    try {
      while (this.sourceCode.length) {
        const ast = this[METHOD_TYPE.getStatementOrExpressionAst]()
        if (ast) {
          body.push(ast)
        }
      }
      if (_.get(body.pop(), 'type') !== EndStatement) {
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
