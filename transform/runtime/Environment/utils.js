import parseAst from ".."
import { RuntimeValueAst, isInstanceOf } from "../../commonApi"
import { OUTPUT_TYPE, RUNTIME_VALUE_TO_OUTPUT_TYPE, RUNTIME_VALUE_TYPE } from "../constant"
import RuntimeValue, { createString, getFalseV, getTrueV } from "./RuntimeValue"
import parseRuntimeValue from "./parseRuntimeValue"

export function typeOfRuntimeValue(rv, ...args) {
  if (!isInstanceOf(rv , RuntimeValue)) {
    throw new Error('typeof 必须接一个RuntimeValue')
  }
  // console.log('----typeOfRuntimeValue----', rv)
  return parseRuntimeValue(parseAst({
    "type": "ExpressionStatement",
    "expression": {
      "type": "UnaryExpression",
      "operator": "typeof",
      "prefix": true,
      "argument": createRuntimeValueAst(rv,  ...args)
    }
  }, {}))
}

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
  return  OUTPUT_TYPE.object
}

export function isUndefinedRuntimeValue(rv,  ...args) {
  return getRuntimeValueType(rv,  ...args) === OUTPUT_TYPE.undefined
}

export function isFunctionRuntimeValue(rv,  ...args) {
  return getRuntimeValueType(rv,  ...args) === OUTPUT_TYPE.function
}

export function isObjectRuntimeValue(rv,  ...args) {
  return getRuntimeValueType(rv,  ...args) === OUTPUT_TYPE.object
}

export function createRuntimeValueAst(value, name, ast) {
  if (!isInstanceOf(value, RuntimeValue)) {
    console.error(value)
    throw new Error('创建失败')
  }
  const ret = new RuntimeValueAst({
    type: 'RuntimeValue',
    value,
    name,
    ast,
  });
  return ret;
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
  while(parseRuntimeValue(t) && t !== rightPrototypeRv) {
    t = t.getProto();
  }
 
  // console.log('enter-instanceOf')
  return t === rightPrototypeRv ? getTrueV() : getFalseV()
}


export function getBindRuntimeValue(env, fn, ...args) {
  if (isInstanceOf(fn , RuntimeValue)) {
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
    arguments:  [
      ...args
    ],
    optional: false
  }, env)
}
