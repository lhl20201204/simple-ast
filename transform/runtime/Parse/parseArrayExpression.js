import parseAst from "..";
import RuntimeValue, { RuntimeRefValue } from "../Environment/RuntimeValue"
import { createArray } from "../Environment/RuntimeValueInstance";
import { RUNTIME_VALUE_TYPE } from "../constant";

export default function parseArrayExpression(ast, env) {
  const arr = [];
  _.forEach(ast.elements, a => {
    const v = parseAst(a, env);
    if (a.type === 'SpreadElement') {
      arr.push(...v.value)
    } else {
      arr.push(v)
    }
  })
  return createArray(arr);
}