import _ from "lodash";
import parseAst from "..";
import RuntimeValue, { getUndefinedValue } from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import Environment from "../Environment";

function getType(restConfig, env) {
  if (restConfig.useSet) {
    return 'set';
  }
  return 'add' + _.upperFirst(env === Environment.window ? 'var': _.get(restConfig, 'kind', 'let'));
}

export function setIdentifierPattern(argsRv, paramsAst, env, restConfig) {
  env[getType(restConfig, env)](paramsAst.name, argsRv);
}

export function setAssignmentPattern(argsRv, paramsAst, env, restConfig) {
  setPattern(
   ['undefined'].includes(argsRv.type) ? parseAst(paramsAst.right, env) : argsRv,
   paramsAst.left, env, restConfig)
}

export function setArrayPattern(argsRv, paramsAst, env, restConfig) {
  const astArr = paramsAst.elements;
  const restI = _.findIndex(astArr, op => ['RestElement'].includes(op.type))
  if (restI > - 1 && restI !== astArr.length -1) {
    throw new Error('解构数组只能放在最后一个位置');
  }
  const restAst = restI > -1 ? astArr[restI] : null;
  const restRv =  new RuntimeValue('array', restI > -1 ? argsRv.value.slice(restI) : [])
  _.forEach(restI > -1 ? astArr.slice(0, -1) : astArr, (a, i) => {
     setPattern(argsRv.value[i] ?? getUndefinedValue(), a, env, restConfig);
   })
   if (restAst) {
    setPattern(restRv,restAst.argument, env, restConfig)
  }
}

function getPropertyKey(ast, env, config) {
  if (!env || !config) {
    throw new Error('env 和 config必传')
  }
  const valueAst = ast.value;
  switch(valueAst.type) {
    case 'Identifier' : return [valueAst.name, valueAst];
    case 'AssignmentPattern': return [ast.computed ? parseRuntimeValue(parseAst(ast.key, env)): valueAst.left.name , valueAst];
  }
  console.error(ast);
  throw new Error('未处理过的PropertyKey类型')
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
    const [k, valueAst] = getPropertyKey(op, env, {});
    // console.log(k, valueAst);
    kList.push(k)
    // env[getType(restConfig)](k, v)
    // console.log(key, v)

    // console.log(op, k, argsRv.value[k] ?? getUndefinedValue(), valueAst)
    
    setPattern(argsRv.value[k] ?? getUndefinedValue(), valueAst, env, restConfig)
    // keyil
  })
  if (restAst) {
    const restRv = new RuntimeValue('object', 
    _.omit(argsRv.value, kList))
    setPattern(restRv, restAst.argument, env, restConfig)
  }
}

export function setMemberExpression(v, ast, env, restConfig) {
  const { object, computed, property, optional } = ast;
  if (optional) {
    throw new Error('复制表达式左边不能是?.')
  }
  const objectRV = parseAst(object, env);
  let k = property?.name;
  if (computed) {
    k = parseRuntimeValue(parseAst(property, env))
  }
  if (!['object', 'array'].includes(objectRV.type)) {
   // throw new Error(`不能获取非引用值的属性${k}`)
   return;
  }
  objectRV.value[k] = v;
}

export function setVariableDeclaration(v, ast, env, restConfig) {
  const { declarations, kind } = ast;
  for(const { id } of  declarations) {
    // console.log(v, id);
    setPattern(v, id, env, {...restConfig, kind })
  }
}

export default function setPattern(v, ast, env, restConfig ) {
  if (!restConfig) {
    throw new Error('restConfig必传')
  }
  switch(ast.type) {
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


