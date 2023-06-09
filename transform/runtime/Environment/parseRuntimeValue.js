import { AST } from "../../getAst";
import generateCode from "../Generate";
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
    const funast = rv.value.ast;
    if (['FunctionDeclaration', 'FunctionExpression'].includes(funast.type)) {
      return generateCode(funast, { text: true });
    }
    return `function(){[native code]}`
  }
  if (_.isObject(value)) {
    return _.reduce(value, (o, v, k) => Object.assign(o, {[k]: parseRuntimeValue(v) }) ,{})
  }
  return value;
}