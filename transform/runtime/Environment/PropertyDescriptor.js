import _ from "lodash";
import RuntimeValue, { getTrueV, getUndefinedValue } from "./RuntimeValue";

export default class PropertyDescriptor{
  constructor({
    configurable,
        enumerable,
        value,
        writable,
        set,
        get,
  }, oldPropertyDescriptor) {
    if (!_.isNil(get) && !_.isNil(value)) {
      throw new Error('get ')
    }
   const undefinedRv = getUndefinedValue();
   const trueV = getTrueV()
   this.configurable = configurable ?? oldPropertyDescriptor?.configurable ?? trueV
   this.enumerable = enumerable ?? oldPropertyDescriptor?.enumerable ?? trueV
   this.value = value ?? oldPropertyDescriptor?.value ?? undefinedRv
   this.writable = writable ?? oldPropertyDescriptor?.writable ?? trueV
   this.set = set ?? oldPropertyDescriptor?.set ?? undefinedRv
   this.get = get ?? oldPropertyDescriptor?.get ??undefinedRv
  }

  setRuntimeValue(kind, rv) {
    if (!(rv instanceof RuntimeValue)) {
      throw new Error('rv 必须是 runtimeValue')
    }
    this[kind] = rv;
  }
}