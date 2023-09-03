import { PROPERTY_DESCRIPTOR_DICTS, RUNTIME_VALUE_DICTS } from "../../constant";
import PropertyDescriptor from "../PropertyDescriptor";
import { createNumber, createObject, createString, getFalseV, getGenerateFn, getUndefinedValue } from "../RuntimeValueInstance"
import parseRuntimeValue from "../parseRuntimeValue"
import { instanceOfRuntimeValue } from "../utils";

let stringPrototyepRv = null

let stringFunctionRv = null;

export  function getStringProtoTypeV() {
  if (!stringPrototyepRv) {
    const generateFn = getGenerateFn()
    stringPrototyepRv = createObject({
      at: generateFn('String$at', ([numRv], { _this }) => {
        return createString(_this.value[parseRuntimeValue(numRv ?? createNumber(0))])
      }),
      slice:  generateFn('String$slice', ([startRv, endRv], { _this }) => {
        return createString(_this.value.slice(parseRuntimeValue(startRv ?? getUndefinedValue()), parseRuntimeValue(endRv ?? getUndefinedValue()) ))
      }),
      valueOf: generateFn('String$valueOf', ([], {_this}) => {
        return _this.get(RUNTIME_VALUE_DICTS.symbolPrimitiveValue)
      })
    })
  }
  return stringPrototyepRv;
}

export function getStringFunctionV() {
  if (!stringFunctionRv) {
    const generateFn = getGenerateFn();
    stringFunctionRv = generateFn('String', ([rv], { _this }) => {
      const ret = createString(parseRuntimeValue(rv))
      if (parseRuntimeValue(instanceOfRuntimeValue(_this, stringFunctionRv))) {
        _this.set(RUNTIME_VALUE_DICTS.symbolPrimitiveValue, rv, new PropertyDescriptor({
          kind: PROPERTY_DESCRIPTOR_DICTS.REFLECT_DEFINE_PROPERTY,
          value: rv,
          [PROPERTY_DESCRIPTOR_DICTS.writable]: getFalseV(),
          [PROPERTY_DESCRIPTOR_DICTS.configurable]: getFalseV(),
          [PROPERTY_DESCRIPTOR_DICTS.enumerable]: getFalseV(),
        }))
        const len = createNumber(parseRuntimeValue(rv).length);
        _this.set('length', len, new PropertyDescriptor({
          kind: PROPERTY_DESCRIPTOR_DICTS.REFLECT_DEFINE_PROPERTY,
          value: len,
          [PROPERTY_DESCRIPTOR_DICTS.writable]: getFalseV(),
          [PROPERTY_DESCRIPTOR_DICTS.configurable]: getFalseV(),
          [PROPERTY_DESCRIPTOR_DICTS.enumerable]: getFalseV(),
        }))
      }
      return ret;
    })
    stringFunctionRv.setProtoType(getStringProtoTypeV())
  }
  return stringFunctionRv;
}