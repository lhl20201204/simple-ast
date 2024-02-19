import { isInstanceOf, log } from "../../commonApi";
import ASTItem from "./ASTITem";
import { AST_TYPE, AstFlagDicts, METHOD_TYPE, METHOD_TYPE_VALUES_LIST, TOKEN_TYPE, commonLiteral, prefixDicts, directlyReturnFlag } from "./constants";
import { throwError } from "./utils";

const canBeAnyType = AST_TYPE.Identifier;

function completeAttribute(attr, defaultValue) {
  if (!_.isString(attr) || arguments.length !== 2) {
    throw new Error('方法调用错误')
  }
  return function (config) {
    return {
      ...config,
      [attr]: config[attr] ?? defaultValue,
    }
  }
}

function ifWholeElsePickAttr(flagAttr, attr) {
  if (!_.isString(flagAttr) || !_.isString(attr)) {
    throw new Error('方法调用错误')
  }
  return function (config, flag) {
    return flag[flagAttr] ? config : config[attr]
  }
}

function getDirectlyReturnConfig(type, rest = {}) {
  if (!_.includes(METHOD_TYPE_VALUES_LIST, type) && !_.isFunction(type)) {
    throw 'type有误'
  }
  if (!_.isObject(rest)) {
    throw 'rest 应该为对象'
  }
  if (_.isFunction(type)) {
    return {
      dynamicType: type,
      configName: directlyReturnFlag,
      ...rest || {},
    }
  }
  return {
    type,
    configName: directlyReturnFlag,
    ...rest || {},
  }
}

function getLoopGroupConfig(tokenType, groupName, methodType) {
  return {
    hookType(config) {
      if (!this.nextTokenIs(tokenType)) {
        if (!Array.isArray(config[groupName])) {
          config[groupName] = []
        }
        config[groupName].push(this[methodType]())
      }
    }
  }
}

function switchDefault(errText) {
  return {
    hookType(config) {
      if (_.size(config) < 3) {
        throwError(errText, this.nextTokenIs())
      }
    }
  }
}

export function debuggerFn(type) {
  const injectBefore = function () { console.log( [_.cloneDeep(this.sourceCode)])}
  const injectAfter = function (...args) {  console.log('--->', ..._.cloneDeep(args)) }
  if (_.isString(type)) {
    return {
      before: injectBefore,
      type,
      after: injectAfter,
    }
  }
  const originAfter = type.after;
  const originBefore = type.before;
  return {
    ...type,
    before(...args) {
      injectBefore.call(this, ...args)
      return originBefore?.call(this, ...args)
    },
    after(...args) {
      injectAfter.call(this, ...args)
      return originAfter?.call(this, ...args)
    }
  }
}

function switchConfig(config, errText, rest = {}) {
  return ([
    {
      type: canBeAnyType,
      ...rest
    },
    [
      ..._.flatten(_.map(config, (ifTypeList, type) => {
        return _.map(_.flatten([ifTypeList]), (ifType) => ({
          ifType,
          noEat: true,
          consequent: [getDirectlyReturnConfig(type)]
        }))
      })),
      switchDefault(errText)
    ]
  ])
}

function handleObjectProperty(config, { kind, generator}) {
  const { 
    shorthand,
    method,
    key,
    value,
    computed,
    restTokens
  } = config.tempRet;
  config.shorthand = shorthand;
  config.method = method;
  config.computed = computed;
  config.key = key;
  config.value = method ? this.createAstItem({
    type: AST_TYPE.FunctionExpression,
    id: null,
    expression: false,
    generator,
    async: config.async,
    params: value.params,
    body: value.body,
    restTokens
  }) : value
  config.kind = kind;
  if (!isInstanceOf(config.value, ASTItem)) {
    throw '返回必须是astItem'
  }
  config.restTokens.push(...restTokens, ...method ? value.restTokens : [])
  Reflect.deleteProperty(config, 'tempRet')
  Reflect.deleteProperty(config, 'generator')
  Reflect.deleteProperty(config, 'async')
}

export const MethodConfig = {
  [METHOD_TYPE.getObjectExpressionPropertyAst]: [
    (AST_TYPE.Property),
    [
      {
        ifType: TOKEN_TYPE.async,
        configName: 'async',
        consequent: [
          {
            ifType: TOKEN_TYPE.Star,
            configName: 'generator',
          },
          {
            type: METHOD_TYPE.getObjectProperties,
            getArguments(config) {
              return config
            },
            configName: 'tempRet',
            after(config) {
              const { 
                method,
                restTokens
              } = config.tempRet;
              if (!method) {
                throwError('async /* 后面必须是函数', _.last(restTokens));
              }
              handleObjectProperty.call(this, config, {
                kind: commonLiteral.init,
                generator: config.generator
              })
            
            }
          }
        ],
        alternate: [
          {
            ifType: [TOKEN_TYPE.set, TOKEN_TYPE.get],
            configName: 'kind',
            after(config){
              config.kind = _.last(config.restTokens).value;
            },
            consequent: [
              {
                type: METHOD_TYPE.getObjectProperties,
                getArguments(config) {
                  return config
                },
                configName: 'tempRet',
                after(config) {
                  const { 
                    method,
                    restTokens
                  } = config.tempRet;
                  if (!method) {
                    throwError('setter/getter必须是函数', _.last(restTokens));
                  }
                  handleObjectProperty.call(this, config, {
                    kind: config.kind,
                    generator: false
                  })
                  config.method = false
                }
              }
            ],
            alternate: [
              {
                ifType: TOKEN_TYPE.Star,
                configName: 'generator',
                consequent: [
                  {
                    type: METHOD_TYPE.getObjectProperties,
                    getArguments(config) {
                      return config
                    },
                    configName: 'tempRet',
                    after(config) {
                      const { 
                        method,
                        restTokens
                      } = config.tempRet;
                      if (!method) {
                        throwError('async /* 后面必须是函数', _.last(restTokens));
                      }
                      handleObjectProperty.call(this, config, {
                        kind: commonLiteral.init,
                        generator: config.generator
                      })
                    
                    }
                  }
                ],
                alternate: [
                  {
                    type: METHOD_TYPE.getObjectProperties,
                    getArguments(config) {
                      return config
                    },
                    configName: 'tempRet',
                    after(config) {
                      handleObjectProperty.call(this, config, {
                        kind: commonLiteral.init,
                        generator: false,
                      })
                    }
                  }
                ]
              },
             
            ]
          },
        ],
      },
    ]
  ],
  [METHOD_TYPE.getObjectExpressionPropertyOrSpreadElementAst]: [
    canBeAnyType,
    [
      {
        ifType: TOKEN_TYPE.Spread,
        noEat: true,
        consequent: [ getDirectlyReturnConfig(METHOD_TYPE.getSpreadElement)],
        alternate: [ getDirectlyReturnConfig(METHOD_TYPE.getObjectExpressionPropertyAst)],
      }
    ]
  ],
  [METHOD_TYPE.getArrayExpressionAst]: [
    {
      type: AST_TYPE.ArrayExpression,
      [AstFlagDicts.canSpreadable]: true,
    },
    [
      {
        expectType: TOKEN_TYPE.LeftBracket
      },
      {
        ifType: TOKEN_TYPE.RightBracket,
        ifTrueInjectConfig: {
          elements: []
        },
        alternate: [
          getLoopGroupConfig(TOKEN_TYPE.RightBracket, 'elements', METHOD_TYPE.getSpreadElement),
          {
            ifType: TOKEN_TYPE.Comma,
            jump: 2,
          },
          {
            expectType:  TOKEN_TYPE.RightBracket
          }
        ]
      }
    ]
  ],
  [METHOD_TYPE.getObjectExpressionAst]: [
    {
      type: AST_TYPE.ObjectExpression,
      [AstFlagDicts.canSpreadable]: true,
    },
    [
      {
        expectType: TOKEN_TYPE.LeftBrace
      },
      {
        ifType: TOKEN_TYPE.RightBrace,
        ifTrueInjectConfig: {
          properties: []
        },
        alternate: [
          getLoopGroupConfig(TOKEN_TYPE.RightBrace, 'properties', METHOD_TYPE.getObjectExpressionPropertyOrSpreadElementAst),
          {
            ifType: TOKEN_TYPE.Comma,
            jump: 2,
          },
          {
            expectType:  TOKEN_TYPE.RightBrace
          }
        ]
      }
    ]
  ],
  [METHOD_TYPE.getArrayPatternAst]: [
    {
      type: AST_TYPE.ArrayPattern,
      [AstFlagDicts.canRestable]: true,
      [AstFlagDicts.canUseAssignmentPattern]: true,
    },[
      {
        expectType: TOKEN_TYPE.LeftBracket,
      },
      {
        ifType: TOKEN_TYPE.RightBracket,
        ifTrueInjectConfig: {
          elements: []
        },
        alternate: [
          {
            type: METHOD_TYPE.getPatternAst,
            groupName: 'elements',
            after(config) {
              if (_.last(config.elements).is(AST_TYPE.RestElement)) {
                return {
                  jump: 4,
                }
              }
            }
          },
          {
            ifType: TOKEN_TYPE.Comma,
            jump: 2,
          },
          {
            expectType:  TOKEN_TYPE.RightBracket
          }
        ]
      }
    ]
  ],
  [METHOD_TYPE.getRestElementAst]: [
    AST_TYPE.RestElement,
    [
      {
        expectType: TOKEN_TYPE.Spread,
        after(config) {
          if (!this.proxyMethod(prefixDicts.is, AstFlagDicts.canRestable)) {
            throwError('...不可使用', config.restTokens[0])
          }
        }
      },
      {
        type: METHOD_TYPE.getPatternAst,
        configName: 'argument',
        after({ argument, restTokens}) {
          if (argument.is(AST_TYPE.AssignmentPattern) || argument.is(AST_TYPE.RestElement)) {
            throwError('...后面表达式错误', restTokens[0])
          }
        }
      }
    ]
  ],
  [METHOD_TYPE.getAssignmentPatternOrIdentityAst]: [
    canBeAnyType, [
      getDirectlyReturnConfig(function() {
      return this.proxyMethod(prefixDicts.is, AstFlagDicts.canUseAssignmentPattern) 
      ?  METHOD_TYPE.getAssignmentPatternAst : METHOD_TYPE.getIdentifierAst
    })]
  ],
  [METHOD_TYPE.getAssignmentPatternAst]: [
    AST_TYPE.AssignmentPattern,
    [
      {
        type: METHOD_TYPE.getIdentifierAst,
        configName: 'left',
      },
      {
        ifType: TOKEN_TYPE.Equal,
        consequent: [{
          type: METHOD_TYPE.getSpreadElement,
          configName: 'right',
        }],
        alternate: [
          {
            hookType(config) {
              return config.left;
            }
          }
        ]
      },
    ]
  ],
  [METHOD_TYPE.getThisExpressionAst]: [
    AST_TYPE.ThisExpression,
    [
      {
        expectType: TOKEN_TYPE.this
      }
    ]
  ],
  [METHOD_TYPE.getPrimaryAst]: switchConfig({
    [METHOD_TYPE.getLiteralAst]: [
      TOKEN_TYPE.true,
      TOKEN_TYPE.false,
      TOKEN_TYPE.String,
      TOKEN_TYPE.null,
      TOKEN_TYPE.Number,
    ],
    [METHOD_TYPE.getObjectExpressionAst]: TOKEN_TYPE.LeftBrace,
    [METHOD_TYPE.getArrayExpressionAst]: TOKEN_TYPE.LeftBracket,
    [METHOD_TYPE.getArrowFunctionExpressionAst]: TOKEN_TYPE.LeftParenthesis,
    [METHOD_TYPE.getFunctionExpressionOrWithArrowAst]: [TOKEN_TYPE.async, TOKEN_TYPE.function],
    [METHOD_TYPE.getIdentifierAst]: [
      TOKEN_TYPE.Word, 
      TOKEN_TYPE.NaN,
      TOKEN_TYPE.arguments,
       TOKEN_TYPE.undefined
    ],
    [METHOD_TYPE.getThisExpressionAst]: TOKEN_TYPE.this,
  }, 'getPrimaryAst未处理的语法', {
  }
  ),
  [METHOD_TYPE.getPatternAst]: switchConfig({
    [METHOD_TYPE.getArrayPatternAst]: TOKEN_TYPE.LeftBracket,
    [METHOD_TYPE.getObjectPatternAst]: TOKEN_TYPE.LeftBrace,
    [METHOD_TYPE.getRestElementAst]: TOKEN_TYPE.Spread,
    [METHOD_TYPE.getAssignmentPatternOrIdentityAst]: TOKEN_TYPE.Word,
  }, '未允许的复制表达式左边'),
  [METHOD_TYPE.getObjectPatternPropertyAst]: [
    AST_TYPE.Property,
    [
      {
        ifType: TOKEN_TYPE.LeftBracket,
        ifTrueInjectConfig: {
          computed: true,
          method: false,
          shorthand: false,
          kind: commonLiteral.init,
        },
        consequent: [
          {
            type: METHOD_TYPE.getSpreadElement,
            configName: 'key',
          },
          {
            expectType: TOKEN_TYPE.RightBracket,
          },
          {
            expectType: TOKEN_TYPE.Colon,
          },
          {
            type: METHOD_TYPE.getPatternAst,
            configName: 'value'
          }
        ]
      },
      {
        ifType: TOKEN_TYPE.Word,
        noEat: true,
        ifTrueInjectConfig: {
          computed: false,
          method: false,
          kind: commonLiteral.init,
        },
        consequent: [
          {
            type: METHOD_TYPE.getIdentifierAst,
            configName: 'key',
          },
          {
            ifType: TOKEN_TYPE.Equal,
            ifTrueInjectConfig: {
              shorthand: false,
            },
            consequent: [
              {
                type: METHOD_TYPE.getSpreadElement,
                configName: 'value',
                after(config) {
                  config.shorthand = true;
                  config.value = this.createAstItem({
                    type: AST_TYPE.AssignmentPattern,
                    left: config.key,
                    right: config.value,
                    restTokens: config.restTokens,
                  })
                }
              }
            ],
            alternate: [
              {
                ifType: TOKEN_TYPE.Colon,
                ifTrueInjectConfig: {
                  shorthand: false,
                },
                consequent: [
                  {
                    type: METHOD_TYPE.getPatternAst,
                    configName: 'value',
                    after(config) {
                      if (config.value.is(AST_TYPE.RestElement)) {
                        throwError('不能是restElemnt', config.value.tokens[0],)
                      }
                    }
                  }
                ],
                alternate: [
                  {
                    hookType(config) {
                      config.shorthand = true;
                      config.value = this.copyAstItem(config.key)
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      switchDefault('未处理的复制表达式语法'),
    ]
  ],
  [METHOD_TYPE.getObjectPatternPropertyOrRestElementAst]: [
    canBeAnyType,
    [
      {
        ifType: TOKEN_TYPE.Spread,
        noEat: true,
        consequent: [getDirectlyReturnConfig(METHOD_TYPE.getRestElementAst)],
        alternate: [getDirectlyReturnConfig(METHOD_TYPE.getObjectPatternPropertyAst)]
      }
    ]
  ],
  [METHOD_TYPE.getObjectPatternAst]: [
    {
      type: AST_TYPE.ObjectPattern,
      [AstFlagDicts.canRestable]: true,
      [AstFlagDicts.canUseAssignmentPattern]: true,
      after: completeAttribute('properties', [])
    },
    [
      {
        expectType: TOKEN_TYPE.LeftBrace
      },
      {
        ifType: TOKEN_TYPE.RightBrace,
        alternate: [
          {
            type: METHOD_TYPE.getObjectPatternPropertyOrRestElementAst,
            groupName: 'properties',
            after(config) {
              if (_.last(config.properties).is(AST_TYPE.RestElement)) {
                return {
                  jump: 4,
                }
              }
            }
          },
          {
            ifType: TOKEN_TYPE.Comma,
            jump: 2
          },
          {
            expectType: TOKEN_TYPE.RightBrace,
          }
        ]
      }
    ]
  ],
  [METHOD_TYPE.getVariableDeclaratorAst]: [
    {
      type: AST_TYPE.VariableDeclarator,
      after: completeAttribute('init', null)
    },
    [
      {
        type: METHOD_TYPE.getPatternAst,
        configName: 'id'
      },
      {
        ifType: TOKEN_TYPE.Equal,
        consequent: [
          ({
            type: METHOD_TYPE.getSpreadElement,
            configName: 'init',
          })
        ]
      }
    ]
  ],
  [METHOD_TYPE.getVariableDeclarationStatementAst]: [
    AST_TYPE.VariableDeclaration,
    [
      {
        expectType: [TOKEN_TYPE.let, TOKEN_TYPE.var, TOKEN_TYPE.const],
        configName: 'kind',
      },
      {
        type: METHOD_TYPE.getVariableDeclaratorAst,
        groupName: 'declarations'
      },
      {
        ifType: TOKEN_TYPE.Comma,
        jump: 1,
      },
      {
        ifType: TOKEN_TYPE.Semicolon,
      }
    ]
  ],
  [METHOD_TYPE.getIfStatementAst]: [
    {
      type: AST_TYPE.IfStatement,
      after: completeAttribute('alternate', null)
    },
    [
      {
        expectType: TOKEN_TYPE.if,
      },
      {
        expectType: TOKEN_TYPE.LeftParenthesis
      },
      {
        type: METHOD_TYPE.getExpAst,
        configName: 'test'
      },
      {
        expectType: TOKEN_TYPE.RightParenthesis
      },
      {
        dynamicType(token) {
          return token.is(TOKEN_TYPE.LeftBrace) ? METHOD_TYPE.getBlockStatementAst : METHOD_TYPE.getStatementOrExpressionAst;
        },
        configName: 'consequent'
      },
      {
        ifType: TOKEN_TYPE.else,
        consequent: [
          {
            type: METHOD_TYPE.getStatementOrExpressionAst,
            configName: 'alternate'
          },
        ]
      },
    ]
  ],
  [METHOD_TYPE.getConditionalExpression]: [
    {
      type: AST_TYPE.ConditionalExpression,
      after: ifWholeElsePickAttr('hadCondition', 'test'),
    },
    [
      {
        type: METHOD_TYPE.getOrExpression,
        configName: 'test',
      },
      {
        ifType: TOKEN_TYPE.Question,
        flagName: 'hadCondition',
        consequent: [
          {
            type: METHOD_TYPE.getExpAst,
            configName: 'consequent',
          },
          {
            expectType: TOKEN_TYPE.Colon,
          },
          {
            type: METHOD_TYPE.getExpAst,
            configName: 'alternate'
          }
        ]
      },
    ]
  ],
  [METHOD_TYPE.getYieldExpression]: [
    (AST_TYPE.YieldExpression),
    [
      {
        ifType: TOKEN_TYPE.yield,
        consequent: [
          {
            ifType: TOKEN_TYPE.Star,
            before(config) {
              if (!this.proxyMethod(prefixDicts.is, AstFlagDicts.canYieldable)) {
                throwError('当前不在generator函数结构体内不允许使用', config.restTokens[0]);
              }
            },
            configName: 'delegate',
          },
          {
            type: METHOD_TYPE.getAssignmentExpression,
            configName: 'argument',
            mayBe: true,
          },
        ],
        alternate: [getDirectlyReturnConfig(METHOD_TYPE.getAssignmentExpression)]
      },
    ]
  ],
  [METHOD_TYPE.getSpreadElement]: [
    {
      type: AST_TYPE.SpreadElement,
    },
    [
      {
        ifType: TOKEN_TYPE.Spread,
        consequent: [
          {
            type: METHOD_TYPE.getYieldExpression,
            before(config) {
              if (!this.proxyMethod(prefixDicts.is, AstFlagDicts.canSpreadable)) {
                throwError('未允许使用', config.restTokens[0])
              }
            },
            configName: 'argument',
          }
        ],
        alternate: [(getDirectlyReturnConfig(METHOD_TYPE.getYieldExpression))]
      },

    ]
  ],
  [METHOD_TYPE.getSequenceExpression]: [
    ({
      type: AST_TYPE.SequenceExpression,
      after(config) {
        return _.size(config.expressions) > 1 ? config : config.expressions[0]
      }
    }),
    [
      {
        type: METHOD_TYPE.getSpreadElement,
        groupName: 'expressions',
      },
      {
        ifType: TOKEN_TYPE.Comma,
        jump: 0,
      }
    ]
  ],
  [METHOD_TYPE.getWhileStatementAst]: [
    AST_TYPE.WhileStatement,
    [
      {
        expectType: TOKEN_TYPE.while,
      },
      {
        expectType: TOKEN_TYPE.LeftParenthesis,
      },
      {
        type: METHOD_TYPE.getExpAst,
        configName: 'test'
      },
      {
        expectType: TOKEN_TYPE.RightParenthesis,
      },
      {
        type: METHOD_TYPE.getBlockStatementAst,
        configName: 'body'
      }
    ]
  ],
  [METHOD_TYPE.getReturnStatementAst]: [
    {
      type: AST_TYPE.ReturnStatement,
      after: completeAttribute('argument', null)
    },
    [
      {
        expectType: TOKEN_TYPE.return,
      },
      {
        type: METHOD_TYPE.getExpAst,
        configName: 'argument',
        mayBe: true,
      },
      {
        ifType: TOKEN_TYPE.Semicolon
      }
    ]
  ],
  [METHOD_TYPE.getSleepStatement]: [
    AST_TYPE.SleepStatement,
    [
      {
        expectType: TOKEN_TYPE.sleep
      },
      {
        type: METHOD_TYPE.getLiteralAst,
        configName: 'argument'
      },
      {
        ifType: TOKEN_TYPE.Semicolon
      }
    ]
  ],
  [METHOD_TYPE.getExpAst]: [canBeAnyType, [(getDirectlyReturnConfig(METHOD_TYPE.getSequenceExpression))]],
  [METHOD_TYPE.getExpressionStatementAst]: [
    {
      type: AST_TYPE.ExpressionStatement,
      after(oldConfig) {
        const config = { ...oldConfig };
        const { expression } = config;
        if (expression.is(AST_TYPE.Literal) && _.startsWith(expression.value, 'use ')) {
          config.directive = expression.value;
        }
        return config;
      }
    },
    [
      {
        type: METHOD_TYPE.getExpAst,
        configName: 'expression',
      },
      {
        ifType: TOKEN_TYPE.Semicolon,
      }
    ]
  ]
}