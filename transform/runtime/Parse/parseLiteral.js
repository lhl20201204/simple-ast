import RuntimeValue from "../Environment/RuntimeValue";

export default function parseLiteral(ast) {
  const { value, valueType, raw } = ast;
  const v = (valueType === 'number'
  || (+raw === +value)
  ) ? Number(value) : value;
  return new RuntimeValue(typeof v, v)
}