import parseAst from "..";
import Environment from "../Environment";
import createEnviroment from "../Environment/createEnviroment";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { ENV_DICTS } from "../constant";

export default function parseWhileStatement(ast, env) {
  const { test, body } = ast;


  while(parseRuntimeValue(parseAst(test, env))) {
    const childEnv = createEnviroment('while_body', env, {
      [ENV_DICTS.isWhileEnv]: true,
      [ENV_DICTS.noNeedLookUpVar]: true,
    })
    // console.log('while')
    parseAst(body, childEnv);
    if (childEnv.hadBreak()) {
      break;
    }
    if (childEnv.hadContinue()) {
      childEnv.setContinueFlag(false)
    }
  }

}