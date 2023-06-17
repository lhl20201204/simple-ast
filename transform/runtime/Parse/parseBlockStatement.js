import parseAst from "..";
import { getNullValue, getUndefinedValue } from "../Environment/RuntimeValue";
import { geStatement } from "./parseProgram";

export default function parseBlockStatement(ast, env) {
  const stats = geStatement(ast.body)
  let value = getUndefinedValue()
  for(const s of stats) {
     parseAst(s, env);
    if (env.hadReturn()) {
      value = env.getReturnValue()
      break;
    }
    if (env.hadBreak() || env.hadContinue()) {
      break;
    }
  }
  return value;
}