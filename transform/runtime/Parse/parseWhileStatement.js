import parseAst from "..";
import Environment from "../Environment";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { ENV_DICTS } from "../constant";

export default function parseWhileStatement(ast, env) {
  const { test, body } = ast;

  const childEnv = new Environment('while body', env, {
    [ENV_DICTS.isWhileEnv]: true,
  })

  while(parseRuntimeValue(parseAst(test, env))) {
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