import RuntimeValue from "../Environment/RuntimeValue";
import { createNumber, createString, getFalseV, getNullValue, getTrueV, getUndefinedValue } from "../Environment/RuntimeValueInstance";
import { JS_TO_RUNTIME_VALUE_TYPE, RUNTIME_VALUE_TYPE } from "../constant";

export default function parseLiteral(ast) {
  const { value, valueType, raw } = ast;
  if (raw === 'null') {
    return getNullValue()
  } 
  if (raw === 'true' && JS_TO_RUNTIME_VALUE_TYPE(value) === RUNTIME_VALUE_TYPE.boolean && value) {
    return getTrueV()
  } 
  
  if (raw === 'false' && JS_TO_RUNTIME_VALUE_TYPE(value) === RUNTIME_VALUE_TYPE.boolean && !value) {
    return getFalseV()
  } 
  
  if (raw === 'undefined' && JS_TO_RUNTIME_VALUE_TYPE(value) === RUNTIME_VALUE_TYPE.undefined && _.isUndefined(value)) {
    return getUndefinedValue()
  }
  const v = (valueType === 'number'
  || (+raw === +value)
  ) ? Number(value) : value;
  const newType = JS_TO_RUNTIME_VALUE_TYPE( v)

  if (newType === RUNTIME_VALUE_TYPE.string) {
    return createString(v)
  }

  if (newType === RUNTIME_VALUE_TYPE.number) {
    return createNumber(v)
  }

  return new RuntimeValue(newType, v)
}