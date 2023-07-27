import { isInstanceOf } from "../../commonApi";
import { RUNTIME_LITERAL, RUNTIME_VALUE_TYPE } from "../constant";
import PropertyDescriptor from "./PropertyDescriptor";
import parseRuntimeValue from "./parseRuntimeValue";
import { createRuntimeValueAst, isFunctionRuntimeValue, parseFunctionCallRuntimeValue } from "./utils";

// import parseRuntimeValue from "./parseRuntimeValue";
const proto = Symbol('__proto__');
const superproto = Symbol('__superproto__');
const _prototype = Symbol('__prototype__');
const symbolAst = Symbol('$__symbolAst__')
const symbolEnv = Symbol('$__symbolEnv__')
const symbolName = Symbol('$__symbolName__')
const symbolCtorAst = Symbol('$__symbolCtorAst__')
const symbolCtorName = Symbol('$__symbolCtorName__')
const symbolComputedMap = Symbol('$__symbolComputedMap__')
const symbolMergeNewCtor = Symbol('$__symbolMergeNewCtor__');



let innerTransformId = 0;

export default class RuntimeValue {
  static id = 0;

  static isTransforming = false

  static proto = proto

  static superproto = superproto;

  static _prototype = _prototype;

  static symbolAst = symbolAst

  static symbolEnv = symbolEnv;

  static symbolName = symbolName;

  static symbolCtorAst = symbolCtorAst;

  static symbolCtorName = symbolCtorName;

  static symbolComputedMap = symbolComputedMap;

  static symbolMergeNewCtor = symbolMergeNewCtor;

  constructor(type, value, restConfig = {}) {
    this.id = RuntimeValue.isTransforming ?
    'inner' + innerTransformId++
     : RuntimeValue.id++;
    this.type = type;
    
    this.value = value;
    if (Reflect.has(restConfig, proto)) {
      if (!isInstanceOf(restConfig[proto], RuntimeValue)) {
        throw new Error('原型链初始化失败')
      }
    }
    if (Reflect.has(restConfig, _prototype)) {
      if (!isInstanceOf(restConfig[_prototype], RuntimeValue)) {
        throw new Error('原型链初始化失败')
      }
    }
    this.restConfig = restConfig;
  }

  getPropertyDescriptor(attr) {
    return this.propertyDescriptors.get(attr)
  }

  hasOwnProperty(attr) {
    return false;
  }

  keys() {
    throw new Error('非引用对象没有keys')
  }

  delete(attr) {
    // console.error('delete', attr);
    const v = Reflect.deleteProperty(this.value, attr)
    if (isInstanceOf(this, RuntimeRefValue)) {
      const descriptor = this.propertyDescriptors.get(attr)
      if (descriptor ) {
        this.propertyDescriptors.delete(attr)
      }
    }
    return new RuntimeValue(RUNTIME_VALUE_TYPE.boolean, v)
  }

  get(attr) {
    return undefinedV;
  }


}

export class RuntimeRefValue extends RuntimeValue{
  constructor(...args) {
    super(...args)
    if ([RUNTIME_VALUE_TYPE.function,
      RUNTIME_VALUE_TYPE.arrow_func,
       RUNTIME_VALUE_TYPE.class].includes(this.type)) {
      if (!Reflect.has(this.value, symbolAst)
        || !Reflect.has(this.value, symbolEnv)
        || (
          !Reflect.has(this.value, symbolName) &&
         this.type !== RUNTIME_VALUE_TYPE.arrow_func)
      ) {
        throw new Error(this.type + '运行时初始化缺少必须属性');
      }
    }
    this.propertyDescriptors = new Map();

    // 这里底层调用方法时再特殊处理
    _.forEach(this.value, (v, k) => {
      this.propertyDescriptors.set(k, new PropertyDescriptor({
        value: v,
      }))
    })
    // console.log(this.propertyDescriptors);
  }

  hasOwnProperty(attr) {
    return this.propertyDescriptors.has(attr)
  }

  getBaseHasProperty(attr) {
    if (this.hasOwnProperty(attr)) {
      return this;
    }
    return this.restConfig[proto] && this.getProto().getBaseHasProperty(attr)
  }


  get(attr) {
    // console.log(attr, this)

    if (attr === RUNTIME_LITERAL.$__proto__) {
      // todo这里很怪
      if (this.type === RUNTIME_VALUE_TYPE.super) {
        // console.error('enter');
        return this.getSuperProto()
      }
      return this.getProto()
    }

    if (this.hasOwnProperty(attr)) {
      const descriptor = this.propertyDescriptors.get(attr)
      if (isInstanceOf(descriptor, PropertyDescriptor)) {
        if (isFunctionRuntimeValue(descriptor.get)) {
          const fnRv = descriptor.get;
          // console.log('begin---call')
          return parseFunctionCallRuntimeValue(
            fnRv.getDefinedEnv(),
            createRuntimeValueAst(fnRv, `${attr}_getter`),
            createRuntimeValueAst(this, 'this'),
          )
        }
      }
    }


    // const target = this.getBaseHasProperty(attr);

    if (attr === RUNTIME_LITERAL.$prototype) {
      return this.getProtoType()
    }

    if (this.type === 'null') {
      return undefinedV
    }
       // 如果当前对象找不到，就往原型链上查找, 直到为空。
    if (this.hasOwnProperty(attr)) {

      // 比如 a = [0] a[2] = 1; 此时获取a[1]
      return this.value[attr] ?? undefinedV;
    }
   
    if (this.restConfig[proto]) {
      // console.log('原型链', this, this.getProto(), attr)
      return this.getProto().get(attr)
    }
    // 否则返回undefined；
    return undefinedV
  }

  set(attr, rv, descriptor) {
    if (this.type === RUNTIME_VALUE_TYPE.super) {
      return falseV;
    }
    
    if (!descriptor) {
      const oldDescriptor = this.propertyDescriptors.get(attr)
      if (isInstanceOf(oldDescriptor , PropertyDescriptor)) { 
        if (!parseRuntimeValue(oldDescriptor.writable)) {
          return falseV;
        }

        if (isFunctionRuntimeValue(oldDescriptor.set)) {
          const fnRv = oldDescriptor.set;
          return parseFunctionCallRuntimeValue(
            fnRv.getDefinedEnv(),
            createRuntimeValueAst(fnRv, `${attr}_setter`),
            createRuntimeValueAst(this, 'this'),
            createRuntimeValueAst(rv),
          )
        }
      } else {
        this.propertyDescriptors.set(attr, new PropertyDescriptor({
          value: rv,
        }))
      }
    } else if (isInstanceOf(descriptor , PropertyDescriptor)) {
      this.propertyDescriptors.set(attr, descriptor)
    }
    if (attr !== RUNTIME_LITERAL.$__proto__) {
      this.value[attr] = rv;
    } else {
      this.restConfig[proto] = rv;
    }
    return trueV
  }

  keys() {
    return [...this.propertyDescriptors.keys()]
  }

  setProto(rv) {
    if (!isInstanceOf(rv, RuntimeRefValue)) {
      throw new Error('原型链指向失败')
    }
    this.restConfig[proto] = rv;
  }

  setProtoType(rv) {
    if (!isInstanceOf(rv, RuntimeRefValue)) {
      throw new Error('原型链指向失败')
    }
    this.restConfig[_prototype] = rv;
  }

  getProtoType() {
    return this.restConfig[_prototype] ?? undefinedV;
  }

  getProto() {
    return this.restConfig[proto] ?? undefinedV;
  }

  getSuperProto() {
    return this.restConfig[superproto] ?? undefinedV;
  }

  getDefinedAst() {
    return this.value[symbolAst]
  }

  getDefinedEnv() {
    return this.value[symbolEnv]
  }

  getDefinedName() {
    return this.value[symbolName]
  }

  getMergeCtor() {
    return this.value[symbolMergeNewCtor] ?? undefinedV;
  }

  setMergeCtor(rv) {
    return this.value[symbolMergeNewCtor] = rv;
  }
}


export function createString(attr) {
  return new RuntimeValue(RUNTIME_VALUE_TYPE.string, attr);
}

const nullV = new RuntimeValue(RUNTIME_VALUE_TYPE.null, null);
export function getNullValue() {
  return nullV;
}




const undefinedV = new RuntimeValue(RUNTIME_VALUE_TYPE.undefined, undefined);
export function getUndefinedValue() {
  return undefinedV;
}

export const describeNativeFunction = (env, proto, ObjectPrototypeV) => (name, nativeFnCb, rest) => {
  const ret = new RuntimeRefValue(RUNTIME_VALUE_TYPE.function, {
  [RuntimeValue.symbolAst]: {
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
    ...(rest || {}),
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "Literal",
            value: "[native code] of " + name,
            raw: `'[native code] of ${name}'`
          },
        }
      ],
    },
  },
  [RuntimeValue.symbolEnv]: env,
  [RuntimeValue.symbolName]: name,
}, {
  [RuntimeValue.proto]: proto
})
ret.setProtoType(new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, {
  constructor: ret,
}, {
  [RuntimeValue.proto]: ObjectPrototypeV,
}))
return ret;
}

export function describeNativeClassAst(name, superName) {
  return {
    "type": "ClassDeclaration",
    "id": {
      "type": "Identifier",
      "name": name,
    },
    "superClass": superName ? {
      "type": "Identifier",
      "name": superName,
    } : null,
    "body": {
      "type": "ClassBody",
      "body": []
    }
  };
}

const trueV = new RuntimeValue(RUNTIME_VALUE_TYPE.boolean, true);

export function getTrueV() {
  return trueV;
}

const falseV = new RuntimeValue(RUNTIME_VALUE_TYPE.boolean, false);

export function getFalseV() {
  return falseV;
}


