import parseAst from "..";
import Environment from "../Environment";
import { clearAstConfig } from "../Environment/Generator/AstConfig";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";
import createEnviroment, { createEmptyEnviromentExtraConfig } from "../Environment/createEnviroment";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { ENV_DICTS } from "../constant";

export default function parseForStatement(ast, env) {
  const { init, test, update, body } = ast;

  // let bodyEnv = env;
  const isInGenerator = env.isInGeneratorEnv()
  // const isInLetConst = init.type === 'VariableDeclaration' && ['const', 'let'].includes(init.kind);
  
  const  initEnv = createEnviroment('for let/const statement',env, {}, createEmptyEnviromentExtraConfig({ ast: body }))
  if (isInGenerator) {
    initEnv.pushEnvStack()
  }

  parseAst(init, initEnv)
  while(parseRuntimeValue(parseAst(test, initEnv))) {
    const bodyEnv = createEnviroment('for let/const statement body', initEnv, {
      [ENV_DICTS.isForEnv]: true,
      [ENV_DICTS.noNeedLookUpVar]: true
    }, createEmptyEnviromentExtraConfig({ ast: body }))
    parseAst(body, bodyEnv);
    if (bodyEnv.hadBreak() || bodyEnv.canDirectlyReturn(body)) {
      break;
    }
    if (bodyEnv.hadContinue()) {
      bodyEnv.setContinueFlag(false)
    }
    parseAst(update, initEnv);
    if (isInGenerator) {
      clearAstConfig(test)
      clearAstConfig(body);
      clearAstConfig(update)
    }
  }
  if (isInGenerator) {
    initEnv.popEnvStack()
  }
  return getUndefinedValue()
}