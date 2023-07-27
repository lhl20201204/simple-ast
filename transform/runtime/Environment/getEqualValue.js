import { AST } from "../../getAst";
import { isInstanceOf } from "../../commonApi";
import { RUNTIME_VALUE_TYPE } from "../constant";
import RuntimeValue from "./RuntimeValue";

export default function getEqualValue(rv) {
  if (!(isInstanceOf(rv,RuntimeValue))) {
    console.error('运行出错', rv, typeof rv)
    return rv;
  }
  if ([
    RUNTIME_VALUE_TYPE.super,
    RUNTIME_VALUE_TYPE.function,
    RUNTIME_VALUE_TYPE.object,
    RUNTIME_VALUE_TYPE.array,
    RUNTIME_VALUE_TYPE.class,
    RUNTIME_VALUE_TYPE.arrow_func
   ].includes(rv.type)) {
    return rv;
  }
  if ([
    RUNTIME_VALUE_TYPE.boolean,
    RUNTIME_VALUE_TYPE.null,
    RUNTIME_VALUE_TYPE.number,
    RUNTIME_VALUE_TYPE.string,
    RUNTIME_VALUE_TYPE.undefined, 
   ].includes(rv.type)) {
    return rv.value;
  }
  console.error(rv);
  throw new Error(`未处理的类型 ${rv.type}`)
}