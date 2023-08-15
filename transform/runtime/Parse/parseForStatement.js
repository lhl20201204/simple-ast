import parseAst from "..";
import Environment from "../Environment";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { ENV_DICTS } from "../constant";

export default function parseForStatement(ast, env) {
  const { init, test, update, body } = ast;

  let bodyEnv = env;
  // for(let i=0;i<10; i++) {
  // }
  const isInLetConst = init.type === 'VariableDeclaration' && ['const', 'let'].includes(init.kind);
  let initEnv = env;
  if (isInLetConst) {
    initEnv = new Environment('for let/const statement',env)
  } 
  
  parseAst(init, initEnv)
  while(parseRuntimeValue(parseAst(test, initEnv))) {
    bodyEnv = new Environment('for let/const statement body', initEnv, {
      [ENV_DICTS.isForEnv]: true,
    })
    parseAst(body, bodyEnv);
    if (bodyEnv.hadBreak()) {
      break;
    }
    if (bodyEnv.hadContinue()) {
      bodyEnv.setContinueFlag(false)
    }
    parseAst(update, initEnv);
  }
  return getUndefinedValue()
}