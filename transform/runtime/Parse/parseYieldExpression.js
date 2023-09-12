import parseAst from "..";
import { isInstanceOf } from "../../commonApi";
import RuntimeValue from "../Environment/RuntimeValue";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";
import { GENERATOR_DICTS, RUNTIME_LITERAL } from "../constant";

export function isYieldError(e) {
  return isInstanceOf(e[GENERATOR_DICTS.yieldInnerField], RuntimeValue)
}

export function getYieldValue(e) {
  return e[GENERATOR_DICTS.yieldInnerField];
}

export default function parseYieldExpression(ast, env) {
  if (!env.isInGeneratorEnv()) {
    throw new Error('当前不在生成器函数定义范围内无法' + RUNTIME_LITERAL.yield)
  }

  if (ast.delegate) { // todo 先做单个的后续看能不能再实现

  } else {
    const yieldRv = ast.argument ? parseAst(ast.argument, env) : getUndefinedValue();
    env.setYieldValue(yieldRv);
    // yield 关键字底层用Error抛出处理；
    const e = new Error('yield 中断停止');
    // 设置唯一标志符
    e[GENERATOR_DICTS.yieldInnerField] = yieldRv;
    // console.error('yield值', yieldRv, e.getYieldRuntimeValue());
    throw e;
  }
}