import parseAst from "..";
import { isInstanceOf } from "../../commonApi";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";
import { AST_DICTS } from "../constant";
import { getStatement } from "./parseProgram";
export default function parseBlockStatement(ast, env) {
    const stats = getStatement(ast.body, env)
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