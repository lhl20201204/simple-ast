import { createString } from "../Environment";

export default function parseTemplateElement(ast, env) {

  return createString(ast.value.raw);
}