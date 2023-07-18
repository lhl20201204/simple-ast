import parseAst from "..";
import Environment from "../Environment";
import { getNullValue } from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { geStatement } from "./parseProgram";

export default function parseIfStatement(ast, env) {
   const { test, consequent, alternate } = ast;
   const childEnv = new Environment('if statement of body', env)
   if (parseRuntimeValue(parseAst(test, env))) {
    parseAst(consequent, childEnv)
   } else if (alternate) {
    parseAst(alternate, childEnv)
   }
   return getNullValue();
}
