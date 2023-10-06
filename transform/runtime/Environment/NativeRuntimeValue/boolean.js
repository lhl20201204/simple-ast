import { PROPERTY_DESCRIPTOR_DICTS, RUNTIME_VALUE_DICTS } from "../../constant";
import PropertyDescriptor from "../PropertyDescriptor";
import { createBoolean, createObject, getFalseV, getGenerateFn } from "../RuntimeValueInstance";
import parseRuntimeValue from "../parseRuntimeValue";
import { instanceOfRuntimeValue } from "../utils";

let BooleanFunctionRv;

let BooleanPrototypeRv;

export function getBooleanFunctionRv() {
  if (!BooleanFunctionRv) {
    const generateFn = getGenerateFn()
    BooleanFunctionRv = generateFn('Boolean', ([argsRv], {_this}) => {
      const ret = createBoolean(Boolean(parseRuntimeValue(argsRv)))
      if (parseRuntimeValue(instanceOfRuntimeValue(_this, BooleanFunctionRv))) {
        _this.set(RUNTIME_VALUE_DICTS.symbolPrimitiveValue, ret, new PropertyDescriptor({
          kind: PROPERTY_DESCRIPTOR_DICTS.REFLECT_DEFINE_PROPERTY,
          value: ret,
          [PROPERTY_DESCRIPTOR_DICTS.writable]: getFalseV(),
          [PROPERTY_DESCRIPTOR_DICTS.configurable]: getFalseV(),
          [PROPERTY_DESCRIPTOR_DICTS.enumerable]: getFalseV(),
        }))
      }
      return ret;
    })
    BooleanFunctionRv.setProtoType(getBooleanPrototypeRv())
  }
  return BooleanFunctionRv
}

export function getBooleanPrototypeRv() {
  if (!BooleanPrototypeRv) {
    const generateFn = getGenerateFn()
    BooleanPrototypeRv = createObject({
      valueOf: generateFn('Boolean$valueOf', ([], {_this}) => {
        return _this.get(RUNTIME_VALUE_DICTS.symbolPrimitiveValue)
      })
    })
  }
  return BooleanPrototypeRv;
}