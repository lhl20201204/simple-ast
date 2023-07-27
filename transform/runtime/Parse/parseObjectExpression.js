import parseAst from "..";
import { createObject } from "../Environment";
import PropertyDescriptor from "../Environment/PropertyDescriptor";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { RUNTIME_LITERAL } from "../constant";

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

export function getObjectPropertyDescriptor(objRv, attr, valueRv, kind) {
  const oldDescriptor = objRv.getPropertyDescriptor(attr) ?? new PropertyDescriptor({
    value: valueRv,
  })
    
  if ([RUNTIME_LITERAL.set, RUNTIME_LITERAL.get].includes(kind)) {
      oldDescriptor.setRuntimeValue(kind, valueRv)
  } else if (kind === 'init') {
    oldDescriptor.setRuntimeValue('value', valueRv)
  }
  return oldDescriptor;
}

export default function parseObjectExpression(ast, env) {
  //  const obj = {};
   const objRv = createObject({})
   _.forEach(ast.properties, (c) => {
    if (c.type === 'SpreadElement') {
      const rv = parseAst(c.argument, env);
      for(const x of rv.keys()) {
        // obj[x] = rv.value[x];
        objRv.set(x, rv.get(x), rv.getPropertyDescriptor(x))
      }
      return;
    }
    const { value, kind } = c;
    let k = getObjectPropertyExpressionKey(c, env)
    const valueRv = parseAst(value, env)
    // const oldDescriptor = objRv.getPropertyDescriptor(k) ?? new PropertyDescriptor({})
    
    // if ([RUNTIME_LITERAL.set, RUNTIME_LITERAL.get].includes(kind)) {
    //   oldDescriptor.setRuntimeValue(kind, valueRv)
    // }
    

    objRv.set(k, valueRv, getObjectPropertyDescriptor(objRv, k, valueRv, kind))
    // obj[k] = valueRv;
   })
   return objRv
}