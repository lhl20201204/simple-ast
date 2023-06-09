import { AST } from "../../getAst";
import RuntimeValue from "./RuntimeValue";

export default function getEqualValue(rv) {
  if (!(rv instanceof RuntimeValue)) {
    console.error('运行出错')
    return rv;
  }
  if (['function', 'object', 'array'].includes(rv.type)) {
    return rv;
  }
  if (['boolean', 'null', 'undefined', 'number', 'string'].includes(rv.type)) {
    return rv.value;
  }
  console.error(rv);
  throw new Error(`为处理的类型 ${rv.type}`)
}