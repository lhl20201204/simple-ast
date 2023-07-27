import parseAst from "..";
import Environment from "../Environment";
import parseRuntimeValue from "../Environment/parseRuntimeValue";

export default function parseWhileStatement(ast, env) {
  const { test, body } = ast;

  const childEnv = new Environment('while body', env, {
    isWhileEnv: true,
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