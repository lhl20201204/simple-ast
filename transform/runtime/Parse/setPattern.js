import _ from "lodash";
import parseAst from "..";
import RuntimeValue, { RuntimeRefValue, getUndefinedValue } from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import Environment from "../Environment";
import { getMemberPropertyKey } from "./parseMemberExpression";
import { getObjectPropertyExpressionKey } from "./parseObjectExpression";
import { RUNTIME_VALUE_TYPE } from "../constant";
import { createObject } from "../Environment";
import { isUndefinedRuntimeValue } from "../Environment/utils";

function getType(restConfig, env) {
  if (restConfig.useSet || (env instanceof RuntimeValue)) {
    return 'set';
  }
  return 'add' + _.upperFirst( _.get(restConfig, 'kind', env === Environment.window ? 'var' : 'let'));
}

export function setIdentifierPattern(argsRv, paramsAst, env, restConfig) {
  // console.log('设置', env);
  if (!(argsRv instanceof RuntimeValue)) {
    throw new Error('运行时赋值出错')
  }
  // console.log(getType(restConfig, env), paramsAst.name)
  env[getType(restConfig, env)](paramsAst.name, argsRv);
}

export function setAssignmentPattern(argsRv, paramsAst, env, restConfig) {
  setPattern(
   isUndefinedRuntimeValue(argsRv) ? parseAst(paramsAst.right, env) : argsRv,
   paramsAst.left, env, restConfig)
}

export function setArrayPattern(argsRv, paramsAst, env, restConfig) {
  const astArr = paramsAst.elements;
  const restI = _.findIndex(astArr, op => ['RestElement'].includes(op.type))
  if (restI > - 1 && restI !== astArr.length -1) {
    throw new Error('解构数组只能放在最后一个位置');
  }
  const restAst = restI > -1 ? astArr[restI] : null;
  const restRv =  new RuntimeRefValue(RUNTIME_VALUE_TYPE.array, restI > -1 ? argsRv.value.slice(restI) : [])
  _.forEach(restI > -1 ? astArr.slice(0, -1) : astArr, (a, i) => {
     setPattern(argsRv.value[i] ?? getUndefinedValue(), a, env, restConfig);
   })
   if (restAst) {
    setPattern(restRv,restAst.argument, env, restConfig)
  }
}

export function setObjectPattern(argsRv, paramsAst, env, restConfig) {
  const astArr = paramsAst.properties;
  const restI = _.findIndex(astArr, op => ['RestElement'].includes(op.type) )
  if (restI > - 1 && restI !== astArr.length -1) {
    throw new Error('解构对象只能放在最后一个位置');
  }
  const kList = [];
  const restAst = restI > -1 ? astArr[restI]: null;
  _.forEach(restI > -1 ? astArr.slice(0, -1) : astArr, (op) => {
    // console.log(op);
    const k = getObjectPropertyExpressionKey(op, env);
    const valueAst = op.value;
    // const [k, valueAst] = getPropertyKey(op, env, {});
    kList.push(k)
    // env[getType(restConfig)](k, v)
    // console.log(key, v)

    // console.log(op, k, argsRv.value[k] ?? getUndefinedValue(), valueAst)
    
    setPattern(argsRv.get(k), valueAst, env, restConfig)
    // keyil
  })
  if (restAst) {
    const restRv =  createObject( _.omit(argsRv.value, kList));
    setPattern(restRv, restAst.argument, env, restConfig)
  }
}

export function setMemberExpression(v, ast, env, restConfig) {
  const { object, optional } = ast;
  if (optional) {
    throw new Error('复制表达式左边不能是?.')
  }
  const objectRV = parseAst(object, env);
  let k = getMemberPropertyKey(ast, env);
  objectRV.set(k, v)
}

export function setVariableDeclaration(v, ast, env, restConfig) {
  const { declarations, kind } = ast;
  for(const { id } of  declarations) {
    // console.log(v, id);
    setPattern(v, id, env, {...restConfig, kind })
  }
}

// export function setRuntimeValuePattern(argsRv, attrRv, objRv, restConfig) {
//   objRv[getType(restConfig, env)](paramsAst.name, argsRv);
// }

export default function setPattern(v, ast, env, restConfig ) {
  if (!restConfig) {
    throw new Error('restConfig必传')
  }
  switch(ast.type) {
    // case 'RuntimeValue': return setRuntimeValuePattern(v, ast, env, restConfig )
    case 'Identifier': return setIdentifierPattern(v, ast, env, restConfig);
    case 'AssignmentPattern': return setAssignmentPattern(v, ast, env, restConfig);
    case 'ArrayPattern': return setArrayPattern(v, ast, env, restConfig);
    case 'ObjectPattern': return setObjectPattern(v, ast, env, restConfig);
    case 'MemberExpression': return setMemberExpression(v, ast, env, restConfig);
    case 'VariableDeclaration': return setVariableDeclaration(v, ast, env, restConfig)
  }
  console.error(v, ast);
  throw new Error('未处理的setPattern')
}


