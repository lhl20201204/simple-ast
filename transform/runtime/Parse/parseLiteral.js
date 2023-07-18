import RuntimeValue, {  getNullValue } from "../Environment/RuntimeValue";
import { JS_TO_RUNTIME_VALUE_TYPE } from "../constant";

export default function parseLiteral(ast) {
  const { value, valueType, raw } = ast;
  if (raw === 'null') {
    return getNullValue()
  }
  const v = (valueType === 'number'
  || (+raw === +value)
  ) ? Number(value) : value;
  return new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE( v), v)
}