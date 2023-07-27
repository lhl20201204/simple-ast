import _ from "lodash";
import RuntimeValue, { getTrueV, getUndefinedValue } from "./RuntimeValue";
import { isFunctionRuntimeValue, isUndefinedRuntimeValue } from "./utils";
import generateCode from "../Generate";
import { isInstanceOf } from "../../commonApi";

export default class PropertyDescriptor{
  constructor({
    configurable,
        enumerable,
        value,
        writable,
        set,
        get,
  }, oldPropertyDescriptor) {
    const undefinedRv = getUndefinedValue();
    if ((!_.isNil(get) && get !== undefinedRv) && (!_.isNil(value) && value !== undefinedRv)) {
      console.error(get, value)
      throw new Error('get 和 value 不能同时定义')
    }
    configurable = configurable ?? oldPropertyDescriptor?.configurable
    enumerable = enumerable ?? oldPropertyDescriptor?.enumerable
    value = value ?? oldPropertyDescriptor?.value;
    writable = writable ?? oldPropertyDescriptor?.writable 
    set = set ?? oldPropertyDescriptor?.set;
    get = get ?? oldPropertyDescriptor?.get;

   const trueV = getTrueV()
   this.configurable = configurable ?? trueV
   this.enumerable = enumerable ?? trueV
   this.value = value ?? undefinedRv
   this.writable = writable ?? trueV
   this.set = set ?? undefinedRv
   this.get = get ??undefinedRv
   if (this.value !== undefinedRv && this.get !== undefinedRv) {
    //
    console.error('同时有get, value')
    if (get) {
      console.error('清空复制操作')
      this.value = undefinedRv;
    } else if (value) {
      this.get = undefinedRv;
    }
   } 
  }

  setRuntimeValue(kind, rv) {
    if (!isInstanceOf(rv, RuntimeValue)) {
      throw new Error('rv 必须是 runtimeValue')
    }
    this[kind] = rv;
    const undefinedRv = getUndefinedValue();
    if (kind === 'get' && rv !== undefinedRv) {
      this.value = undefinedRv
    } else if (kind === 'value' && rv !== undefinedRv ) {
      this.get = undefinedRv
    }
  }

  getAttr(attr) {
    return this[attr];
  }
}