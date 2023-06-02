import parseAst from "..";
import RuntimeValue from "../Environment/RuntimeValue"

class ArrayLike{
  constructor(...args) {
    return new Array(...args);
  }
}

export default function parseArrayExpression(ast, env) {
  const arr = new ArrayLike();
  _.forEach(ast.elements, a => {
    arr.push(parseAst(a, env))
  })
  return new RuntimeValue('array', arr);
}