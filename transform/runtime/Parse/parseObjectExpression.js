import parseAst from "..";
import PropertyDescriptor from "../Environment/PropertyDescriptor";
import { createObject, getFalseV, getUndefinedValue } from "../Environment/RuntimeValueInstance";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { createPropertyDesctiptor, createSimplePropertyDescriptor, getObjectAttrOfPropertyDescriptor } from "../Environment/utils";
import { PROPERTY_DESCRIPTOR_DICTS, RUNTIME_LITERAL } from "../constant";

export function getKeyString(key, computed,  env) {
  if (!env) {
    throw new Error('env必传')
  }
  let ret = undefined;
   if (computed) {
    ret = parseRuntimeValue(parseAst(key, env));
  } else if (key.type === 'Identifier') {
    ret = key.name;
  }  else {
    throw new Error('未处理的键值类型')
  }
  return ret;
}

export function getObjectPropertyExpressionKey(ast, env) {
  if (ast.type !== 'Property') {
    console.log(ast);
    throw new Error('ast 必须是Property类型')
  }
  const { key, computed } = ast;
  return getKeyString(key, computed, env)
}


export default function parseObjectExpression(ast, env) {
  //  const obj = {};
   const objRv = createObject({})
   _.forEach(ast.properties, (c) => {
    if (c.type === 'SpreadElement') {
      const rv = parseAst(c.argument, env);
      for(const x of rv.keys()) {
        // obj[x] = rv.value[x];
        // 这里不用clone
        objRv.set(x, rv.get(x), rv.getOwnPropertyDescriptor(x))
      }
      return;
    }
    const { value, kind } = c;
    let k = getObjectPropertyExpressionKey(c, env)
    const valueRv = parseAst(value, env)

    objRv.set(k, valueRv, getObjectAttrOfPropertyDescriptor(objRv, k, valueRv, { kind, env }))
    // obj[k] = valueRv;
   })
   return objRv
}