import parseAst from "..";
import Environment from "../Environment";
import getEqualValue from "../Environment/getEqualValue";
import { AST_DICTS, ENV_DICTS, RUNTIME_LITERAL } from "../constant";

export default function parseSwitchStatement(ast, env) {

  const childEnv = new Environment('switch_body_of_env', env, {
    [ENV_DICTS.isSwitchEnv]: true,
    [ENV_DICTS.noNeedLookUpVar]: true
  });

  const { cases, discriminant } = ast;

  const swRv = parseAst(discriminant, env);

  for(const x of cases) {
    for(const c of x.consequent) {
        if (c.type === AST_DICTS.VariableDeclaration 
          && [RUNTIME_LITERAL.let, RUNTIME_LITERAL.const].includes(c.kind)) {
          parseAst({
            ...c,
            type: AST_DICTS.PreDeclaration,
            declarations: _.map(c.declarations, item => {
              return {
                ...item,
                init: null,
              }
            }),
            [AST_DICTS.isSwitchPreDeclaration]: true,
            kind: c.kind,
          }, childEnv)
          
        }
    }
  }
  const tempCases = [...cases]
 
  while(tempCases.length) {
    let c = tempCases.shift();
    // 找到第一个符合条件的case,且不是default
    if (c.test 
      && 
      (getEqualValue(parseAst(c.test, childEnv)) !== getEqualValue(swRv))) {
      continue;
    }
    // 如果没有break，一直走下去,知道结束
    // 这里改成c
    while(c
       &&  !childEnv.hadBreak()) {
        // 这里做个特殊处理
        parseAst({
          type: 'BlockStatement',
          body: c.consequent,
        }, childEnv)
      c = tempCases.shift();
    }
    // 如果break，跳出整个switch
    if (childEnv.hadBreak()) {
      break;
    }
  }

}