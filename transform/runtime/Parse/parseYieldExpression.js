import parseAst from "..";
import { isInstanceOf } from "../../commonApi";
import RuntimeValue from "../Environment/RuntimeValue";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";
import { AST_DICTS, GENERATOR_DICTS, RUNTIME_LITERAL } from "../constant";

export function isYieldError(e) {
  return isInstanceOf(e[GENERATOR_DICTS.yieldInnerRuntimeValue], RuntimeValue)
}

export function getYieldValue(e) {
  return e[GENERATOR_DICTS.yieldInnerRuntimeValue];
}

export function setYieldValue(e, rv) {
  e[GENERATOR_DICTS.yieldInnerRuntimeValue] =  rv;
}

export function getYieldEnv(e) {
  return e[GENERATOR_DICTS.yieldInnerEnv];
}

export function setYieldEnv(e, env) {
  e[GENERATOR_DICTS.yieldInnerEnv] = env;
}

export default function parseYieldExpression(ast, env) {
  if (!env.isInGeneratorEnv()) {
    throw new Error('当前不在生成器函数定义范围内无法' + RUNTIME_LITERAL.yield)
  }

  if (ast.delegate) { // todo 先做单个的后续看能不能再实现

  } else {
    const yieldRv = ast.argument ? parseAst(ast.argument, env) : getUndefinedValue();
    const astConfig = _.get(ast, AST_DICTS._config);
    if (astConfig.getNeedReceiveNextValue()) {
      // console.log('yield 接受值', env.getNextValue());
      return env.getNextValue();
    }
    // env.setYieldValue(yieldRv);
    // yield 关键字底层用Error抛出处理；
    const e = new Error('yield 中断停止');
    // 设置唯一标志符
    setYieldValue(e, yieldRv);
    setYieldEnv(e, env);
    // console.error('yield值', yieldRv, e.getYieldRuntimeValue());
    astConfig.setNeedReceiveNextValue(true);
    throw e;
  }
}