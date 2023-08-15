import { createString } from "../Environment/RuntimeValueInstance";


export default function parseTemplateElement(ast, env) {

  return createString(ast.value.raw);
}