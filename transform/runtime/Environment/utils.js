import Environment from "."
import parseAst from ".."
import { GetRuntimeValueAst, RuntimeValueAst, UseRuntimeValueAst, isInstanceOf } from "../../commonApi"
import { AST_DICTS, OUTPUT_TYPE, PROPERTY_DESCRIPTOR_DICTS, RUNTIME_LITERAL, RUNTIME_VALUE_TO_OUTPUT_TYPE, RUNTIME_VALUE_TYPE } from "../constant"
import GeneratorConfig from "./Generator/GeneratorConfig"
import { _codePromiseResolveAst } from "./Native/promise"
import { getPromiseRv } from "./NativeRuntimeValue/promise"
import { getJsSymbolIterator, getSymbolIteratorRv } from "./NativeRuntimeValue/symbol"
import PropertyDescriptor from "./PropertyDescriptor"
import RuntimeValue, { RuntimeConfigValue, RuntimeGeneratorFunctionValue, RuntimeGeneratorInstanceValue, RuntimePromiseInstanceValue } from "./RuntimeValue"
import { createString, getFalseV, getGenerateFn, getReflectDefinedPropertyV, getTrueV, getUndefinedValue, runFunctionRuntimeValueInGlobalThis } from "./RuntimeValueInstance"
import parseRuntimeValue from "./parseRuntimeValue"

export function getRuntimeValueType(rv) {
  if ([
    RUNTIME_VALUE_TYPE.function,
    RUNTIME_VALUE_TYPE.arrow_func,
    RUNTIME_VALUE_TYPE.class,
  ].includes(rv.type)) {
    // console.log('进来getTypeOf', rv);
    return OUTPUT_TYPE.function
  }
  if ([
    RUNTIME_VALUE_TYPE.undefined,
    RUNTIME_VALUE_TYPE.number,
    RUNTIME_VALUE_TYPE.string,
    RUNTIME_VALUE_TYPE.boolean
  ].includes(rv.type)) {
    return RUNTIME_VALUE_TO_OUTPUT_TYPE(rv.type)
  }
  return OUTPUT_TYPE.object
}

export function isRuntimeValueTrue(rv) {
  return rv === getTrueV()
}

export function isRuntimeValueFalse(rv) {
  return rv === getFalseV()
}

export function isUndefinedRuntimeValue(rv, ...args) {
  return getRuntimeValueType(rv, ...args) === OUTPUT_TYPE.undefined
}

export function isFunctionRuntimeValue(rv, ...args) {
  return getRuntimeValueType(rv, ...args) === OUTPUT_TYPE.function
}

export function isGeneratorFunctionRuntimeValue(rv, ...args) {
  return isFunctionRuntimeValue(rv, ...args) && isInstanceOf(rv, RuntimeGeneratorFunctionValue)
}

export function isObjectRuntimeValue(rv, ...args) {
  return getRuntimeValueType(rv, ...args) === OUTPUT_TYPE.object
}

export function isNumberRuntimeValue(rv, ...args) {
  return getRuntimeValueType(rv, ...args) === OUTPUT_TYPE.number
}

export function createRuntimeValueAst(value, name, ast) {
  if (!isInstanceOf(value, RuntimeValue) && !_.isFunction(value)) {
    console.error(value)
    throw new Error('创建失败')
  }
  const ret = new RuntimeValueAst({
    type: AST_DICTS.RuntimeValue,
    value,
    name,
    ast,
  });
  return ret;
}

export function createUseRuntimeValueAst(index, argument) {
  return new UseRuntimeValueAst({
    type: AST_DICTS.UseRuntimeValue,
    index,
    argument,
  })
}

export function createGetRuntimeValueAst(index) {
  return new GetRuntimeValueAst({
    type: AST_DICTS.GetRuntimeValue,
    index,
  })
}

export function createLiteralAst(str){
  if (_.isObject(str)) {
    console.error('有object类型的Literal')
  }
  return {
    type: 'Literal',
    value: str,
    raw: `${str}`,
  }
}

export function createStringLiteralAst(str){
  if (_.isObject(str)) {
    console.error('有object类型的Literal')
  }
  return {
    type: 'Literal',
    value: `${str}`,
    raw: `'${str}'`,
  }
}

export function createArrowFunctionCallExpressionAst(body) {
  return {
    "type": "CallExpression",
    "callee": {
      "type": "ArrowFunctionExpression",
      "id": null,
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        body,
      }
    },
    "arguments": [],
    "optional": false
  }
}

export function instanceOfRuntimeValue(left, right) {
  if (!isFunctionRuntimeValue(right)) {
    throw new Error('instanceof 右边必须是function类型')
  }
  if (
    !isObjectRuntimeValue(left)
    && !isFunctionRuntimeValue(left)
  ) {
    return getFalseV()
  }

  let t = left.getProto();
  const rightPrototypeRv = right.getProtoType();
  if (isUndefinedRuntimeValue(rightPrototypeRv)) {
    console.error(left, right)
    throw new Error('instanceof 右边必须是有prototype的function')
  }
  while (parseRuntimeValue(t) && t !== rightPrototypeRv) {
    t = t.getProto();
  }

  // console.log('enter-instanceOf')
  return t === rightPrototypeRv ? getTrueV() : getFalseV()
}


export function getBindRuntimeValue(env, fn, ...args) {
  if (isInstanceOf(fn, RuntimeValue)) {
    throw new Error('bind绑定不能是RuntimeValue,应该将其先转成ast')
  }
  return parseAst({
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      object: fn,
      property: {
        type: "Identifier",
        name: "bind"
      },
      computed: false,
      optional: false
    },
    arguments: _.size(args) ? [...args] : [
      {
        type: 'ThisExpression'
      },
    ],
    optional: false
  }, env)
}

export function parseFunctionCallRuntimeValue(env, fn, ...args) {
  if (isInstanceOf(fn, RuntimeValue)) {
    throw new Error('call绑定不能是RuntimeValue,应该将其先转成ast')
  }
  return parseAst({
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      object: fn,
      property: {
        type: "Identifier",
        name: "call"
      },
      computed: false,
      optional: false
    },
    arguments: [
      ...args
    ],
    optional: false
  }, env)
}

export function isREFLECT_DEFINE_PROPERTYPropertyDescriptor(pd) {
  if (!isInstanceOf(pd, PropertyDescriptor)) {
    throw new Error('不是PropertyDescriptor实例')
  }
  return pd.kind === PROPERTY_DESCRIPTOR_DICTS.REFLECT_DEFINE_PROPERTY
}

export function getPropertyDesctiptorConfigAst(name, TF) {
  return {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    key: {
      type: "Identifier",
      name,
    },
    value: createLiteralAst(TF),
    kind: "init"
  }
}

export function createPropertyDesctiptor(objRv, attr, propertyDescriptorConfig, config) {
  if (!_.isObject(config)) {
    throw new Error('config 必传');
  }
  const { kind } = config;
  if (!kind) {
    throw new Error('kind 必传');
  }

  const getHasSet = (c) =>  Reflect.has(c, RUNTIME_LITERAL.set)
  const getHasGet = (c) =>  Reflect.has(c, RUNTIME_LITERAL.get)
  const getHasValue = (c) => Reflect.has(c, 'value');
  const getHasWritable = (c) => Reflect.has(c, PROPERTY_DESCRIPTOR_DICTS.writable);

  const hasSet = getHasSet(propertyDescriptorConfig)
  const hasGet = getHasGet(propertyDescriptorConfig)
  const hasValue = getHasValue(propertyDescriptorConfig)
  const hasWritable = getHasWritable(propertyDescriptorConfig);

  if (hasSet
    && hasValue) {
      console.error(propertyDescriptorConfig)
    throw new Error('不能同时设置' + RUNTIME_LITERAL.set + ' 和 value')
  }
  if (hasGet
    && hasValue) {
    throw new Error('不能同时设置' + RUNTIME_LITERAL.get + ' 和 value')
  }

  if (hasSet && hasWritable) {
    throw new Error('不能同时设置' + RUNTIME_LITERAL.set + ' 和 value')
  }

  if (hasGet && hasWritable) {
    throw new Error('不能同时设置' + RUNTIME_LITERAL.get + ' 和 value')
  }

  const hasSetOrGet = hasSet || hasGet

  const undefinedV = getUndefinedValue()
  const trueV = getTrueV();
  const falseV = getFalseV();

 // 这里可能获取的是原型链上的
  const oldPropertyDescriptor = objRv.getPropertyDescriptor(attr);
  if (!oldPropertyDescriptor) {
    const { value } = propertyDescriptorConfig;
    if (kind === PROPERTY_DESCRIPTOR_DICTS.init) {
      return new PropertyDescriptor({
        value,
        [PROPERTY_DESCRIPTOR_DICTS.writable]: trueV,
        [PROPERTY_DESCRIPTOR_DICTS.enumerable]: trueV,
        [PROPERTY_DESCRIPTOR_DICTS.configurable]: trueV,
        kind,
      })
    }

    if ( [PROPERTY_DESCRIPTOR_DICTS.REFLECT_DEFINE_PROPERTY].includes(kind)) {
      if (!hasSetOrGet) {
        propertyDescriptorConfig.value = propertyDescriptorConfig.value ?? undefinedV;
        propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.writable] = propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.writable] ?? falseV;
      } else {
        propertyDescriptorConfig.set = propertyDescriptorConfig.set ?? undefinedV;
        propertyDescriptorConfig.get = propertyDescriptorConfig.get ?? undefinedV;
      }
      propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.enumerable] = propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.enumerable] ?? falseV;
      propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.configurable] = propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.configurable] ?? falseV;
      propertyDescriptorConfig.kind = PROPERTY_DESCRIPTOR_DICTS.REFLECT_DEFINE_PROPERTY;
      return new PropertyDescriptor(propertyDescriptorConfig)
    }
  } else {
    if (!oldPropertyDescriptor.isPropertyDescriptorConfigurable()) {
      console.log(oldPropertyDescriptor);
      console.error(`Reflect.defineProperty不能重新定义${attr}属性`)
      return;
    }
    // oldPropertyDescriptor.setCurrentState(kind);
    if (kind === PROPERTY_DESCRIPTOR_DICTS.init) {
      const { value } = propertyDescriptorConfig;
      return new PropertyDescriptor({
        ..._.pick(oldPropertyDescriptor, [PROPERTY_DESCRIPTOR_DICTS.writable, PROPERTY_DESCRIPTOR_DICTS.enumerable, PROPERTY_DESCRIPTOR_DICTS.configurable]),
        value,
        kind,
      })
    }
    if ([PROPERTY_DESCRIPTOR_DICTS.REFLECT_DEFINE_PROPERTY].includes(kind)) {
      if (hasSetOrGet) {
        // console.warn('attr-set-get', attr, {
        //   [PROPERTY_DESCRIPTOR_DICTS.enumerable]: propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.enumerable] ?? oldPropertyDescriptor[PROPERTY_DESCRIPTOR_DICTS.enumerable],
        //   [PROPERTY_DESCRIPTOR_DICTS.configurable]: propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.configurable] ?? oldPropertyDescriptor[PROPERTY_DESCRIPTOR_DICTS.configurable],
        //   [RUNTIME_LITERAL.set]: propertyDescriptorConfig[RUNTIME_LITERAL.set] ?? oldPropertyDescriptor[RUNTIME_LITERAL.set] ?? undefinedV,
        //   [RUNTIME_LITERAL.get]: propertyDescriptorConfig[RUNTIME_LITERAL.get] ?? oldPropertyDescriptor[RUNTIME_LITERAL.get] ?? undefinedV,
        //   kind,
        // }, oldPropertyDescriptor)
        return new PropertyDescriptor({
          [PROPERTY_DESCRIPTOR_DICTS.enumerable]: propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.enumerable] ?? oldPropertyDescriptor[PROPERTY_DESCRIPTOR_DICTS.enumerable],
          [PROPERTY_DESCRIPTOR_DICTS.configurable]: propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.configurable] ?? oldPropertyDescriptor[PROPERTY_DESCRIPTOR_DICTS.configurable],
          [RUNTIME_LITERAL.set]: propertyDescriptorConfig[RUNTIME_LITERAL.set] ?? oldPropertyDescriptor[RUNTIME_LITERAL.set] ?? undefinedV,
          [RUNTIME_LITERAL.get]: propertyDescriptorConfig[RUNTIME_LITERAL.get] ?? oldPropertyDescriptor[RUNTIME_LITERAL.get] ?? undefinedV,
          kind,
        });
      } else {
        // console.warn('attr-value', attr, propertyDescriptorConfig)
        return new PropertyDescriptor({
          [PROPERTY_DESCRIPTOR_DICTS.enumerable]: propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.enumerable] ?? oldPropertyDescriptor[PROPERTY_DESCRIPTOR_DICTS.enumerable],
          [PROPERTY_DESCRIPTOR_DICTS.configurable]: propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.configurable] ?? oldPropertyDescriptor[PROPERTY_DESCRIPTOR_DICTS.configurable],
          [PROPERTY_DESCRIPTOR_DICTS.writable]: propertyDescriptorConfig[PROPERTY_DESCRIPTOR_DICTS.writable] ?? oldPropertyDescriptor[PROPERTY_DESCRIPTOR_DICTS.writable] ?? falseV,
          'value': propertyDescriptorConfig.value ?? oldPropertyDescriptor['value'],
          kind,
        });
      }
    }
  }

  console.error(...arguments)
  throw new Error('未处理的PropertyDesctiptor类型')
}

export function createSimplePropertyDescriptor(config) {
  const trueV = getTrueV();
  return new PropertyDescriptor({
    [PROPERTY_DESCRIPTOR_DICTS.writable]: config[PROPERTY_DESCRIPTOR_DICTS.writable] ?? trueV,
    [PROPERTY_DESCRIPTOR_DICTS.enumerable]: config[PROPERTY_DESCRIPTOR_DICTS.enumerable] ?? trueV,
    [PROPERTY_DESCRIPTOR_DICTS.configurable]: config[PROPERTY_DESCRIPTOR_DICTS.configurable] ?? trueV,
    value: config.value ?? getUndefinedValue(),
    kind: PROPERTY_DESCRIPTOR_DICTS.init,
  })
}

export function createUnwritablePropertyDescriptor(config) {
  const falseV = getFalseV();
  return new PropertyDescriptor({
    [PROPERTY_DESCRIPTOR_DICTS.writable]: config[PROPERTY_DESCRIPTOR_DICTS.writable] ?? falseV,
    [PROPERTY_DESCRIPTOR_DICTS.enumerable]: config[PROPERTY_DESCRIPTOR_DICTS.enumerable] ?? falseV,
    [PROPERTY_DESCRIPTOR_DICTS.configurable]: config[PROPERTY_DESCRIPTOR_DICTS.configurable] ?? falseV,
    value: config.value ?? getUndefinedValue(),
    kind: PROPERTY_DESCRIPTOR_DICTS.init,
  })
}

export function getReflectDefinePropertyAst(argumentAst) {
  if (!Array.isArray(argumentAst)) {
    throw new Error(`argumentAst必须是ast数组`)
  }
  return {
    type: "ExpressionStatement",
    expression: {
      type: "CallExpression",
      callee: createRuntimeValueAst(getReflectDefinedPropertyV(), 'Reflect$defineProperty'),
      arguments: argumentAst,
      optional: false
    }
  }
}


export function getObjectAttrOfPropertyDescriptor(objRv, attr, valueRv, { kind, env }) {
  if (!env) {
    throw new Error('env 漏传')
  }
  if (!kind) {
    throw new Error('kind 漏传')
  }
  const oldDescriptor = objRv.getPropertyDescriptor(attr) ?? createSimplePropertyDescriptor({
    value: valueRv,
  })

  oldDescriptor.setCurrentState(kind)
  
  // console.log('enter------->', kind, oldDescriptor, oldDescriptor.isPropertyDescriptorUnWritable());
  if ([RUNTIME_LITERAL.set, RUNTIME_LITERAL.get].includes(kind)) {
    // console.error(attr);
    oldDescriptor.deleteAttr('value')
    oldDescriptor.deleteAttr(PROPERTY_DESCRIPTOR_DICTS.writable)
    oldDescriptor.setRuntimeValue(kind, valueRv)
  } else if (kind === PROPERTY_DESCRIPTOR_DICTS.init) {
    if (oldDescriptor.isPropertyDescriptorUnWritable()) {
      if (env.isInUseStrict()) {
        throw new Error('严格环境下，writable设为false，赋值会报错')
      }
      return oldDescriptor;
    }

    // if (attr === 'fn') {
    //   console.warn('enter', valueRv, oldDescriptor);
    // }

    // if (!['value', 'configurable', 'enumerable', 'writable', 'get', 'set'].includes(attr)){
    //   console.warn(attr, valueRv, oldDescriptor)
    // }
   
  //  console.warn('enter', attr, valueRv)
    // oldDescriptor.deleteAttr(RUNTIME_LITERAL.set)
    // oldDescriptor.deleteAttr( RUNTIME_LITERAL.get)
    if (!oldDescriptor.isHaveSetterOrGetter()) {
      oldDescriptor.setRuntimeValue('value', valueRv)
    }
  }

  // if (attr === 'a') {
  //   console.error('----', oldDescriptor)
  // }
  return oldDescriptor;
}


export const getGenerateInstanceConfig = (rvList) => {
  if (isInstanceOf(rvList[0], RuntimeConfigValue)) {
    if (!isInstanceOf(_.get(rvList, '0.value'), GeneratorConfig)) {
      throw new Error('配置不属于 GeneratorConfig')
    }
    return _.get(rvList, '0.value');
  }

  // TODO 处理 a yield a * 2 这种

}


export function getIterableRvOfGeneratorInstanceOfNext(iterableRv, env) {
  if (
    !isInstanceOf(iterableRv, RuntimeGeneratorInstanceValue) &&
    !isGeneratorFunctionRuntimeValue(iterableRv.get(getJsSymbolIterator()))) {
    throw new Error(`for of 语句的遍历对象必须是生成器实例，
    或者实现 * Symbol[iterator]间接得到生成器实例的方法`);
  }
  const genInstanceRv = parseAst({
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": createRuntimeValueAst(iterableRv, '_ref'),
      "property": createRuntimeValueAst(
        getSymbolIteratorRv(),
        'Symbol$iterator'
      ),
      "computed": true,
      "optional": false
    },
    "arguments": [],
    "optional": false
  },
    env,
  )

  let stepRv = null;
  const execNext = () => {
    stepRv = parseAst({
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "object": createRuntimeValueAst(genInstanceRv, '_gen'),
        "property": {
          "type": "Identifier",
          "name": "next"
        },
        "computed": false,
        "optional": false
      },
      "arguments": [
      ],
      "optional": false
    }, env)
    return stepRv;
  };
  const getNextRv = () => stepRv;
  const getLatestDoneAndValueRv = () => {
    execNext()
    return {
      value: getNextRv().get('value'),
      done: getNextRv().get('done'),
    }
  }
  return {
    execNext,
    getNextRv,
    getLatestDoneAndValueRv,
  }
}

export function ifErrorIsRuntimeValueWillParse(e) {
  if (isInstanceOf(e, RuntimeValue)) {
    return parseRuntimeValue(e)
  }
  return e;
}

export function withWrapAsync (...args) {
  try {
    runFunctionRuntimeValueInGlobalThis(...args)
  }catch(e) {
    e = ifErrorIsRuntimeValueWillParse(e);
    throw e;
  }
}

export function awaitToYield (ast) {
  if (Array.isArray(ast)) {
    return _.map(ast, awaitToYield)
  }
  if (!_.isObject(ast)) {
    return ast === 'AwaitExpression' ? 'YieldExpression' : ast;
  }
  const copyAst = {};
  for(const attr in ast) {
    copyAst[attr] = awaitToYield(ast[attr]);
  }
  return copyAst;
}

export function AsyncFuncitonAstToGeneratorAst(ast) {
  return {
    ..._.cloneDeep(ast),
    type: 'FunctionExpression',
    async: false,
    generator: true,
    body: awaitToYield(ast.body)
  }
}

export function PromiseRvThen({
  promiseInstanceRv,
  thenCb,
  thenCbIntroduction = 'args',
  env,
}) {
  if (!isInstanceOf(env, Environment)
   || !isInstanceOf(promiseInstanceRv, RuntimePromiseInstanceValue)
  ) {
    throw new Error('入参缺少')
  }
  const generateFn = getGenerateFn()
  return parseAst({
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: createRuntimeValueAst(  promiseInstanceRv, 'innerPromiseInstance'),
      property: createRuntimeValueAst(createString('then'), 'then'),
      computed: false,
      optional: false,
    },
    arguments: [
      createRuntimeValueAst(generateFn(thenCbIntroduction, thenCb), thenCbIntroduction)
    ]
  }, env)
}

export function PromiseRvResolve(valueRv, env) {
  if (!isInstanceOf(env, Environment)
  ) {
    throw new Error('入参缺少env')
  }
  return parseAst({
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: createRuntimeValueAst(getPromiseRv(), 'Promise'),
      property: createRuntimeValueAst(createString('resolve'), 'resolve'),
      computed: false,
      optional: false,
    },
    arguments: [
      createRuntimeValueAst(valueRv, '_innerValue'),
    ]
  }, env)
}

export function consolePromiseRv(PIrv, env) {
  if (!isInstanceOf(env, Environment)
  ) {
    throw new Error('入参缺少env')
  }
  if (!isInstanceOf(PIrv, RuntimePromiseInstanceValue)) {
    console.log(parseRuntimeValue(PIrv))
  } else {
    PromiseRvThen({
      promiseInstanceRv: PIrv,
      thenCb: ([argsRv]) => {
        console.log('promise-resolve-value:', parseRuntimeValue(argsRv))
      },
      env
    })
  }

}

export function createPromiseRvAndPromiseResolveCallback(env) {
  if (!isInstanceOf(env, Environment)) {
    throw new Error('env比传')
  }
  const ret = parseAst(_.cloneDeep(_codePromiseResolveAst), env)
  return {
    promiseRv: ret.get('promise'),
    promiseResolveCallback: (argsRv, env) => {
      if (!isInstanceOf(env, Environment)) {
        throw new Error('env比传')
      }
      return parseAst({
      "type": "CallExpression",
      "callee": createRuntimeValueAst(ret.get('promiseResolve'), 'promiseResolve'),
      "arguments": [
        createRuntimeValueAst(argsRv, '_innerargsRv')
      ],
      "optional": false
    }, env)}
  }
}