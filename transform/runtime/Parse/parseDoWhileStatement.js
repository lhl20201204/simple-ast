import parseAst from "..";
import Environment from "../Environment";
import { getNullValue } from "../Environment/RuntimeValueInstance";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { ENV_DICTS } from "../constant";

export default function parseDoWhileStatement(ast, env) {
  const { test, body } = ast;

  const childEnv = new Environment('do_while_body', env, {
    [ENV_DICTS.isDoWhileEnv]: true,
    [ENV_DICTS.noNeedLookUpVar]: true,
  })
  // console.log('while')
  parseAst(body, childEnv);
  if (childEnv.hadBreak()) {
    return getNullValue()
  }
  if (childEnv.hadContinue()) {
    childEnv.setContinueFlag(false)
  }

  while(parseRuntimeValue(parseAst(test, env))) {
    const childEnv = new Environment('do_while_body', env, {
      [ENV_DICTS.isDoWhileEnv]: true,
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