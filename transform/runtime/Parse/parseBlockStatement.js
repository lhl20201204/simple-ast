import parseAst from "..";
import { isInstanceOf } from "../../commonApi";
import RuntimeValue from "../Environment/RuntimeValue";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";
import { AST_DICTS } from "../constant";
import { getStatement } from "./parseProgram";
export default function parseBlockStatement(ast, env) {
    const stats = getStatement(ast.body, env)
    const $config = _.get(ast, AST_DICTS._config);
    const beforeHook = _.get($config, AST_DICTS.beforeHook);
    const afterHook = _.get($config, AST_DICTS.afterHook)
    let value = getUndefinedValue()
    // 设置前置钩子和后置钩子，方便生成器从外部中断程序。
    if (_.isFunction(beforeHook)) {
     beforeHook(ast, env);
     if (env.hadReturn()){
      return env.getReturnValue();
     }
    }
    for(const s of stats) {
      parseAst(s, env);
      if (env.hadReturn()) {
        value = env.getReturnValue()
        break;
      }
      if (env.hadBreak() || env.hadContinue()) {
        break;
      }
    }
    if (_.isFunction(afterHook)) {
      const t = afterHook(ast, env);
      if (isInstanceOf(t, RuntimeValue)) {
        value = t;
      }
    }
    return value;
}