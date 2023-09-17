import parseAst from "..";
import Environment from "../Environment";
import RuntimeValue, { RuntimeRefValue } from "../Environment/RuntimeValue";
import { DEBUGGER_DICTS, ENV_DICTS, PROPERTY_DESCRIPTOR_DICTS, RUNTIME_LITERAL, RUNTIME_VALUE_DICTS, RUNTIME_VALUE_TYPE } from "../constant";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import generateCode, { getAstCode } from "../Generate";
import setPattern from "./setPattern";
import { createLiteralAst, createRuntimeValueAst, createSimplePropertyDescriptor, createStringLiteralAst, getPropertyDesctiptorConfigAst, getReflectDefinePropertyAst } from "../Environment/utils";
import PropertyDescriptor from "../Environment/PropertyDescriptor";
import { getWrapAst, transformInnerAst } from "../Environment/WrapAst";
import { isInstanceOf } from "../../commonApi";
import { getObjectAttrOfPropertyDescriptor } from "./parseObjectExpression";
import { createObject, createObjectExtends, getFalseV, getFunctionClassRv, getFunctionPrototypeRv, getUndefinedValue } from "../Environment/RuntimeValueInstance";
import { _classConstructorSuperAst } from "../Environment/Native/ClassSuper";
import createEnviroment from "../Environment/createEnviroment";

function IdentifierToLiteral(ast) {
  if (ast.type !== 'Identifier') {
    throw new Error('super 转换失败', ast);
  }
  return createStringLiteralAst(ast.name)
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
  const isSetOrGet = isSetterOrGetter(kind)
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
  // console.error(c.type, computed ? createStringLiteralAst(key) : IdentifierToLiteral(key));
  const properties = [
    {
      type: "Property",
      method: false,
      shorthand: false,
      computed: false,
      key: {
        type: "Identifier",
        name: isSetOrGet ? kind : 'value',
      },
      value: createRuntimeValueAst(valueRv),
      kind: "init"
    },
    getPropertyDesctiptorConfigAst(PROPERTY_DESCRIPTOR_DICTS.configurable, true),
    getPropertyDesctiptorConfigAst(PROPERTY_DESCRIPTOR_DICTS.enumerable, (c.type === 'PropertyDefinition')),
  ]
  if (!isSetOrGet) {
    properties.push(getPropertyDesctiptorConfigAst(PROPERTY_DESCRIPTOR_DICTS.writable, true))
  }
  // console.warn(key.name, isSetOrGet, targetRv === classRv)
  // console.log(key);
  parseAst(getReflectDefinePropertyAst([
    createRuntimeValueAst(targetRv),
    computed ? createStringLiteralAst(key) : IdentifierToLiteral(key),
    {
      type: "ObjectExpression",
      properties,
    }
  ]), Environment.window) // 任意env;

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

const getCreateClassProperty = (weakMap, classRv) => function createClassProperty(ast, i) {
  // 特殊处理 get set
  // console.error(ast)

  const rightAst = transformSuper(ast.value, classRv, true, false) ?? {
    type: 'Identifier',
    name: `${RUNTIME_LITERAL.undefined}`,
  };
  const isSetOrGet = ast.type === 'MethodDefinition' && isSetterOrGetter(ast.kind);
  // if () {
    // 转成 Reflect.defineProperty(this, attr, v, {})
    // TODO 等后续生成ast重构后
    // 直接 eval（‘Reflect.defineProperty(this, attr, {[ast.kind]: value})’）
    // console.warn(ast.kind);
    const ret = getReflectDefinePropertyAst([
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
              name: isSetOrGet ? ast.kind : 'value',
            },
            value: rightAst,
            kind: "init"
          },
          getPropertyDesctiptorConfigAst(PROPERTY_DESCRIPTOR_DICTS.configurable, true),
          getPropertyDesctiptorConfigAst(PROPERTY_DESCRIPTOR_DICTS.enumerable, !isSetOrGet),
          ...isSetOrGet ? []: [getPropertyDesctiptorConfigAst(PROPERTY_DESCRIPTOR_DICTS.writable, true)]
        ]
      }
    ]) 
    return ret;
}

export function isSetterOrGetter(kind) {
  return [RUNTIME_LITERAL.set, RUNTIME_LITERAL.get].includes(kind);
}

export function createMergeCtorRv(idText,  prototypeRv, classDefinedEnv, bodyAstList, weakMap, originConstructorRef) {
  const ast = {
    type: 'FunctionExpression',
    expression: false,
    generator: false,
    async: false,
    _fnName: `${idText}`,
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
      ]
    }
  };
  const rv = parseAst(ast, classDefinedEnv);
  ast.body.body.push(
    {
      type: "IfStatement",
      test:{
        type: "UnaryExpression",
        operator: "!",
        prefix: true,
        argument: {
          type: "BinaryExpression",
          left: {
            type: "ThisExpression",
          },
          operator: "instanceof",
          right: createRuntimeValueAst(rv, idText)
        }
        },
      consequent: {
        type: "BlockStatement",
        body: [
          {
            type: "ThrowStatement",
            argument: {
              type: "NewExpression",
              callee: {
                type: "Identifier",
                name: "Error"
              },
              arguments: [
                createLiteralAst("类必须通过new调用")
              ]
            }
          }
        ]
      },
      alternate: null
    }
    ,..._.map(_.filter(bodyAstList, c => !c.static &&
    (c.type === 'PropertyDefinition'
      // || (c.type === 'MethodDefinition' && isSetterOrGetter(c.kind))
    )
  ), getCreateClassProperty(weakMap, rv)),
    {
      type: "ExpressionStatement",
      expression: {
        type: "ChainExpression",
        expression: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: createRuntimeValueAst(
              () => originConstructorRef.current,
              `${idText}$prototype$_constructor`
            ),
            property: {
              type: "Identifier",
              name: "apply"
            },
            computed: false,
            optional: true
          },
          arguments: [
            {
              type: 'ThisExpression'
            },
            {
              type: "Identifier",
              name: 'arguments',
            }
          ],
          optional: true
        }
      }
  })
  return rv;
}

export default function parseClassDeclaration(ast, env) {
  const { id, body: bodyAst, superClass } = ast;
  const idText = id ? getAstCode(id, { text: true }) : '匿名类';
  const classDefinedEnv = createEnviroment('class_' + (idText) + '_defined_env',
    env,  {
      [ENV_DICTS.isUseStrict]: true,
      [ENV_DICTS.$hideInHTML]: env.getHideInHtml()
    })
  const classPrototypeDefinedEnv = createEnviroment('class_' + (idText) + '_of_prototype_defined_env',
    env, {
      [ENV_DICTS.isUseStrict]: true,
      [ENV_DICTS.$hideInHTML]: env.getHideInHtml()
    })
  // console.log('class 声明 的时候创建的环境', classDefinedEnv.getEnvPath());
  const weakMap = new WeakMap();

  const bodyAstList = [...bodyAst.body];

  const constructorAst = _.find(bodyAstList, c => !c.static && c.kind === 'constructor');

  if (superClass && !constructorAst) {
    bodyAstList.push(_classConstructorSuperAst)
  }

  _.forEach(_.filter(bodyAstList, c => c.computed), c => {
    weakMap.set(c, parseAst(c.key, env));
  });
  const superClassRv = superClass ? parseAst(superClass, env) : null;
  const prototypeRv = superClass ? createObjectExtends(superClassRv) : createObject({});
 

  const originConstructorRef = { current: null }
  const classRv = createMergeCtorRv(
    idText,
    // classRv,
    prototypeRv,
    classDefinedEnv,
    bodyAstList, 
    weakMap,
    originConstructorRef,
    );

  classRv.setProto(superClassRv ?? getFunctionPrototypeRv())
  classRv.setProtoType(prototypeRv);

  classRv.setType(RUNTIME_VALUE_TYPE.class)

  classRv.setOriginClassAst({...ast})
  // newMergeRv.set
  classRv.setMergeCtor(classRv)
  // classRv.setCurrent(newMergeRv);
  
  // prototypeRv.set('constructor', classRv) 

  if (id) {
    setPattern(classRv, id, env, { kind: 'class' })
  }
  classDefinedEnv.addConst(RUNTIME_LITERAL.this, classRv);
  if (superClass) {
    // todo
    classDefinedEnv.addConst(RUNTIME_LITERAL.super, new RuntimeRefValue(RUNTIME_VALUE_TYPE.super, {
    }, {
      [RUNTIME_VALUE_DICTS.proto]: superClassRv,
    }))
    classPrototypeDefinedEnv.addConst(RUNTIME_LITERAL.super, new RuntimeRefValue(RUNTIME_VALUE_TYPE.super, {
    }, {
      [RUNTIME_VALUE_DICTS.proto]: superClassRv.getProtoType(),
      [RUNTIME_VALUE_DICTS.symbolMergeNewCtor]: superClassRv.getMergeCtor(),
    }))
  } else {
    classDefinedEnv.addConst(RUNTIME_LITERAL.super, new RuntimeRefValue(RUNTIME_VALUE_TYPE.super, {
    }, {
      [RUNTIME_VALUE_DICTS.proto]:  getFunctionClassRv(),
    }))
  }

 
  if (constructorAst && superClass && 
    (_.get(constructorAst, 'value.body.body.0.expression.type') !== 'CallExpression'
  || _.get(constructorAst, 'value.body.body.0.expression.callee.type') !== 'Super')) {
    console.error(constructorAst);
    throw new Error('拥有父类的类构造函数第一语句必须调用super')
  }

  // if (superClass && !constructorAst) {

  // }

  // 只要是方法
  _.forEach(
    _.filter(bodyAstList, c => !c.static && c.type === 'MethodDefinition'),
    handleProperty(prototypeRv, weakMap, classPrototypeDefinedEnv, classRv)
  )


  _.forEach(_.filter(bodyAstList, c => c.static && c.type === 'MethodDefinition' && !isSetterOrGetter(c.kind)),
    handleProperty(classRv, weakMap, classDefinedEnv, classRv)
  )

  // static block 或者 static 方法且非setter， getter
  _.forEach(_.filter(bodyAstList, c =>
    (c.static && ((c.type === 'MethodDefinition' && isSetterOrGetter(c.kind))))
  ),
    handleProperty(classRv, weakMap, classDefinedEnv, classRv)
  )
  _.forEach(_.filter(bodyAstList, c =>
    (c.static && (c.type === 'PropertyDefinition'))
    || ['StaticBlock'].includes(c.type)
  ),
    handleProperty(classRv, weakMap, classDefinedEnv, classRv)
  )
  originConstructorRef.current = prototypeRv.getOwnPropertyDescriptor(RUNTIME_LITERAL.constructor) ?
   prototypeRv.get(RUNTIME_LITERAL.constructor) : getUndefinedValue();
  prototypeRv.set(RUNTIME_LITERAL.constructor, classRv, createSimplePropertyDescriptor({
    value: classRv,
    [PROPERTY_DESCRIPTOR_DICTS.enumerable]: getFalseV()
  }))

  // console.error(classRv);

  // console.error(classRv);
  // console.log('类定义的---', prototypeRv);
}