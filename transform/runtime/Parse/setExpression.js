import parseAst from "..";
import RuntimeValue, { getUndefinedValue } from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
const undefinedAst = {
  type: 'Identifier',
  name: 'undefined'
}
export function setIdentifierExpression(left, right, env) {
  const value = parseAst(right, env);
  env.set(left.name, value);
  return value;
}

export function setMemberExpression(left, right, env) {
  const { object, computed, property, optional } = left;
  if (optional) {
    throw new Error('复制表达式左边不能是?.')
  }
  const objectRV = parseAst(object, env);
  let k = property?.name;
  if (computed) {
    k = parseRuntimeValue(parseAst(property, env))
  }
  if (!['object', 'array'].includes(objectRV.type)) {
    return getUndefinedValue()
  }
  const value = parseAst(right, env);
  objectRV.value[k] = value;
  return value;
}

export function setArrayPattern(left, right, env) {
  const leftAstArr = left.elements;
  const restI = _.findIndex(leftAstArr, op => ['RestElement'].includes(op.type) )
  if (restI > - 1 && restI !== leftAstArr.length -1) {
    throw new Error('解构对象只能放在最后一个位置');
  }
  if (restRightAst.type !== 'ArrayExpression') {
    console.error(left, right);
    throw new Error('数组解构失败')
  }
  const restLeftAst = restI > -1 ? leftAstArr[restI]: null;
  const restRightAst = restI > -1 ? {..._.cloneDeep(right), elements: [...right.elements].slice(restI)}  : null;
  const retValue = parseAst(right, env);
   _.forEach(restI > -1 ? leftAstArr.slice(0, -1) : leftAstArr, (a, i) => {
     setExpression(a, {
      type: 'MemberExpression',
      object: right,
      property: {
        type: 'Literal',
        value: i,
        raw: `${i}`,
      },
      computed: true,
      optional: false,
     }, env)
   })
   if (restLeftAst) {
    setExpression(restLeftAst.argument, restRightAst, env);
  }
  return retValue;
}

export function setObjectPattern(left, right, env) {
  const leftAstArr = left.properties;
  const restI = _.findIndex(leftAstArr, op => ['RestElement'].includes(op.type) )
  if (restI > - 1 && restI !== leftAstArr.length -1) {
    throw new Error('解构对象只能放在最后一个位置');
  }
  const restLeftAst = restI > -1 ? leftAstArr[restI]: null;
  const retValue = parseAst(right, env);
  const restRightAst = _.cloneDeep(right);
  if (restRightAst.type !== 'ObjectExpression') {
    console.error(left, right);
    throw new Error('对象解构失败')
  }
  _.forEach(restI > -1 ? leftAstArr.slice(0, -1) : leftAstArr, (op) => {
    const { key, computed, type, value } = op;
    let k = key.name;
     if (computed) {
       k = parseRuntimeValue(parseAst(op, env));
     }
     const targerP = _.find(restRightAst.properties, p => (p.computed ? parseRuntimeValue(parseAst(p, env)) : p.key.name) === k)
     const rightTargetAst = targerP ? {
      type: 'MemberExpression',
      object: right,
      property: targerP.key,
      computed: targerP.computed,
      optional: false,
     } : undefinedAst;

     restRightAst.properties = _.filter(restRightAst.properties, p => (p.computed ? parseRuntimeValue(parseAst(p, env)) : p.key.name) !== k);
    // let v = value.value[k]
    // env.set(k, v)
    setExpression(key, 
      value.type === 'AssignmentPattern' ?
       (rightTargetAst === undefinedAst ? value : rightTargetAst): (rightTargetAst ?? undefinedAst),
       env);
    // keyil
  })
  if (restLeftAst) {
    setExpression(restLeftAst.argument, restRightAst, env);
  }
  return retValue;
}

export default function setExpression(left, right, env) {
  switch(left.type) {
    case 'Identifier': return setIdentifierExpression(left, right, env);
    case 'ArrayPattern': return setArrayPattern(left, right, env);
    case 'ObjectPattern': return setObjectPattern(left, right, env);
    case 'MemberExpression': return setMemberExpression(left, right, env);
  }
  console.error(left)
  throw new Error('未处理的setExpression')
}