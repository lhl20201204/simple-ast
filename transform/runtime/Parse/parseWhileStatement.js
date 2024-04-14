import parseAst from "..";
import Environment from "../Environment";
import { clearAstConfig } from "../Environment/Generator/AstConfig";
import createEnviroment, { createEmptyEnviromentExtraConfig } from "../Environment/createEnviroment";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import generateCode from "../Generate";
import { ENV_DICTS } from "../constant";

export function innerParseWhileStatement(ast, env, labelName) {
  const { test, body } = ast;
  const isGeneratorEnv = env.canYieldAble()

  while(parseRuntimeValue(parseAst(test, env))) {
    const isLabelEnv =  !!labelName;
    const childEnv = createEnviroment(isLabelEnv ? 'label_body' : 'while_body', env, {
      [ENV_DICTS.noNeedLookUpVar]: true,
      [ENV_DICTS.isWhileEnv]: true
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

export default function parseWhileStatement(ast, env) {
  return innerParseWhileStatement(ast, env, undefined)
}