import parseAst from "..";
import parseRuntimeValue from "../Environment/parseRuntimeValue";

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
    throw new Error(`不能获取非引用值的属性${k}`)
  }
  const value = parseAst(right, env);
  objectRV.value[k] = value;
  return value;
}

export function setArrayPattern(left, right, env) {
  const value = parseAst(right, env);
   _.forEach(left.elements, (a, i) => {
     setPattern(value.value[i], a, env);
   })
  return value;
}

export function setObjectPattern(left, right, env) {
  const value = parseAst(right, env);
  _.forEach(left.properties, (op) => {
    const { key, computed } = op;
    let k = key.name;
     if (computed) {
       k = parseRuntimeValue(parseAst(op, env));
     }
    let v = value.value[k]
    env.addLet(k, v)
    // keyil
  })
  return value;
}

export default function setExpression(left, right, env) {
  switch(left.type) {
    case 'Identifier': return setIdentifierExpression(left, right, env);
    case 'ArrayPattern': return setArrayPattern(left, right, env);
    case 'ObjectPattern': return setObjectPattern(left, right, env);
    case 'MemberExpression': return setMemberExpression(left, right, env);
  }
  throw new Error('未处理的表达式', left)
}