import { PROPERTY_DESCRIPTOR_DICTS, RUNTIME_VALUE_DICTS } from "../../constant";
import PropertyDescriptor from "../PropertyDescriptor";
import { createNumber, createObject, createString, getFalseV, getGenerateFn, getUndefinedValue } from "../RuntimeValueInstance"
import parseRuntimeValue from "../parseRuntimeValue";
import { instanceOfRuntimeValue } from "../utils";

let NumberFunctionV = null;

let NumberPrototypeV = null

export function getNumberPrototypeV() {
  if (!NumberPrototypeV) {
    const generateFn = getGenerateFn();
    NumberPrototypeV = createObject({
      toFixed: generateFn('Number$toFixed', ([numberRv], {_this}) => {
        return createString(_this.value.toFixed(parseRuntimeValue(numberRv ?? getUndefinedValue())));
      }),
      valueOf: generateFn('Number$valueOf', ([], {_this}) => {
        return _this.get(RUNTIME_VALUE_DICTS.symbolPrimitiveValue)
      })
    })
  }
  return NumberPrototypeV
}

export function getNumberFunctionV() {
  if (!NumberFunctionV) {
    const generateFn = getGenerateFn();
    NumberFunctionV = generateFn('Number', ([rv], { _this }) => {
      const ret = createNumber(parseRuntimeValue(rv))
      if (parseRuntimeValue(instanceOfRuntimeValue(_this, NumberFunctionV))) {
        _this.set(RUNTIME_VALUE_DICTS.symbolPrimitiveValue, rv, new PropertyDescriptor({
          kind: PROPERTY_DESCRIPTOR_DICTS.REFLECT_DEFINE_PROPERTY,
          value: rv,
          [PROPERTY_DESCRIPTOR_DICTS.writable]: getFalseV(),
          [PROPERTY_DESCRIPTOR_DICTS.configurable]: getFalseV(),
          [PROPERTY_DESCRIPTOR_DICTS.enumerable]: getFalseV(),
        }))
      }
      return ret;
    })
    NumberFunctionV.setProtoType(getNumberPrototypeV())
  }

  return NumberFunctionV;
}