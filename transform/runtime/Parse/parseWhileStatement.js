import parseAst from "..";
import Environment from "../Environment";
import { clearAstConfig } from "../Environment/Generator/AstConfig";
import createEnviroment, { createEmptyEnviromentExtraConfig } from "../Environment/createEnviroment";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { ENV_DICTS } from "../constant";

export default function parseWhileStatement(ast, env) {
  const { test, body } = ast;
  const isGeneratorEnv = env.canSleepAble() ||  env.isInGeneratorEnv()

  while(parseRuntimeValue(parseAst(test, env))) {
    const childEnv = createEnviroment('while_body', env, {
      [ENV_DICTS.isWhileEnv]: true,
      [ENV_DICTS.noNeedLookUpVar]: true,
    }, createEmptyEnviromentExtraConfig({ ast: body }))
    // console.log('while->开始运行body', _.cloneDeep(body))
    parseAst(body, childEnv);
    if (childEnv.hadBreak() 
     || (childEnv.canDirectlyReturn(body))) {
      break;
    }
    if (childEnv.hadContinue()) {
      childEnv.setContinueFlag(false)
    }
    if (isGeneratorEnv) {
      clearAstConfig(ast)
      // console.log('while body-end', _.cloneDeep(ast));
    }
  }
}