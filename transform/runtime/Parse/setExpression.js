import parseAst from "..";
import { PrivateIdentifierNameTransform } from "../../commonApi";
import { PROPERTY_DESCRIPTOR_DICTS, RUNTIME_LITERAL } from "../constant";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { createLiteralAst, createRuntimeValueAst, getObjectAttrOfPropertyDescriptor } from "../Environment/utils";
import { getMemberPropertyKey } from "./parseMemberExpression";
const undefinedAst = {
  type: 'Identifier',
  name: `${RUNTIME_LITERAL.undefined}`
}
export function setIdentifierExpression(left, right, env, config) {
  const value = parseAst(right, env);
  if (env.isInWithBlock()) {
    const currentWithRuntimeValue = env.getCurrentWithRuntimeValue();
    if (currentWithRuntimeValue.has?.(left.name)) {
      currentWithRuntimeValue.set(left.name, value, 
        getObjectAttrOfPropertyDescriptor(currentWithRuntimeValue,
          left.name, value, { kind: PROPERTY_DESCRIPTOR_DICTS.init, env }));
      return value;
    }
  }
  env.set(left.name, value);
  return value;
}

const getFirstIdentityAstAttr = (ast) => {
  if (ast.type === 'Identifier') {
    return ast.name;
  }
  if (ast.type === 'MemberExpression') {
    return getFirstIdentityAstAttr(ast.object)
  }

  // 所有的ArrayPattern, ObjectPattern 最终走的都是setIdentifierExpression;
  // 这里不用处理，递归的时候消除了。
  // if (ast.type === 'ArrayPattern') {
  //   return 
  // }
  if (ast.type === AST_DICTS.RuntimeValue) {
    return {
      has() { return false }
    }
  }

  throw '未处理的赋值类型'
}

// 找到最左边的变量替换
const replaceFirstIdentityAst = (ast, newRV) => {
  if (ast.type === 'Identifier') {
    return {
      type: 'MemberExpression',
      object: createRuntimeValueAst(newRV),
      property: ast,
      computed: false,
      optional: false,
    }
  }
  if (ast.type === 'MemberExpression') {
    return {
      ...ast,
      object: replaceFirstIdentityAst(ast.object, newRV)
    } 
  }
  throw '未处理的赋值类型'
}

export function setMemberExpression(left, right, env, config) {
  const { object, optional } = left;
  if (optional) {
    throw new Error('复制表达式左边不能是?.')
  }
  // console.log('设置', object, env.get('Function'));
  const objectRV = parseAst(object, env);
  // console.log(k, objectRV)
  let k = getMemberPropertyKey(left, env)
  // todo
  // if (!['object', 'array'].includes(objectRV.type)) {
  //   return getUndefinedValue()
  // }
  // console.error(k, config)
  const value = parseAst(right, env);
  // if (k === 'a') {
  //   console.error(objectRV, k, value, '---.');
  // }
  // if (object.name === 'console') {
  //   console.warn(_.cloneDeep(objectRV));
  // }
  objectRV.set(k, value, getObjectAttrOfPropertyDescriptor(objectRV,k, value, { kind: PROPERTY_DESCRIPTOR_DICTS.init, env }))
  // if (object.name === 'console') {
  //   console.warn(_.cloneDeep(objectRV));
  // }
  // console.log(objectRV, k, value);
  // objectRV.value[k] = value;
  return value;
}

export function setArrayPattern(left, right, env, config) {
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
      property: createLiteralAst(i),
      computed: true,
      optional: false,
     }, env, config)
   })
   if (restLeftAst) {
    setExpression(restLeftAst.argument, restRightAst, env, config);
  }
  return retValue;
}

export function setObjectPattern(left, right, env, config) {
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
    // todo
    // 开始测试
    // console.log('paramas--------->', op)
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
       env, config);
    // keyil
  })
  if (restLeftAst) {
    setExpression(restLeftAst.argument, restRightAst, env, config);
  }
  return retValue;
}

export default function setExpression(left, right, env, config) {
  if (!config) {
    throw new Error('config 必传')
  }
  switch(left.type) {
    case 'PrivateIdentifier':  return setIdentifierExpression(PrivateIdentifierNameTransform(left), right, env, config);
    case 'Identifier': return setIdentifierExpression(left, right, env, config);
    case 'ArrayPattern': return setArrayPattern(left, right, env, config);
    case 'ObjectPattern': return setObjectPattern(left, right, env, config);
    case 'MemberExpression': 
     // 写在这。
     if ( env.isInWithBlock() && 
     env.getCurrentWithRuntimeValue()?.has?.(getFirstIdentityAstAttr(left.object))) {
       return setMemberExpression(replaceFirstIdentityAst(left, env.getCurrentWithRuntimeValue()), right, env, config);
     }
    return setMemberExpression(left, right, env, config);
  }
  console.error(left)
  throw new Error('未处理的setExpression')
}