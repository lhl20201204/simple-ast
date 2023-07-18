import parseAst from ".."
import { OUTPUT_TYPE } from "../constant"
import RuntimeValue, { getFalseV } from "./RuntimeValue"
import parseRuntimeValue from "./parseRuntimeValue"

export function typeOfRuntimeValue(rv) {
  return parseRuntimeValue(parseAst({
    "type": "ExpressionStatement",
    "expression": {
      "type": "UnaryExpression",
      "operator": "typeof",
      "prefix": true,
      "argument": createRuntimeValueAst(rv)
    }
  }, {}))
}

export function isUndefinedRuntimeValue(rv) {
  return typeOfRuntimeValue(rv) === OUTPUT_TYPE.undefined
}

export function isFunctionRuntimeValue(rv) {
  return typeOfRuntimeValue(rv) === OUTPUT_TYPE.function
}

export function isObjectRuntimeValue(rv) {
  return typeOfRuntimeValue(rv) === OUTPUT_TYPE.object
}

export function createRuntimeValueAst(value, name, ast) {
  if (!value instanceof RuntimeValue) {
    throw new Error('创建失败')
  }
  return {
    type: 'RuntimeValue',
    value,
    name,
    ast,
  }
}

export function instanceOfRuntimeValue(left, right) {
  if (!isFunctionRuntimeValue(right)) {
    throw new Error('instanceof 右边必须是function类型')
  }
  if (
    !isObjectRuntimeValue(left)
  ) {
    return getFalseV()
  }
  let t = left.getProto();
  const rightPrototypeRv = right.getProtoType();
  if (isUndefinedRuntimeValue(rightPrototypeRv)) {
    throw new Error('instanceof 右边必须是有prototype的function')
  }
  while(parseRuntimeValue(t) && t !== rightPrototypeRv) {
    t = t.getProto();
  }

  return t === rightPrototypeRv ? getTrueV() : getFalseV()
}


export function getBindRuntimeValue(env, fn, ...args) {
  if (fn instanceof RuntimeValue) {
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
  if (fn instanceof RuntimeValue) {
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
