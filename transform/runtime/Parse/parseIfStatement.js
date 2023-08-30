import parseAst from "..";
import Environment from "../Environment";
import { getNullValue } from "../Environment/RuntimeValueInstance";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { ENV_DICTS } from "../constant";
import { getStatement } from "./parseProgram";

export default function parseIfStatement(ast, env) {
   const { test, consequent, alternate } = ast;
   const childEnv = new Environment('if statement of body', env, {
      [ENV_DICTS.noNeedLookUpVar]: true
   })
   if (parseRuntimeValue(parseAst(test, env))) {
    parseAst(consequent, childEnv)
   } else if (alternate) {
    parseAst(alternate, childEnv)
   }
   return getNullValue();
}
