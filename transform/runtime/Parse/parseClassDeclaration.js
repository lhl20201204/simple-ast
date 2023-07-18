import parseAst from "..";
import Environment, { FunctionClassV, FunctionPrototypeV, createObjectExtends, getFunctionPrototype } from "../Environment";
import RuntimeValue, { RuntimeRefValue, getUndefinedValue} from "../Environment/RuntimeValue";
import { RUNTIME_LITERAL, RUNTIME_VALUE_TYPE } from "../constant";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { getAstCode } from "../Generate";
import setPattern from "./setPattern";
import { createObject } from "../Environment";
import { createRuntimeValueAst } from "../Environment/utils";

export const handleProperty = (targetRv, weakMap, classDefinedEnv) => (c) => {
  if (c.type === 'StaticBlock') {
    return parseAst({
      type: 'BlockStatement',
      body: c.body
    }, classDefinedEnv)
  }
  const { key, computed, value } = c;

  const valueRv = value ?  parseAst(value, classDefinedEnv) : getUndefinedValue();
  if (computed) {
    // todo key 为 object 之类的问题。
    targetRv.set(parseRuntimeValue(weakMap.get(c)), valueRv)
  } else {
    setPattern(valueRv, key, targetRv, { useSet: true })
  }
}

function transformSuper(ast) {
  // console.log(ast);
  return ast;
}

const createClassProperty = (weakMap) => function createClassProperty(ast, i) {
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
        property: ast.computed ? createRuntimeValueAst( weakMap.get(ast), {
          type: 'Identifier',
          name: '_ref' + i,
        }, ast.key) : ast.key,
        computed: ast.computed,
        optional: false,
      },
      right: transformSuper(ast.value) ?? {
        type: 'Identifier',
        name: `${RUNTIME_LITERAL.undefined}`,
      },
    }
  }
}


export default function parseClassDeclaration(ast, env) {
  const { id, body: bodyAst, superClass } = ast;
  const idText = id ? getAstCode(id, { text: true }) : '匿名类';
  const classDefinedEnv = new Environment('class_' + (idText)+'_defined_env',
  env)
  const classPrototypeDefinedEnv = new Environment('class_' + (idText)+'_of_prototype_defined_env',
  env)
  // console.log('class 声明 的时候创建的环境', classDefinedEnv.getEnvPath());
  const weakMap = new WeakMap();
  _.forEach(_.filter(bodyAst.body, c => c.computed), c => {
    weakMap.set(c, parseAst(c.key, env));
  });
  const superClassRv = superClass ? parseAst(superClass, env) : null;
  const prototypeRv = superClass ? createObjectExtends(superClassRv) : createObject({});
  const newCtorRv = parseAst({
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
        // {
        //   "type": "ExpressionStatement",
        //   "start": 19,
        //   "end": 38,
        //   "expression": {
        //     "type": "CallExpression",
        //     "start": 19,
        //     "end": 38,
        //     "callee": {
        //       "type": "MemberExpression",
        //       "start": 19,
        //       "end": 30,
        //       "object": {
        //         "type": "Identifier",
        //         "start": 19,
        //         "end": 26,
        //         "name": "console"
        //       },
        //       "property": {
        //         "type": "Identifier",
        //         "start": 27,
        //         "end": 30,
        //         "name": "log"
        //       },
        //       "computed": false,
        //       "optional": false
        //     },
        //     "arguments": [
        //       {
        //         "type": "Literal",
        //         "start": 31,
        //         "end": 37,
        //         "value": "开始执行",
        //         "raw": "'开始执行'"
        //       }
        //     ],
        //     "optional": false
        //   }
        // },
        ..._.map(_.filter(bodyAst.body, c => !c.static && c.type === 'PropertyDefinition'), createClassProperty(weakMap)),
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
                    `${idText}.prototype`
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
  }, classDefinedEnv);
  const classRv = new RuntimeRefValue(RUNTIME_VALUE_TYPE.class, {
    [RuntimeValue.symbolAst]:ast,
    [RuntimeValue.symbolEnv]:env,
    [RuntimeValue.symbolName]: idText,
    [RuntimeValue.symbolMergeNewCtor]: newCtorRv,
    [RuntimeValue.symbolComputedMap]: weakMap,
  }, {
    [RuntimeValue.proto]: superClassRv ?? getFunctionPrototype(),
    [RuntimeValue._prototype]: prototypeRv,
  });
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

  
  _.forEach(_.filter(bodyAst.body, c => !c.static && c.type === 'MethodDefinition'), handleProperty(prototypeRv, weakMap, classPrototypeDefinedEnv))
  _.forEach(_.filter(bodyAst.body, c => c.static && c.type === 'MethodDefinition'), handleProperty(classRv, weakMap, classDefinedEnv))
  _.forEach(_.filter(bodyAst.body, c =>( c.static && c.type === 'PropertyDefinition') || ( ['StaticBlock'].includes(c.type) )), handleProperty(classRv, weakMap, classDefinedEnv))
  // console.log('类定义的---', prototypeRv);
}