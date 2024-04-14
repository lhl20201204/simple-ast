import parseAst from "..";
import Environment from "../Environment";
import { clearAstConfig } from "../Environment/Generator/AstConfig";
import { getNullValue } from "../Environment/RuntimeValueInstance";
import createEnviroment, { createEmptyEnviromentExtraConfig } from "../Environment/createEnviroment";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { ENV_DICTS } from "../constant";

export default function parseDoWhileStatement(ast, env) {
  const { test, body } = ast;
  const isGeneratorEnv = env.canYieldAble();
  const childEnv = createEnviroment('do_while_body', env, {
    [ENV_DICTS.isDoWhileEnv]: true,
    [ENV_DICTS.noNeedLookUpVar]: true,
  }, createEmptyEnviromentExtraConfig({ast}))
  // console.log('while')
  parseAst(body, childEnv);
  if (childEnv.hadBreak()) {
    return getNullValue()
  }
  if (childEnv.hadContinue()) {
    childEnv.setContinueFlag(false)
  }
  if (isGeneratorEnv) {
    clearAstConfig(ast)
  }
  while(parseRuntimeValue(parseAst(test, env))) {
    const childEnv = createEnviroment('do_while_body', env, {
      [ENV_DICTS.isDoWhileEnv]: true,
      [ENV_DICTS.noNeedLookUpVar]: true,
    }, createEmptyEnviromentExtraConfig({ast}))
    // console.log('while')
    parseAst(body, childEnv);
    if (childEnv.hadBreak()) {
      break;
    }
    if (childEnv.hadContinue()) {
      childEnv.setContinueFlag(false)
    }
    if (isGeneratorEnv) {
      clearAstConfig(ast)
    }
  }
}