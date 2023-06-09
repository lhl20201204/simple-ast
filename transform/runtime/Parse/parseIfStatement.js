import parseAst from "..";
import { getNullValue } from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { geStatement } from "./parseProgram";

export default function parseIfStatement(ast, env) {
   const { test, consequent, alternate } = ast;
   if (parseRuntimeValue(parseAst(test, env))) {
    parseAst(consequent, env)
   } else if (alternate) {
    parseAst(alternate, env)
   }
   return getNullValue();
}
