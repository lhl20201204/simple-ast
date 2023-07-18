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
  }) {
    if (!_.isNil(get) && !_.isNil(value)) {
      throw new Error('get ')
    }
   const undefinedRv = getUndefinedValue();
   const trueV = getTrueV()
   this.configurable = configurable ?? trueV
   this.enumerable = enumerable ?? trueV
   this.value = value ?? undefinedRv
   this.writable = writable ?? trueV
   this.set = set ?? undefinedRv
   this.get = get ?? undefinedRv
  }

  setRuntimeValue(kind, rv) {
    if (!(rv instanceof RuntimeValue)) {
      throw new Error('rv 必须是 runtimeValue')
    }
    this[kind] = rv;
  }
}