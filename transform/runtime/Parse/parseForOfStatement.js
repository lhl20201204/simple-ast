import parseAst from "..";
import Environment from "../Environment";
import setPattern from "./setPattern";

export default function parseForOfStatement(ast, env) {
  const { left, right, body } = ast;
  const arrV = parseAst(right, env);
  // todo 先处理类数组类型
  if (!['array', 'arguments'].includes(arrV.type)) {
    throw new Error('for of 语句必须遍历数组类型');
  }

  if (left.type === 'VariableDeclaration' && ['const', 'let'].includes(left.kind)) {
      let index = 0;
      for(const value of arrV.value) {
        const paramsEnv = new Environment(
          'for of let/const statement',
          env,
        );
        const childEnv = new Environment('for of let/const statement body' + index++, paramsEnv, {
          isForOfEnv: true,
          isForEnv: true,
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
      const childEnv = new Environment('for of var/noVariableDeclaration statement body' + i, env, {
        isForOfEnv: true,
        isForEnv: true,
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