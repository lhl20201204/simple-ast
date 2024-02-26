import { createString } from "../Environment/RuntimeValueInstance";


export default function parseTemplateElement(ast, env) {
  // console.warn(ast.value.cooked);
  return createString(ast.value.cooked);
}