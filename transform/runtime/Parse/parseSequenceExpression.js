import parseAst from "..";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";

export default function parseSequenceExpression(ast, env) {
  let retRv = getUndefinedValue()
  for(const x of ast.expressions) {
    retRv = parseAst(x, env)
  }
  return retRv;
}