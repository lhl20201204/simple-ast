import RuntimeValue from "../Environment/RuntimeValue";

export default function parseTemplateElement(ast, env) {
  return new RuntimeValue('string', ast.value.raw);
}