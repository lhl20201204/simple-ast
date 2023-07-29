import parseAst from "..";
import Environment, { FunctionClassV, FunctionPrototypeV, createObjectExtends, getFunctionPrototype } from "../Environment";
import RuntimeValue, { RuntimeRefValue, getFalseV, getUndefinedValue } from "../Environment/RuntimeValue";
import { DEBUGGER_DICTS, ENV_DICTS, RUNTIME_LITERAL, RUNTIME_VALUE_TYPE } from "../constant";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import generateCode, { getAstCode } from "../Generate";
import setPattern from "./setPattern";
import { createObject } from "../Environment";
import { createRuntimeValueAst } from "../Environment/utils";
import PropertyDescriptor from "../Environment/PropertyDescriptor";
import { getWrapAst, transformInnerAst } from "../Environment/WrapAst";
import { isInstanceOf } from "../../commonApi";
import { getObjectPropertyDescriptor } from "./parseObjectExpression";

function IdentifierToLiteral(ast) {
  if (ast.type !== 'Identifier') {
    throw new Error('super 转换失败', ast);
  }
  return {
    type: "Literal",
    // TODO 非计算属性一般只能是Identity类型
    value: `${ast.name}`,
    raw: `'${ast.name}'`,
  }
}

export const handleProperty = (targetRv, weakMap, classDefinedEnv, classRv) => (c) => {
  if (c.type === 'StaticBlock') {
    return parseAst(transformSuper({
      type: 'BlockStatement',
      body: c.body,
    }, classRv, false, true), classDefinedEnv)
  }
  // 离开一小会，接下来做set， get属性
  let { key, computed, value, kind, static: isStatic, type } = c;

  if (computed) {
    key = parseRuntimeValue(weakMap.get(c))
  }

  if (value.type === 'FunctionExpression') {
    const oldValueId = value.id;
    value = { 
      ...value, 
      id: oldValueId ?? { 
        type: 'Identifier', 
        name: (kind === 'constructor' ? classRv.getDefinedName() : 
        // TODO 
          computed ? key : key.name
        ) 
      }
    }
    // console.error(key, value.id)
  }

  const newValueAst = transformSuper(value, classRv, !isStatic, type === 'PropertyDefinition');

  


  const valueRv = value ? parseAst(newValueAst, classDefinedEnv) : getUndefinedValue();
  if (computed) {
    // todo key 为 object 之类的问题。
    // const oldDescriptor = targetRv.getPropertyDescriptor(key) ?? new PropertyDescriptor({
    //   value: valueRv,
    // });
    // if ([RUNTIME_LITERAL.set, RUNTIME_LITERAL.get].includes(kind)) {
    //   oldDescriptor.set(kind, valueRv);
    // }
    targetRv.set(key, valueRv, getObjectPropertyDescriptor(targetRv,key, valueRv, kind ))
  } else {
    // console.error('class-set', key, kind, valueRv)
    // console.log(key, newValueAst, generateCode(newValueAst, { [DEBUGGER_DICTS.isTextMode]: true }), kind)
    setPattern(valueRv, key, targetRv, { useSet: true, kind })
  }
}

export function getSuperToReflectGet(t, targetRv, needPrototype, isTranformToClassSelf, config, value) {
  const computed = t.get('computed');
  const originKey = t.get(['property']).toAST()
  // return 
  const ret = getWrapAst({
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      object: {
        type: "Identifier",
        name: "Reflect"
      },
      property: {
        type: "Identifier",
        name: value ? 'set' : 'get',
      },
      computed: false,
      optional: false
    },
    arguments: [
      {
        type: "MemberExpression",
        object: createRuntimeValueAst(needPrototype ?
          targetRv.getProtoType()
          : targetRv,
          targetRv.getDefinedName() + (needPrototype ? '$prototype' : '')
        ),
        property: {
          type: "Identifier",
          name: RUNTIME_LITERAL.$__proto__
        },
        computed: false,
        optional: false
      },
      computed ? originKey : IdentifierToLiteral(originKey),
      ...value ? [value] : [],
      isTranformToClassSelf ? createRuntimeValueAst(targetRv, targetRv.getDefinedName()) : {
        type: "ThisExpression",
      }
    ],
    optional: false
  }, config)

  // console.error(t, originKey, computed, generateCode(ret.toAST(), {
  //   [DEBUGGER_DICTS.isTextMode]: true,
  // }));
  return ret;
}

export function transformSuper(ast, targetRv, needPrototype, isTranformToClassSelf) {
  if (!ast) {
    return ast;
  }
  if (!isInstanceOf(targetRv, RuntimeValue)) {
    throw new Error('转换transformSuper失败');
  }

  const retAst = transformInnerAst(ast, {
    traverse(t, config) {
      // if (t.get(['callee', 'type']) === 'Super') {
      //   return RuntimeRefValue.getWrapAst({
      //     type: "ExpressionStatement",
      //      expression: {
      //       type: "CallExpression",
      //        callee: {
      //         type: "Identifier",
      //         name: "_super"
      //       },
      //       arguments: t.arguments,
      //       optional: false
      //     }
      //   }, config)
      // }

      if (t.get('type') === 'CallExpression'
        && t.get(['callee', 'type']) === 'MemberExpression'
        && t.get(['callee', 'object', 'type']) === 'Super'
      ) {
        const args = t.get('arguments');
        const optional = t.get('optional');
        const object = getSuperToReflectGet(t.get(['callee']), targetRv, needPrototype, isTranformToClassSelf, config);
        const ret = getWrapAst({
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object,
            property: {
              type: 'Identifier',
              name: 'call',
            },
            computed: false,
            optional,
          },
          arguments: [
            isTranformToClassSelf ? createRuntimeValueAst(targetRv, targetRv.getDefinedName()) : {
              type: "ThisExpression",
            },
            ..._.map(args, y => y.toAST())
          ],
          optional,
        }, config);
        // console.error('enter')

        return ret;
      } else if (t.get('type') === 'AssignmentExpression'
        && t.get(['left', 'type']) === 'MemberExpression'
        && t.get(['left', 'object', 'type']) === 'Super'
      ) {
        return getSuperToReflectGet(t.get('left'), targetRv, needPrototype, isTranformToClassSelf, config, t.get(['right']).toAST());
      } else if (!['CallExpression', 'AssignmentExpression'].includes(t.get(['parent', 'type']))
        && t.get('type') === 'MemberExpression' && t.get(['object', 'type']) === 'Super') {
        return getSuperToReflectGet(t, targetRv, needPrototype, isTranformToClassSelf, config);
      }

      return t;
    }
  });

  //  console.groupCollapsed('预编译内置ast')
  //  console.log(generateCode(retAst, { [DEBUGGER_DICTS.isTextMode]: true }));
  //  console.groupEnd()
  return retAst;
}

const createClassProperty = (weakMap, classRv) => function createClassProperty(ast, i) {
  // 特殊处理 get set
  // console.error(ast)
  const propertyAst = ast.computed ? createRuntimeValueAst(weakMap.get(ast), {
    type: 'Identifier',
    name: '_ref' + i,
  }, ast.key) : ast.key;

  const rightAst = transformSuper(ast.value, classRv, true, false) ?? {
    type: 'Identifier',
    name: `${RUNTIME_LITERAL.undefined}`,
  };
  if (ast.type === 'MethodDefinition' && isSetterOrGetter(ast.kind)) {
    // 转成 Reflect.defineProperty(this, attr, v, {})
    // TODO 等后续生成ast重构后
    // 直接 eval（‘Reflect.defineProperty(this, attr, {[ast.kind]: value})’）

    const ret = {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: {
            type: "Identifier",
            name: "Reflect"
          },
          property: {
            type: "Identifier",
            name: "defineProperty"
          },
          computed: false,
          optional: false
        },
        arguments: [
          {
            type: "ThisExpression",
          },
          ast.computed ? createRuntimeValueAst(weakMap.get(ast), {
            type: 'Identifier',
            name: '_ref' + i,
          }, ast.key) : IdentifierToLiteral(ast.key),
          {
            type: "ObjectExpression",
            properties: [
              {
                type: "Property",
                method: false,
                shorthand: false,
                computed: false,
                key: {
                  type: "Identifier",
                  name: ast.kind,
                },
                value: rightAst,
                kind: "init"
              }
            ]
          }
        ],
        optional: false
      }
    }
    // console.error('转', ret)
    return ret;
  }

  return {
    type: 'ExpressionStatement',
    expression: {
      type: "AssignmentExpression",
      operator: "=",
      left: {
        type: 'MemberExpression',
        object: {
          type: 'ThisExpression',
        },
        property: propertyAst,
        computed: ast.computed,
        optional: false,
      },
      right: rightAst,
    }
  }
}

export function isSetterOrGetter(kind) {
  return [RUNTIME_LITERAL.set, RUNTIME_LITERAL.get].includes(kind);
}

export function createMergeCtorRv(idText, prototypeRv, classDefinedEnv, bodyAstArr) {
  return parseAst({
    type: 'FunctionExpression',
    expression: false,
    generator: false,
    async: false,
    _fnName: `${idText}$prototype$constructor`,
    params: [
      {
        type: "RestElement",
        argument: {
          type: "Identifier",
          name: "args"
        }
      }
    ],
    body: {
      type: 'BlockStatement',
      body: [
        ...bodyAstArr || [],
        {
          type: "ExpressionStatement",
          expression: {
            type: "ChainExpression",
            expression: {
              type: "CallExpression",
              callee: {
                type: "MemberExpression",
                object: {
                  type: "MemberExpression",
                  object: createRuntimeValueAst(
                    prototypeRv,
                    `${idText}$prototype`
                  ),
                  property: {
                    type: "Identifier",
                    name: "constructor"
                  },
                  computed: false,
                  optional: false
                },
                property: {
                  type: "Identifier",
                  name: "call"
                },
                computed: false,
                optional: true
              },
              arguments: [
                {
                  type: 'ThisExpression'
                },
                {
                  type: "SpreadElement",
                  argument: {
                    type: "Identifier",
                    name: "args"
                  }
                }
              ],
              optional: true
            }
          }
        }
      ]
    }
  }, classDefinedEnv)
}

export default function parseClassDeclaration(ast, env) {
  const { id, body: bodyAst, superClass } = ast;
  const idText = id ? getAstCode(id, { text: true }) : '匿名类';
  const classDefinedEnv = new Environment('class_' + (idText) + '_defined_env',
    env,  {
      [ENV_DICTS.isUseStrict]: true,
    })
  const classPrototypeDefinedEnv = new Environment('class_' + (idText) + '_of_prototype_defined_env',
    env, {
      [ENV_DICTS.isUseStrict]: true,
    })
  // console.log('class 声明 的时候创建的环境', classDefinedEnv.getEnvPath());
  const weakMap = new WeakMap();
  _.forEach(_.filter(bodyAst.body, c => c.computed), c => {
    weakMap.set(c, parseAst(c.key, env));
  });
  const superClassRv = superClass ? parseAst(superClass, env) : null;
  const prototypeRv = superClass ? createObjectExtends(superClassRv) : createObject({});
  const classRv = new RuntimeRefValue(RUNTIME_VALUE_TYPE.class, {
    [RuntimeValue.symbolAst]: ast,
    [RuntimeValue.symbolEnv]: env,
    [RuntimeValue.symbolName]: idText,
    [RuntimeValue.symbolComputedMap]: weakMap,
  }, {
    [RuntimeValue.proto]: superClassRv ?? getFunctionPrototype(),
    [RuntimeValue._prototype]: prototypeRv,
  });

  classRv.setMergeCtor(createMergeCtorRv(
    idText,
    prototypeRv,
    classDefinedEnv,
    _.map(_.filter(bodyAst.body, c => !c.static &&
      (c.type === 'PropertyDefinition'
        || (c.type === 'MethodDefinition' && isSetterOrGetter(c.kind))
      )
    ), createClassProperty(weakMap, classRv))))

  if (id) {
    setPattern(classRv, id, env, { kind: 'class' })
  }
  classDefinedEnv.addConst(RUNTIME_LITERAL.this, classRv);
  if (superClass) {
    // todo
    classDefinedEnv.addConst(RUNTIME_LITERAL.super, new RuntimeRefValue(RUNTIME_VALUE_TYPE.super, {
    }, {
      [RuntimeValue.proto]: superClassRv,
      [RuntimeValue.superproto]: superClassRv,
    }))
    classPrototypeDefinedEnv.addConst(RUNTIME_LITERAL.super, new RuntimeRefValue(RUNTIME_VALUE_TYPE.super, {
      [RuntimeValue.symbolMergeNewCtor]: superClassRv.getMergeCtor(),
    }, {
      [RuntimeValue.proto]: superClassRv.getProtoType(),
      [RuntimeValue.superproto]: prototypeRv,
    }))
  } else {
    classDefinedEnv.addConst(RUNTIME_LITERAL.super, new RuntimeRefValue(RUNTIME_VALUE_TYPE.super, {
    }, {
      [RuntimeValue.proto]: FunctionClassV,
      [RuntimeValue.superproto]: FunctionPrototypeV,
    }))
  }
  // 如果是非static
  // run () 且非 setter，getter
  _.forEach(
    _.filter(bodyAst.body, c => !c.static && c.type === 'MethodDefinition' && !isSetterOrGetter(c.kind)),
    handleProperty(prototypeRv, weakMap, classPrototypeDefinedEnv, classRv)
  )


  _.forEach(_.filter(bodyAst.body, c => c.static && c.type === 'MethodDefinition' && !isSetterOrGetter(c.kind)),
    handleProperty(classRv, weakMap, classDefinedEnv, classRv)
  )

  // static block 或者 static 方法且非setter， getter
  _.forEach(_.filter(bodyAst.body, c =>
    (c.static && ((c.type === 'MethodDefinition' && isSetterOrGetter(c.kind))))
  ),
    handleProperty(classRv, weakMap, classDefinedEnv, classRv)
  )
  _.forEach(_.filter(bodyAst.body, c =>
    (c.static && (c.type === 'PropertyDefinition'))
    || ['StaticBlock'].includes(c.type)
  ),
    handleProperty(classRv, weakMap, classDefinedEnv, classRv)
  )

  // console.error(classRv);
  // console.log('类定义的---', prototypeRv);
}