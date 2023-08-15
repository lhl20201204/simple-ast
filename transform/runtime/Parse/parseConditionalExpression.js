import parseAst from "..";
import parseRuntimeValue from "../Environment/parseRuntimeValue";

export default function parseConditionalExpression(ast, env) {
  const { test, consequent, alternate } = ast;
  if (parseRuntimeValue(parseAst(test, env))) {
    return parseAst(consequent, env)
  }
  return parseAst(alternate, env)
}