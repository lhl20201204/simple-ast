import { isInstanceOf } from "../../commonApi";
import generateCode from "../Generate";
import { DEBUGGER_DICTS, PROPERTY_DESCRIPTOR_DICTS, RUNTIME_LITERAL, RUNTIME_VALUE_DICTS, RUNTIME_VALUE_TYPE } from "../constant";
import PropertyDescriptor from "./PropertyDescriptor";
import { getFalseV, getNullValue, getTrueV, getUndefinedValue } from "./RuntimeValueInstance";
import parseRuntimeValue from "./parseRuntimeValue";
import { createRuntimeValueAst, createSimplePropertyDescriptor, isFunctionRuntimeValue, isUndefinedRuntimeValue, parseFunctionCallRuntimeValue } from "./utils";

const {
  symbolOriginClassAst,
  proto,_prototype, symbolAst, symbolEnv, symbolName, symbolMergeNewCtor} = RUNTIME_VALUE_DICTS;



let innerTransformId = 0;

export default class RuntimeValue {
  static id = 0;

  static isTransforming = false

  constructor(type, value, restConfig = {}) {
    this.id = RuntimeValue.isTransforming ?
      'inner' + innerTransformId++
      : RuntimeValue.id++;
    this.type = type;

    this.value = value;
    this.restConfig = restConfig;
  }

  getPropertyDescriptor(attr) {
    const base = this.getBaseHasProperty(attr)
    if (!base) {
      return undefined;
    }
    return base.propertyDescriptors?.get(attr)
  }

  getOwnPropertyDescriptor(attr) {
    return this.propertyDescriptors?.get(attr)
  }

  isAttrEnumerable(attr) {
    return _.get(this.getOwnPropertyDescriptor(attr), PROPERTY_DESCRIPTOR_DICTS.enumerable) === getTrueV()
  }

  hasOwnProperty(attr) {
    return false;
  }

  keys() {
    // TODO string类型是有的
    throw new Error('非引用对象没有keys')
  }

  delete(attr) {
    // console.error('delete', attr);
    const v = Reflect.deleteProperty(this.value, attr)
    if (isInstanceOf(this, RuntimeRefValue)) {
      const descriptor = this.propertyDescriptors.get(attr)
      if (descriptor) {
        this.propertyDescriptors.delete(attr)
      }
    }
    return new RuntimeValue(RUNTIME_VALUE_TYPE.boolean, v)
  }

  get(attr) {
    if ([RUNTIME_VALUE_TYPE.symbol].includes(this.type)) {
      if (attr === RUNTIME_LITERAL.$__proto__) {
        return this.getProto();
      }
      if (this.getProto().hasOwnProperty(attr)) {
        return this.getProto().get(attr);
      }
    }
    return getUndefinedValue();
  }

  getProto() {
    return this.restConfig[proto] ?? getUndefinedValue();
  }

  getBaseHasProperty() {
    return null;
  }

}

export class RuntimeRefValue extends RuntimeValue {
  constructor(...args) {
    super(...args)
    let flag = false;
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
      flag = true;
      // const ast = this.value[symbolAst];
    }
    const oldPropertyDescriptors = this.restConfig[RUNTIME_VALUE_DICTS.$propertyDescriptors];
    this.propertyDescriptors = oldPropertyDescriptors ?? new Map();

    if (!oldPropertyDescriptors) {
      // 这里底层调用方法时再特殊处理
      _.forEach(this.value, (v, k) => {
        this.propertyDescriptors.set(k, createSimplePropertyDescriptor({
          value: v,
        }))
      })
    }


    if (Reflect.has(this.restConfig, proto)) {
      if (!isInstanceOf(this.restConfig[proto], RuntimeValue)) {
        throw new Error('原型链初始化失败')
      }
    }
    if (Reflect.has(this.restConfig, _prototype)) {
      if (!isInstanceOf(this.restConfig[_prototype], RuntimeValue)) {
        throw new Error('原型链初始化失败')
      }
      this.propertyDescriptors.set(RUNTIME_LITERAL.$prototype, createSimplePropertyDescriptor({
        value: this.restConfig[_prototype],
        [PROPERTY_DESCRIPTOR_DICTS.enumerable]: getFalseV(),
      }))
    }
    if (flag) {
      Reflect.defineProperty(this, RUNTIME_VALUE_DICTS._sourceCode, {
        enumerable: true,
        configurable: false,
        get: () => parseRuntimeValue(this, {
          [DEBUGGER_DICTS.isOutputConsoleFlag]: true
        }),
      })
    }
    // console.log(this.propertyDescriptors);
  }

  setType(type) {
    this.type = type
  }

  setOriginClassAst(ast) {
    this.value[symbolOriginClassAst] = ast;
  }

  hasOwnProperty(attr) {
    return this.propertyDescriptors.has(attr)
  }

  isAttrUnWritable(attr) {
    return this.hasOwnProperty(attr) && 
    this.propertyDescriptors.get(attr)?.isPropertyDescriptorUnWritable()
    // [PROPERTY_DESCRIPTOR_DICTS.writable] === getTrueV()
  }

  isAttrConfigurable(attr) {
    return this.hasOwnProperty(attr) && this.propertyDescriptors.get(attr)[PROPERTY_DESCRIPTOR_DICTS.configurable] === getTrueV()
  }

  getBaseHasProperty(attr) {
    if (this.hasOwnProperty(attr)) {
      return this;
    }
    // console.log(this.restConfig[proto])
    return this.restConfig[proto] && this.getProto().getBaseHasProperty(attr)
  }


  get(attr) {
    // if (attr === 'a') {
    //   // console.log(this);
    //   console.error(attr, this.hasOwnProperty(attr), this)
    // }


    // if (attr === RUNTIME_LITERAL.$__proto__) {
    //   // todo这里很怪
    //   if (this.type === RUNTIME_VALUE_TYPE.super) {
    //     // console.error('enter');
    //     throw new Error('错误表达式');
    //   }
    //   return this.getProto()
    // }

    // if (attr === RUNTIME_LITERAL.$prototype) {
    //   return this.getProtoType()
    // }

    const base = this.getBaseHasProperty(attr)

    if (!base || base === getNullValue()) {
      return getUndefinedValue()
    }

    const descriptor = base.getOwnPropertyDescriptor(attr)

    if (!isInstanceOf(descriptor, PropertyDescriptor)) {
      throw new Error('没有属性描述器')
    }

    if (Reflect.has(descriptor, RUNTIME_LITERAL.get)) {
      if (isFunctionRuntimeValue(descriptor.get)) {
        const fnRv = descriptor.get;
        // console.log('begin---call')
        return parseFunctionCallRuntimeValue(
          fnRv.getDefinedEnv(),
          createRuntimeValueAst(fnRv, `${attr}_getter`),
          createRuntimeValueAst(this, 'this'), // 这里绑定的是this
        )
      } else {
        // console.warn(this, descriptor, attr);
        return getUndefinedValue()
      }
    }
    // 没有get属性， 则直接获取value
    return descriptor.value;


    if (this.hasOwnProperty(attr)) {
      const descriptor = this.propertyDescriptors.get(attr)
      if (isInstanceOf(descriptor, PropertyDescriptor)) {
        if (Reflect.has(descriptor, RUNTIME_LITERAL.get)) {
          if (isFunctionRuntimeValue(descriptor.get)) {
            const fnRv = descriptor.get;
            // console.log('begin---call')
            return parseFunctionCallRuntimeValue(
              fnRv.getDefinedEnv(),
              createRuntimeValueAst(fnRv, `${attr}_getter`),
              createRuntimeValueAst(this, 'this'),
            )
          } else {
            // console.warn(this, descriptor, attr);
            return getUndefinedValue()
          }
        }
      }
    }


    // const target = this.getBaseHasProperty(attr);

    // if (attr === RUNTIME_LITERAL.$prototype) {
    //   return this.getProtoType()
    // }

    if (this.type === 'null') {
      return getUndefinedValue()
    }
    // 如果当前对象找不到，就往原型链上查找, 直到为空。
    if (this.hasOwnProperty(attr)) {
      // TODO 这个逻辑后面再修复
      // 比如 a = [0] a[2] = 1; 此时获取a[1]
      return this.value[attr] ?? getUndefinedValue();
    }

    if (this.restConfig[proto]) {
      // console.log('原型链', this, this.getProto(), attr)
      return this.getProto().get(attr)
    }
    // 否则返回undefined；
    return getUndefinedValue()
  }

  setWithDescriptor(attr, rv, descriptor) {
    if (descriptor && !isInstanceOf(descriptor, PropertyDescriptor)) {
      throw new Error('必须传PropertyDescriptor实例对象')
    }
    return this.set(attr, rv, descriptor ?? createSimplePropertyDescriptor({
      value: rv,
    }))
  }

  set(attr, rv, descriptor) {
    // 更改原型链上的属性值。
    // console.log(attr, rv, descriptor)
    if (!isInstanceOf(descriptor, PropertyDescriptor)) {
      console.error('enter', this, attr, rv, descriptor);
      throw new Error('必须传PropertyDescriptor实例对象')
      // const oldDescriptor = this.propertyDescriptors.get(attr)
      // if (isInstanceOf(oldDescriptor , PropertyDescriptor)) { 
      //   if (!parseRuntimeValue(oldDescriptor[PROPERTY_DESCRIPTOR_DICTS.writable])) {
      //     return getFalseV();
      //   }

      //   if (isFunctionRuntimeValue(oldDescriptor.set)) {
      //     const fnRv = oldDescriptor.set;
      //     return parseFunctionCallRuntimeValue(
      //       fnRv.getDefinedEnv(),
      //       createRuntimeValueAst(fnRv, `${attr}_setter`),
      //       createRuntimeValueAst(this, 'this'),
      //       createRuntimeValueAst(rv),
      //     )
      //   }

      //   if (!this.isAttrWritable(attr)) {
      //     return getFalseV()
      //   }
      // } else {
      //   this.propertyDescriptors.set(attr, createSimplePropertyDescriptor({
      //     value: rv,
      //   }))
      // }
    }

    const oldDescriptor = this.getPropertyDescriptor(attr);

    // if (attr === 'a') {
    //   console.log('change',
    //    this, attr, oldDescriptor, descriptor,
    //    descriptor.hasAttr(RUNTIME_LITERAL.set)
    //    )
    // }
    // 如果有set，get， 则修改base， 否则修改自身。
    if (attr !== RUNTIME_VALUE_DICTS.proto) {
      if (
         oldDescriptor 
        && oldDescriptor.isHaveSetterOrGetter()) {
        const base = this.getBaseHasProperty(attr)
        base.propertyDescriptors.set(attr, descriptor)
      } else {
        this.propertyDescriptors.set(attr, descriptor);
      }
    }
   
    if (oldDescriptor && this.isAttrUnWritable(attr)) {
      return getFalseV();
    }

    // set a() {};

    // 如果有set
    if (descriptor.isShouldTriggerSet()) {
      // console.error('进来', attr, rv);
      const fnRv = descriptor.getAttr(RUNTIME_LITERAL.set);
      if (isFunctionRuntimeValue(fnRv)) {
       
        const newRv = parseFunctionCallRuntimeValue(
          fnRv.getDefinedEnv(),
          createRuntimeValueAst(fnRv, `${attr}_setter`),
          createRuntimeValueAst(this, 'this'),
          createRuntimeValueAst(rv),
        );
         // debug用，可加可不加
        if (attr !== RUNTIME_VALUE_DICTS.proto) {
          this.value[attr] = newRv;
        }
      } else {
        return getFalseV()
      }
    }


    // if (oldDescriptor && isFunctionRuntimeValue(descriptor.set) && attr !== RUNTIME_LITERAL.$__proto__) {
    //   const fnRv = descriptor.set;
    //   this.value[attr] = parseFunctionCallRuntimeValue(
    //     fnRv.getDefinedEnv(),
    //     createRuntimeValueAst(fnRv, `${attr}_setter`),
    //     createRuntimeValueAst(this, 'this'),
    //     createRuntimeValueAst(rv),
    //   )
    //   return;
    // }

    if (attr !== RUNTIME_LITERAL.$__proto__) {
      this.value[attr] = rv;
    } else {
      this.setProto(rv)
    }

    return getTrueV()
  }

  keys() {
    return [...this.propertyDescriptors.keys()]
  }

  setProto(rv) {
    // console.log(rv, getNullValue())
    if (!(isInstanceOf(rv, RuntimeRefValue) || rv === getNullValue())) {
      throw new Error('原型链指向失败')
    }
    this.restConfig[proto] = rv;
  }

  setProtoType(rv) {
    if (!isInstanceOf(rv, RuntimeRefValue)) {
      throw new Error('原型链指向失败')
    }
    this.restConfig[_prototype] = rv;
    // TODO 可能要加点限制
    this.propertyDescriptors.set(RUNTIME_LITERAL.$prototype, createSimplePropertyDescriptor({
      value: rv,
      [PROPERTY_DESCRIPTOR_DICTS.enumerable]: getFalseV(),
    }))
  }

  getProtoType() {
    return this.restConfig[_prototype] ?? getUndefinedValue();
  }

  getProto() {
    return this.restConfig[proto] ?? getUndefinedValue();
  }


  getDefinedAst() {
    return this.value[symbolOriginClassAst] ?? this.value[symbolAst]
  }

  getDefinedEnv() {
    return this.value[symbolEnv]
  }

  getDefinedName() {
    return this.value[symbolName]
  }

  getMergeCtor() {
    return this.value[symbolMergeNewCtor] ?? getUndefinedValue();
  }

  $privateMergeCtorFunctionType = null;

  getMergeCtorFunctionType() {
    if (!this.$privateMergeCtorFunctionType) {
      let origin = this.getMergeCtor()
      if (origin !== getUndefinedValue()) {
        origin = _.cloneDeep(origin)
        origin.setType(RUNTIME_VALUE_TYPE.function);
        origin.value[symbolOriginClassAst] = undefined;
        _.forEach(origin.keys(), attr => {
          if (attr === RUNTIME_LITERAL.$prototype) {
            return
          }
          origin.propertyDescriptors.delete(attr);
        })
        console.log(origin);
      }
      this.$privateMergeCtorFunctionType = origin;
    }
    return this.$privateMergeCtorFunctionType ;
  }

  setMergeCtor(rv) {
    // this.value[symbolAst] = createRuntimeValueAst(rv)
    return this.value[symbolMergeNewCtor] = rv;
  }
}
