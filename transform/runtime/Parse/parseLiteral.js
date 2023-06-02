import RuntimeValue from "../Environment/RuntimeValue";

export default function parseLiteral(ast) {
  const { value, valueType } = ast;
  return new RuntimeValue(valueType, valueType === 'number' ? Number(value) : value)
}