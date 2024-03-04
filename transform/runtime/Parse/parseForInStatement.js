import parseAst from "..";
import Environment from "../Environment";
import RuntimeValue from "../Environment/RuntimeValue";
import { createString } from "../Environment/RuntimeValueInstance";
import createEnviroment, { createEmptyEnviromentExtraConfig } from "../Environment/createEnviroment";
import { ENV_DICTS, RUNTIME_VALUE_TYPE } from "../constant";
import setExpression from "./setExpression";
import setPattern from "./setPattern";

export default function parseForInStatement(ast, env) {
  const { left, right, body } = ast;
  const arrV = parseAst(right, env);
  // todo 先处理数组类型
  if (!['array', 'object'].includes(arrV.type)) {
    throw new Error('for in 语句必须遍历数组类型或者对象');
  }
  if (left.type === 'VariableDeclaration' && ['const', 'let'].includes(left.kind)) {
      let index = 0;
      for(const value in arrV.value) {
        // todo
        const paramsEnv = createEnviroment(
          'for in let/const statement',
          env,
          {},
          createEmptyEnviromentExtraConfig({ast})
        );
        const childEnv = createEnviroment('for in let/const statement body' + index++, paramsEnv, {
          isForInEnv: true,
          [ENV_DICTS.isForEnv]: true,
          [ENV_DICTS.noNeedLookUpVar]: true
        }, createEmptyEnviromentExtraConfig({ast}))
        setPattern(createString(value), left,  paramsEnv, {});
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
    for(const attr in arrV.value) {
      const childEnv = createEnviroment('for in var/noVariableDeclaration statement body' + i, env, {
        isForInEnv: true,
        [ENV_DICTS.isForEnv]: true,
        [ENV_DICTS.noNeedLookUpVar]: true
      }, createEmptyEnviromentExtraConfig({ast}))
      // 数组下标0 需要变成 ‘0’
      const value = createString(`${attr}`);
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