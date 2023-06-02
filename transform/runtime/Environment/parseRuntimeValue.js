import { AST } from "../../getAst";
import RuntimeValue from "./RuntimeValue";

export default function parseRuntimeValue(rv) {
  if (!(rv instanceof RuntimeValue)) {
    return rv;
  }
  const value = rv.value
  if (Array.isArray(value)) {
    return _.map(value, item => parseRuntimeValue(item))
  }

  if (rv.type === 'function') {
    const funast = rv.value;
    if (['FunctionDeclaration', 'FunctionExpression'].includes(funast.type)) {
      return AST.testingCode.slice(funast.start, funast.end + 1);
    }
    return `[function native code]`
  }
  if (_.isObject(value)) {
    return _.reduce(value, (o, v, k) => Object.assign(o, {[k]: parseRuntimeValue(v) }) ,{})
  }
  return value;
}