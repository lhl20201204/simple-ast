import parseAst from "..";
import { RuntimeAwaitValue } from "../Environment/RuntimeValue";
import { getWindowEnv } from "../Environment/getWindow";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { createRuntimeValueAst } from "../Environment/utils";
import { AST_DICTS, RUNTIME_VALUE_TYPE } from "../constant";
import { innerParseYieldExpression } from "./parseYieldExpression";

export default function parseSleepStatement(ast, env) {
  if (env !== getWindowEnv()) {
    throw new Error('sleep语句只能在window环境里使用');
  }
  if (!env.canSleepAble()) {
    throw new Error('使用sleep语句，必须在window顶层指定use sleep')
  }
  return innerParseYieldExpression({
    type: 'YieldExpression',
    delegate: false,
    argument: createRuntimeValueAst(new RuntimeAwaitValue(RUNTIME_VALUE_TYPE.number, parseRuntimeValue(parseAst(ast.argument,env)))),
    [AST_DICTS._config]: _.get(ast, AST_DICTS._config),
  }, env)
}