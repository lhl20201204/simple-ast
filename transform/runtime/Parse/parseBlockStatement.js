import parseAst from "..";
import { isInstanceOf } from "../../commonApi";
import AstConfig from "../Environment/Generator/AstConfig";
import RuntimeValue from "../Environment/RuntimeValue";
import { getUndefinedValue, runFunctionRuntimeValueInGlobalThis } from "../Environment/RuntimeValueInstance";
import { getWindowEnv, getWindowObjectRv } from "../Environment/getWindow";
import { createRuntimeValueAst, isFunctionRuntimeValue } from "../Environment/utils";
import generateCode from "../Generate";
import { AST_DICTS } from "../constant";
import { getStatement } from "./parseProgram";
import { isYieldError } from "./parseYieldExpression";
export default function parseBlockStatement(ast, env) {
  const isGeneratorEnv = env.canSleepAble() || env.isInGeneratorEnv();
  const run = () => {
    const stats = getStatement(ast.body, env)
    const astConfig = _.get(ast, AST_DICTS._config);
    let value = getUndefinedValue()

    for (const s of stats) {
      parseAst(s, env);
      if (env.canDirectlyReturn(ast)) {
        value = env.getReturnValue()
        // if (isGeneratorEnv) {
        //   console.log('return 成功')
        // }
        break;
      }

      if (env.hadBreak() || env.hadContinue()) {
        break;
      }
    }
    return value;
  }

  // console.log(isGeneratorEnv, generateCode(ast))
  try {
    let ret;
    if (isGeneratorEnv) {
      env.pushEnvStack()
      const returnRv = env.envStackStore.check();
      if (isInstanceOf(returnRv, RuntimeValue)) {
        ret = returnRv;
      }
    }
    if (!ret) {
      ret = run();
    }
    if (isGeneratorEnv) {
      env.popEnvStack()
    }
    return ret;
  } catch (e) {
    // console.log('捕获', e)
    env.envStackStore.setError(e);
    // const f = getWindowObjectRv().hasOwnProperty('onerror') && getWindowObjectRv().get('onerror');
   
    // if (f && isFunctionRuntimeValue(f) && !isYieldError(e)) {
    //   runFunctionRuntimeValueInGlobalThis(createRuntimeValueAst(
    //     f,
    //     'window_onerror'
    //   ), 
    //   getWindowEnv(),
    //   createRuntimeValueAst(e, 'e')
    //   )
    // }
    throw e;
  }
}