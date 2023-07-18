import parseAst from "..";
import Environment from "../Environment";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { instanceOfRuntimeValue } from "../Environment/utils";

export default function parseThrowStatement(ast, env) {
  const rv = parseAst(ast.argument, env);
  if (instanceOfRuntimeValue(rv, Environment.windowRv.get('Error'))) {
    throw new Error(`${parseRuntimeValue(rv.get('message'))}`);
  }
}