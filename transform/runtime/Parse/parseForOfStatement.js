import parseAst from "..";
import Environment from "../Environment";
import createEnviroment from "../Environment/createEnviroment";
import { ENV_DICTS, RUNTIME_VALUE_TYPE } from "../constant";
import setPattern from "./setPattern";

export default function parseForOfStatement(ast, env) {
  const { left, right, body } = ast;
  const arrV = parseAst(right, env);
  // todo 先处理类数组类型
  if (![RUNTIME_VALUE_TYPE.array, RUNTIME_VALUE_TYPE.arguments].includes(arrV.type)) {
    console.log(arrV);
    throw new Error('for of 语句必须遍历数组类型');
  }

  if (left.type === 'VariableDeclaration' && ['const', 'let'].includes(left.kind)) {
      let index = 0;
      for(const value of arrV.value) {
        const paramsEnv = createEnviroment(
          'for of let/const statement',
          env,
        );
        const childEnv = createEnviroment('for of let/const statement body' + index++, paramsEnv, {
          isForOfEnv: true,
          [ENV_DICTS.isForEnv]: true,
          [ENV_DICTS.noNeedLookUpVar]: true
        })
        setPattern(value, left,  paramsEnv, {});
        parseAst(body, childEnv);
        if (childEnv.hadBreak()) {
          break;
        }
        if (env.hadContinue()) {
          env.setContinueFlag(false)
        }
      }
    
  } else {
    let i = 0;
    for(const value of arrV.value) {
      const childEnv = createEnviroment('for of var/noVariableDeclaration statement body' + i, env, {
        isForOfEnv: true,
        [ENV_DICTS.isForEnv]: true,
        [ENV_DICTS.noNeedLookUpVar]: true
      })
      setPattern(value, left, childEnv, { useSet: true });
      parseAst(body, childEnv);
      if (childEnv.hadBreak()) {
        break;
      }
      if (childEnv.hadContinue()) {
        childEnv.setContinueFlag(false)
      }
    }
  }
}