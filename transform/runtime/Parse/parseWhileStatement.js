import parseAst from "..";
import Environment from "../Environment";
import parseRuntimeValue from "../Environment/parseRuntimeValue";

export default function parseWhileStatement(ast, env) {
  const { test, body } = ast;

  const childEnv = new Environment('while body', env, {
    isWhileEnv: true,
  })
  let i  = 0;
  while(parseRuntimeValue(parseAst(test, env))) {
    parseAst(body, childEnv);
    if (childEnv.hadBreak()) {
      break;
    }
    if (childEnv.hadContinue()) {
      childEnv.setContinueFlag(false)
    }
  }

}