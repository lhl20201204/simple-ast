import parseAst from "..";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";
import { AST_DICTS, GENERATOR_DICTS, RUNTIME_LITERAL } from "../constant";
import { setYieldEnv, setYieldValue } from "./parseYieldExpression";

export function isAwaitError(e) {
  return e[GENERATOR_DICTS.isAwaitError];
}

export function setIsAwaitError(e) {
  e[GENERATOR_DICTS.isAwaitError] = true;
}


export default function parseAwaitExpression(ast, env) {
  if (!env.isInAsyncEnv()) {
    throw new Error('当前不在async函数定义范围内无法' + RUNTIME_LITERAL.await)
  }

    const yieldRv = ast.argument ? parseAst(ast.argument, env) : getUndefinedValue();
    const astConfig = _.get(ast, AST_DICTS._config);
    if (astConfig.getNeedReceiveNextValue()) {
      // console.log('yield 接受值', env.getNextValue());
      return env.getNextValue();
    }
    // yield 关键字底层用Error抛出处理；
    const e = new Error('yield 中断停止');
    // 设置唯一标志符
    setIsAwaitError(e, )
    setYieldValue(e, yieldRv);
    setYieldEnv(e, env);
    // console.error('yield值', yieldRv, e.getYieldRuntimeValue());
    astConfig.setNeedReceiveNextValue(true);
    throw e;
}