import parseAst from "..";
import { createString } from "../Environment";
import RuntimeValue, {  getUndefinedValue } from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { JS_TO_RUNTIME_VALUE_TYPE, OUTPUT_TYPE, RUNTIME_VALUE_TO_OUTPUT_TYPE, RUNTIME_VALUE_TYPE } from "../constant";
import { getMemberPropertyKey } from "./parseMemberExpression";
import setPattern from "./setPattern";


function getUpdate(ast, env, step = 1) {
  const { prefix, argument } = ast;
  const rv = parseAst(argument, env)
  const value = parseRuntimeValue(rv);
  const updateRvValue = value + 1* step
  const updateRv = new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE(updateRvValue), updateRvValue)
  setPattern(updateRv, argument, env, {
    useSet: true,
  });
  return prefix ? rv : updateRv;
}

function getTypeOf(ast, env) {
  const {  argument } = ast;
  const rv = parseAst(argument, env)
  if ([
    RUNTIME_VALUE_TYPE.function,
    RUNTIME_VALUE_TYPE.arrow_func,
    RUNTIME_VALUE_TYPE.class,
  ].includes(rv.type)) {
    return createString(OUTPUT_TYPE.function)
  }
  if ([
    RUNTIME_VALUE_TYPE.undefined,
    RUNTIME_VALUE_TYPE.number,
    RUNTIME_VALUE_TYPE.string,
    RUNTIME_VALUE_TYPE.boolean
    ].includes(rv.type)) {
    return createString(RUNTIME_VALUE_TO_OUTPUT_TYPE(rv.type) )
  }
  return createString( OUTPUT_TYPE.object)
}

function deleteProperty(ast, env) {
  const {  argument } = ast;
  if (argument.type === 'MemberExpression') {
   let key = getMemberPropertyKey(argument, env);
   return parseAst(argument.object, env).delete(key)
  }

  throw new Error('delete 前必须有对象')

}

export default function parseUnaryExpression(ast, env) {
  const { operator, argument } = ast;
  const v = parseRuntimeValue(parseAst(argument, env));
  //todo ++ -- 
  switch(operator) {
    case '-' : return new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE( -v), -v);
    case '+' : return new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE( +v), +v); 
    case '++' : return getUpdate(ast, env, 1);
    case '--' : return getUpdate(ast, env, -1);
    case 'typeof': return getTypeOf(ast, env);
    case 'void': return getUndefinedValue()
    case 'delete': return deleteProperty(ast, env);
  }
}
