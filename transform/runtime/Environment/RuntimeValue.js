import { isInstanceOf } from "../../commonApi";
import generateCode from "../Generate";
import { DEBUGGER_DICTS, GENERATOR_DICTS, PROPERTY_DESCRIPTOR_DICTS, RUNTIME_LITERAL, RUNTIME_VALUE_DICTS, RUNTIME_VALUE_TYPE } from "../constant";
import createGenerateConfig from "./Generator";
import GeneratorConfig from "./Generator/GeneratorConfig";
import { getBooleanPrototypeRv } from "./NativeRuntimeValue/boolean";
import getGeneratorRv from "./NativeRuntimeValue/generator";
import { getNumberPrototypeV } from "./NativeRuntimeValue/number";
import { getStringProtoTypeV } from "./NativeRuntimeValue/string";
import PropertyDescriptor from "./PropertyDescriptor";
import { createConfigRuntimeValue, createNumber, getFalseV, getNullValue, getTrueV, getUndefinedValue } from "./RuntimeValueInstance";
import parseRuntimeValue from "./parseRuntimeValue";
import { createArrowFunctionCallExpressionAst, createRuntimeValueAst, createSimplePropertyDescriptor, createUseRuntimeValueAst, isFunctionRuntimeValue, isUndefinedRuntimeValue, parseFunctionCallRuntimeValue } from "./utils";

const {
  symbolOriginClassAst,
  proto, _prototype, symbolAst, symbolEnv, symbolName, symbolMergeNewCtor, symbolOriginGeneratorAst } = RUNTIME_VALUE_DICTS;



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

    if ([RUNTIME_VALUE_TYPE.string,
        RUNTIME_VALUE_TYPE.number].includes(this.type)) {
      if (attr === 'length') {
        return createNumber(this.value.length)
      } else if (attr === RUNTIME_LITERAL.$__proto__) {
        return this.getProto()
      } else {
        return this.getProto().get(attr);
      }
    }

    return getUndefinedValue();
  }

  getProto() {
    if (this.type === RUNTIME_VALUE_TYPE.string) {
      return getStringProtoTypeV()
    }
    if (this.type === RUNTIME_VALUE_TYPE.number) {
      return getNumberPrototypeV()
    }
    if (this.type === RUNTIME_VALUE_TYPE.boolean) {
      return getBooleanPrototypeRv()
    }
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
      if (!Reflect.has(this.restConfig, symbolAst)
        || !Reflect.has(this.restConfig, symbolEnv)
        || (
          !Reflect.has(this.restConfig, symbolName) &&
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
      // console.log(Object.getOwnPropertySymbols(this.value));
      _.forEach(this.value, (v, k) => {
        // if (this.id === 'inner27') {
        //   console.log(v, k)
        // }
        this.propertyDescriptors.set(k, createSimplePropertyDescriptor({
          value: v,
        }))
      })
      
      _.forEach(Object.getOwnPropertySymbols(this.value), (k) => {
        if (k === GENERATOR_DICTS.isGeneratorConfig) {
          return;
        }
        this.propertyDescriptors.set(k, createSimplePropertyDescriptor({
          value: this.value[k],
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
        enumerable: false,
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
    this.restConfig[symbolOriginClassAst] = ast;
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

  setWithDescriptor(attr, rv, descriptor = undefined) {
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

  setProtoType(rv, noWritable) {
    if (!isInstanceOf(rv, RuntimeRefValue)) {
      throw new Error('原型链指向失败')
    }
    this.restConfig[_prototype] = rv;
    // TODO 可能要加点限制
    this.propertyDescriptors.set(RUNTIME_LITERAL.$prototype, createSimplePropertyDescriptor({
      value: rv,
      [PROPERTY_DESCRIPTOR_DICTS.enumerable]: getFalseV(),
      [PROPERTY_DESCRIPTOR_DICTS.writable]: noWritable ?  getFalseV() : getTrueV()
    }))
  }

  getProtoType() {
    return this.restConfig[_prototype] ?? getUndefinedValue();
  }

  getProto() {
    return this.restConfig[proto] ?? getUndefinedValue();
  }

  getRunAst() {
    return this.restConfig[symbolAst] 
  }

  setRunAst(ast) {
    this.restConfig[symbolAst] = ast;
  }

  getDefinedAst() {
    return this.restConfig[symbolOriginGeneratorAst] 
    ?? this.restConfig[symbolOriginClassAst] 
    ?? this.restConfig[symbolAst] 
  }

  getDefinedEnv() {
    return this.restConfig[symbolEnv]
  }

  setDefinedEnv(x) {
    this.restConfig[symbolEnv] = x;
    // this.value[symbolEnv] = x;
  }

  getDefinedName() {
    return this.restConfig[symbolName] ?? ('匿名' + (this.type === RUNTIME_VALUE_TYPE.class ? '类' : '函数'))
  }

  getMergeCtor() {
    return  this.restConfig[symbolMergeNewCtor] 
         ?? this.value[symbolMergeNewCtor] 
         ?? getUndefinedValue();
  }

  $privateMergeCtorFunctionType = null;

  getMergeCtorFunctionType() {
    if (!this.$privateMergeCtorFunctionType) {
      let origin = this.getMergeCtor()
      if (origin !== getUndefinedValue()) {
        origin = _.cloneDeep(origin)
        origin.setType(RUNTIME_VALUE_TYPE.function);
        origin.restConfig[symbolOriginClassAst] = undefined;
        _.forEach(origin.keys(), attr => {
          if (attr === RUNTIME_LITERAL.$prototype) {
            return
          }
          origin.propertyDescriptors.delete(attr);
        })
        // console.log(origin);
      }
      this.$privateMergeCtorFunctionType = origin;
    }
    return this.$privateMergeCtorFunctionType;
  }

  setMergeCtor(rv) {
    // this.value[symbolAst] = createRuntimeValueAst(rv)
     this.value[symbolMergeNewCtor] = rv;
     this.restConfig[symbolMergeNewCtor] = rv;
     return rv;
  }
}

export class RuntimeArrayLikeValue extends RuntimeRefValue {
  constructor(...args) {
    super(...args)
  }

  resetAllValuePropertyDescriptor() {
    _.forEach(this.value, (v, i) => {
      this.setWithDescriptor(i, v)
    }) 
  }  
}

export class RuntimeGeneratorFunctionValue extends RuntimeRefValue {

  constructor(...args) {
    super(...args)
    const originArgs = _.cloneDeep(args);
    const originAst = this.getDefinedAst()
    const originName = this.getDefinedName();
    this.restConfig[symbolOriginGeneratorAst] = originAst;
    
    const defineEnv = this.getDefinedEnv();

   
    // console.log('开始定义', originName);
    // console.error(defineEnv);
    this.setRunAst({
      ..._.cloneDeep(originAst),
      body: {
        ..._.cloneDeep(originAst.body),
        body: [
          {
            type: "ReturnStatement",
            argument: createArrowFunctionCallExpressionAst([
              createUseRuntimeValueAst(0, { type: 'ThisExpression' }),
              createUseRuntimeValueAst(1, { type: 'Identifier', name: 'arguments' }),
              {
                "type": "ReturnStatement",
                "argument": {
                  "type": "NewExpression",
                  "callee": createRuntimeValueAst(getGeneratorRv(), 'Generator'),
                  "arguments": [
                    createRuntimeValueAst((env) => {
                      const ret = createConfigRuntimeValue(createGenerateConfig({
                        ast: _.cloneDeep(originAst),
                        name: originName,
                        contextEnv: env,
                        contextThis: env.getRuntimeValueByStackIndex(0),
                        contextArguments: env.getRuntimeValueByStackIndex(1),
                        GeneratorFunctionRv: this,
                      }))
                      // console.error('生成实例对象', ret);
                      return ret;
                    }, originAst )
                  ]
                }
              }
            ])
          }
        ]
      }
    }) 
    
    // console.error('声明一个生成器函数', generateCode(originAst), generateCode(this.restConfig[symbolAst]))
  }

}

export class RuntimeAyncGeneratorFunctionValue extends RuntimeGeneratorFunctionValue {
  
}

export class RuntimeGeneratorInstanceValue extends RuntimeRefValue {
  getGenerateConfig() {
    const ret = this.restConfig[RUNTIME_VALUE_DICTS.generatorConfig];
    if (!isInstanceOf(ret, GeneratorConfig)) {
      throw new Error('generatorConfig不对，运行时错误')
    }
    return ret;
  }

}

export class RuntimeConfigValue extends RuntimeRefValue {

}

let promiseId = 0
export class RuntimePromiseInstanceValue extends RuntimeRefValue {
  constructor(...args) {
    super(...args)
    this.promiseId = promiseId++;
  }
  getId() {
    return this.promiseId
  }
  setPromiseState(rv) {
    if (!isInstanceOf(rv, RuntimeValue)) {
      throw new Error('promise保存状态有问题');
    }
    this.setWithDescriptor(RUNTIME_VALUE_DICTS.PromiseState, rv);
  }
  setPromiseResult(rv) {
    if (!isInstanceOf(rv, RuntimeValue)) {
      console.warn(rv);
      throw new Error('promise保存结果有问题');
    }
    this.setWithDescriptor(RUNTIME_VALUE_DICTS.PromiseResult,rv);
  }
  getPromiseInstance() {
    const ret =  this.restConfig[RUNTIME_VALUE_DICTS.PromiseInstance]
    if (!isInstanceOf(ret, Promise)) {
      throw new Error('promise不对运行时错误')
    }
    return ret;
  }
}

export class RuntimeAwaitValue extends RuntimeValue {

}