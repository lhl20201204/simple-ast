import parseAst from "..";
import parseRuntimeValue from "../Environment/parseRuntimeValue";

export function setIdentifierPattern(argsRv, paramsAst, env) {
  env.addLet(paramsAst.name, argsRv);
}

export function setAssignmentPattern(argsRv, paramsAst, env) {
  setPattern(parseAst(paramsAst.right, env), paramsAst.left, env)
}

export function setArrayPattern(argsRv, paramsAst, env) {
   _.forEach(paramsAst.elements, (a, i) => {
     setPattern(argsRv.value[i], a, env);
   })
}

export function setObjectPattern(argsRv, paramsAst, env) {
  _.forEach(paramsAst.properties, (op) => {
    const { key, computed } = op;
    let k = key.name;
     if (computed) {
       k = parseRuntimeValue(parseAst(op, env));
     }
    let v = argsRv.value[k]
    env.addLet(k, v)
    // keyil
  })
}

export function setMemberExpression(v, ast, env) {
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
    throw new Error(`不能获取非引用值的属性${k}`)
  }
  objectRV.value[k] = v;
}

export default function setPattern(v, ast, env) {
  switch(ast.type) {
    case 'Identifier': return setIdentifierPattern(v, ast, env);
    case 'AssignmentPattern': return setAssignmentPattern(v, ast, env);
    case 'ArrayPattern': return setArrayPattern(v, ast, env);
    case 'ObjectPattern': return setObjectPattern(v, ast, env);
    case 'MemberExpression': return setMemberExpression(v, ast, env);
  }
  throw new Error('未处理的表达式', ast)
}


