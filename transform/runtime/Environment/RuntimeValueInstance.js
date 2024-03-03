import Environment from ".";
import parseAst from "..";
import { resetDebugging, setDebugging } from "../../../debugger";
import { RuntimeValueAst, isInstanceOf } from "../../commonApi";
import { DEBUGGER_DICTS, ENV_DICTS, JS_TO_RUNTIME_VALUE_TYPE, PROPERTY_DESCRIPTOR_DICTS, RUNTIME_LITERAL, RUNTIME_VALUE_DICTS, RUNTIME_VALUE_TYPE } from "../constant";
import GeneratorConfig from "./Generator/GeneratorConfig";
import { getArrayProtoTypeV } from "./NativeRuntimeValue/array";
import { getWrapGeneratorFunctionToAsyncFunctionRv } from "./NativeRuntimeValue/async";
import { getGeneratorPrototypeRv } from "./NativeRuntimeValue/generator";
import { getStringProtoTypeV } from "./NativeRuntimeValue/string";
import PropertyDescriptor from "./PropertyDescriptor";
import RuntimeValue, { RuntimeArrayLikeValue, RuntimeAsyncFunctionValue, RuntimeAyncGeneratorFunctionValue, RuntimeConfigValue, RuntimeGeneratorFunctionValue, RuntimeGeneratorInstanceValue, RuntimeRefValue } from "./RuntimeValue";
import createEnviroment, { createEmptyEnviromentExtraConfig } from "./createEnviroment";
import parseRuntimeValue from "./parseRuntimeValue";
import { AsyncFuncitonAstToGeneratorAst, createLiteralAst, createPropertyDesctiptor, createRuntimeValueAst, createSimplePropertyDescriptor, isFunctionRuntimeValue } from "./utils";


let reflectDefinePropertyV;

let trueV;

let falseV;

let nullV;

let undefinedV;

let rootRv;

export function ensureInitRoot() {
  const ObjectPrototypeV = new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, {}, {
    [RUNTIME_VALUE_DICTS.proto]: getNullValue()
  })

  const FunctionPrototypeV = new RuntimeRefValue(RUNTIME_VALUE_TYPE.class, {
  }, {
    [RUNTIME_VALUE_DICTS.proto]: ObjectPrototypeV,
    [RUNTIME_VALUE_DICTS.symbolAst]: {
      type: "FunctionExpression",
      id: {
        type: 'Identifier',
        name: "Function$Prototype"
      },
      expression: false,
      generator: false,
      async: false,
      params: [],
      body: {
        type: "BlockStatement",
        body: []
      }
    },
    [RUNTIME_VALUE_DICTS.symbolEnv]: Environment.window,
    [RUNTIME_VALUE_DICTS.symbolName]: 'Function$Prototype',
  });
  const generateFn = describeNativeFunction(Environment.window, FunctionPrototypeV, ObjectPrototypeV)
  const FunctionClassV = generateFn('Function', ([argsRv]) => {
    console.log('new Function', parseRuntimeValue(argsRv))
  })

  FunctionClassV.setProtoType(FunctionPrototypeV);
  FunctionPrototypeV.setWithDescriptor('constructor', FunctionClassV, createSimplePropertyDescriptor({
    [PROPERTY_DESCRIPTOR_DICTS.writable]: getFalseV(),
    value: FunctionClassV,
  }));

  const callRv = generateFn('call', ([newThisRv, ...argsRv], { _this: fnRv, env }) => {
    if (!isFunctionRuntimeValue(fnRv)) {
      throw new Error('call 函数不能调用在非函数上')
    }

    // console.warn('call', newThisRv, fnRv)

    // console.error(env)
    const middleEnv = createEnviroment(env.name + '_call', env, {
      [ENV_DICTS.$hideInHTML]: true,
    }, createEmptyEnviromentExtraConfig())
    middleEnv.addConst(RUNTIME_LITERAL.this, newThisRv);

   const ret = parseAst({
      type: "CallExpression",
      callee: createRuntimeValueAst(fnRv, fnRv.getDefinedName() + '.call'),
      arguments: _.map(argsRv, (c, i) => createRuntimeValueAst(c, 'args' + i)),
      optional: false
    }, middleEnv)

  return ret;
  });

  FunctionPrototypeV.setWithDescriptor('call', callRv, createSimplePropertyDescriptor({
    value: callRv,
    [PROPERTY_DESCRIPTOR_DICTS.enumerable]: getFalseV(),
  }))

  const applyRv = generateFn('apply', ([newThisRv, argsRv], { _this: fnRv, env }) => {
    if (!isFunctionRuntimeValue(fnRv)) {
      console.error(fnRv);
      throw new Error('apply 函数不能调用在非函数上')
    }
    if (![RUNTIME_VALUE_TYPE.arguments, RUNTIME_VALUE_TYPE.array].includes(argsRv.type)) {
      throw new Error('apply 函数第二个参数必须是类数组')
    }
    const middleEnv = createEnviroment(env.name + '_apply', env, {
      [ENV_DICTS.$hideInHTML]: true,
    }, createEmptyEnviromentExtraConfig({}))
    middleEnv.addConst(RUNTIME_LITERAL.this, newThisRv);
    return parseAst({
      type: "CallExpression",
      callee: createRuntimeValueAst(fnRv, fnRv.getDefinedName() + '.apply'),
      arguments: _.map(argsRv.value, (c, i) => createRuntimeValueAst(c, 'args' + i)),
      optional: false
    }, middleEnv)
  });

  FunctionPrototypeV.setWithDescriptor('apply', applyRv)

  const ObjectToStringRv = generateFn('Object$toString', ([], { _this }) => {
    return createString(String(parseRuntimeValue(_this)))
  });


  ObjectPrototypeV.setWithDescriptor('toString', ObjectToStringRv)

  const ObjecthasOwnPropertyRv = generateFn('Object$hasOwnProperty', ([attrRv], { _this }) => {
    return _this.hasOwnProperty(parseRuntimeValue(attrRv)) ? getTrueV() : getFalseV()
  });

  ObjectPrototypeV.setWithDescriptor('hasOwnProperty', ObjecthasOwnPropertyRv)

  const get__proto__Rv = generateFn('Object$prototype$__proto__', ([], { _this }) => {
    // console.error('super.__proto__')
    if (_this === ObjectPrototypeV) {
      return getNullValue()
    }
    return _this.getProto()
  });

  const set__proto__Rv = generateFn('Object$prototype$__proto__', ([argsRv], { _this }) => {
    if (_this === ObjectPrototypeV) {
      return getTrueV()
    }
    return _this.setProto(argsRv);
  });

  ObjectPrototypeV.set(RUNTIME_LITERAL.$__proto__, getNullValue(),
    new PropertyDescriptor({
      get: get__proto__Rv,
      set: set__proto__Rv,
      enumerable: getFalseV(),
      configurable: getTrueV(),
      kind: PROPERTY_DESCRIPTOR_DICTS.init,
    }))

  rootRv = { generateFn, FunctionPrototypeV, FunctionClassV, ObjectPrototypeV };
}


export function getGenerateFn() {
  if (!rootRv) {
    ensureInitRoot();
  }
  return rootRv.generateFn;
}

export function getObjectPrototypeRv() {
  if (!rootRv) {
    ensureInitRoot();
  }
  return rootRv.ObjectPrototypeV
}

export function getFunctionPrototypeRv() {
  if (!rootRv) {
    ensureInitRoot();
  }
  return rootRv.FunctionPrototypeV
}

export function getFunctionClassRv() {
  if (!rootRv) {
    ensureInitRoot();
  }
  return rootRv.FunctionClassV
}

export function createObject(value) {
  return new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, value, {
    [RUNTIME_VALUE_DICTS.proto]: getObjectPrototypeRv(),
  })
}

export function createConfigRuntimeValue(value) {
  return new RuntimeConfigValue(RUNTIME_VALUE_TYPE.object, value, {
    [RUNTIME_VALUE_DICTS.proto]: getObjectPrototypeRv(),
  })
}

export function createGeneratorInstance(value, config) {
  if (!isInstanceOf(config, GeneratorConfig)) {
    throw new Error('config 漏传')
  }
  return new RuntimeGeneratorInstanceValue(RUNTIME_VALUE_TYPE.object, value, {
    [RUNTIME_VALUE_DICTS.proto]: getGeneratorPrototypeRv(),
    [RUNTIME_VALUE_DICTS.generatorConfig]: config,
  })
}

export function createObjectExtends(superClassRv) {
  return new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, {}, {
    [RUNTIME_VALUE_DICTS.proto]: superClassRv.getProtoType()
  })
}

export function createArray(value) {
  return new RuntimeArrayLikeValue(RUNTIME_VALUE_TYPE.array, value, {
    [RUNTIME_VALUE_DICTS.proto]: getArrayProtoTypeV()
  })
}

export function createString(attr) {
  return new RuntimeValue(RUNTIME_VALUE_TYPE.string, attr);
}

export function createNumber(num) {
  return new RuntimeValue(RUNTIME_VALUE_TYPE.number, num);
}

export function createBoolean(bool) {
  return bool ? getTrueV() : getFalseV()
}

export function runFunctionRuntimeValueInGlobalThis(fnRvAst, windowEnv, ...args) {
  if (!isInstanceOf(fnRvAst, RuntimeValueAst)) {
    throw new Error('传的不是functionAst运行时错误');
  }
  const fnRv = fnRvAst.value;
  if (!isFunctionRuntimeValue(fnRv)) {
    throw new Error('非函数')
  }
  const retRv = parseAst(
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "object": fnRvAst,
          "property": {
            "type": "Identifier",
            "name": "call"
          },
          "computed": false,
          "optional": false
        },
        "arguments": [
          createRuntimeValueAst(windowEnv.get('this'), 'globalThis'),
          ...args,
        ],
        "optional": false
      }
    }, fnRv.getDefinedEnv())
  return retRv;

}

export function asyncArrowFunctionToAsyncGeneratorFunction(ast) {
    if (ast.type !== 'ArrowFunctionExpression') {
      throw 'ast 类型传入有误'
    }

    return {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "object": {
          "type": "FunctionExpression",
          "id": null,
          "expression": false,
          "generator": true,
          "async": true,
          "params": ast.params,
          "body": ast.expression ? {
            "type": "BlockStatement",
            "body": [
              {
                type: 'ReturnStatement',
                argument: ast.body
              }
            ]
          } : ast.body,
        },
        "property": {
          "type": "Identifier",
          "name": "bind"
        },
        "computed": false,
        "optional": false
      },
      "arguments": [
        {
          "type": "ThisExpression",
        }
      ],
      "optional": false
    }
}

export function createArrowFunction(ast, env) {
  if (ast.async) {
    const fnRv = getWrapGeneratorFunctionToAsyncFunctionRv();
    const retRv = parseAst({
     type: 'CallExpression',
     callee: createRuntimeValueAst(fnRv, 'WrapGeneratorFunctionToAsyncFunction', fnRv.getDefinedAst()),
     arguments: [
      asyncArrowFunctionToAsyncGeneratorFunction(ast),
     ]
    }, env)
    // TODO 可能会出问题
    retRv.restConfig[RUNTIME_VALUE_DICTS.symbolAsyncFunctionAst] = ast;
    console.log(retRv, 'retRv');
    return retRv;
  }
  return new RuntimeRefValue(RUNTIME_VALUE_TYPE.arrow_func, {
  }, {
    [RUNTIME_VALUE_DICTS.proto]: getFunctionPrototypeRv(),
    [RUNTIME_VALUE_DICTS.symbolAst]: ast,
    [RUNTIME_VALUE_DICTS.symbolEnv]: env
  })
}

export function createFunction(config) {
  const ast = config[RUNTIME_VALUE_DICTS.symbolAst];
  const isGenerator = _.get(ast, 'generator');
  const isAsync = _.get(ast, 'async')

  _.set(config, RUNTIME_VALUE_DICTS.proto, getFunctionPrototypeRv())
  if (!isGenerator && isAsync) {
   const fnRv = getWrapGeneratorFunctionToAsyncFunctionRv();
   const retRv = parseAst({
    type: 'CallExpression',
    callee: createRuntimeValueAst(fnRv, 'WrapGeneratorFunctionToAsyncFunction', fnRv.getDefinedAst()),
    arguments: [
      {
        ..._.cloneDeep(ast),
        generator: true,
      }
    ]
   }, config[RUNTIME_VALUE_DICTS.symbolEnv])
   // TODO 可能会出问题
   retRv.restConfig[RUNTIME_VALUE_DICTS.symbolAsyncFunctionAst] = ast;
   return retRv;
  }
  let FunctionCtor = RuntimeRefValue;
  if (isGenerator && !isAsync) {
    FunctionCtor = RuntimeGeneratorFunctionValue;
  } else if (isGenerator && isAsync) {
    FunctionCtor = RuntimeAyncGeneratorFunctionValue;
  }
  const ret = new FunctionCtor(RUNTIME_VALUE_TYPE.function, {}, config)
  ret.setProtoType(createObject({
    constructor: ret,
  }))
  return ret;
}

export function getReflectDefinedPropertyV() {
  if (!reflectDefinePropertyV) {
    const generateFn = getGenerateFn()
    reflectDefinePropertyV = generateFn('Reflect$defineProperty', (
      [
        objRv,
        attrRv,
        attributesRv
      ],
    ) => {
      const attr = parseRuntimeValue(attrRv);
      const undefinedV = getUndefinedValue();
      const hasSetOrGet = attributesRv.hasOwnProperty(RUNTIME_LITERAL.set)
        || attributesRv.hasOwnProperty(RUNTIME_LITERAL.get);

      // if (attr === 'length') {
      //   console.log(_.cloneDeep(objRv))
      //   console.log('Reflect.definedProperty', attr);
      // }

      const newPropertyDescriptor = createPropertyDesctiptor(objRv, attr, attributesRv.value, {
        kind: PROPERTY_DESCRIPTOR_DICTS.REFLECT_DEFINE_PROPERTY
      })

      return objRv.set(attr,
        hasSetOrGet ? undefinedV : attributesRv.value.value ?? undefinedV,
        newPropertyDescriptor,
        {
          kind: PROPERTY_DESCRIPTOR_DICTS.REFLECT_DEFINE_PROPERTY,
        }
      )
    })
  }
  return reflectDefinePropertyV;
}

export function getTrueV() {
  if (!trueV) {
    trueV = new RuntimeValue(RUNTIME_VALUE_TYPE.boolean, true);
  }
  return trueV;
}

export function getFalseV() {
  if (!falseV) {
    falseV = new RuntimeValue(RUNTIME_VALUE_TYPE.boolean, false);
  }
  return falseV;
}

export function getNullValue() {
  if (!nullV) {
    nullV = new RuntimeValue(RUNTIME_VALUE_TYPE.null, null);
  }
  return nullV;
}

export function getUndefinedValue() {
  if (!undefinedV) {
    undefinedV = new RuntimeValue(RUNTIME_VALUE_TYPE.undefined, undefined);
  }
  return undefinedV;
}

export const describeNativeFunction = (env, proto, ObjectPrototypeV) => (name, nativeFnCb, rest) => {
  const ret = new RuntimeRefValue(RUNTIME_VALUE_TYPE.function, {
  }, {
    [RUNTIME_VALUE_DICTS.proto]: proto,
    [RUNTIME_VALUE_DICTS.symbolAst]: {
      type: 'FunctionExpression',
      id: { type: 'Identifier', name },
      params: [
        {
          type: 'RestElement',
          argument: {
            type: 'Identifier',
            name: 'args',
          },
        },
      ],
      nativeFnCb,
      [ENV_DICTS.$hideInHTML]: true,
      ...(rest || {}),
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: "ExpressionStatement",
            expression: createLiteralAst("[native code] of " + name),
          }
        ],
      },
    },
    [RUNTIME_VALUE_DICTS.symbolEnv]: env,
    [RUNTIME_VALUE_DICTS.symbolName]: name,
  })
  ret.setProtoType(new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, {
    constructor: ret,
  }, {
    [RUNTIME_VALUE_DICTS.proto]: ObjectPrototypeV,
  }))
  return ret;
}
