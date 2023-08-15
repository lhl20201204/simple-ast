import parseAst from "..";
import Environment from "../Environment";
import { getWindowObject } from "../Environment/getWindow";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { instanceOfRuntimeValue } from "../Environment/utils";

export default function parseThrowStatement(ast, env) {
  const rv = parseAst(ast.argument, env);
  if (instanceOfRuntimeValue(rv, getWindowObject().get('Error'))) {
    const text = parseRuntimeValue(rv.get('message'))
    console.error(text, '----')
    throw new Error(`${text}`);
  }
}