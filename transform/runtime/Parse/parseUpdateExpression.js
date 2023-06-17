import parseAst from "..";
import RuntimeValue from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import setPattern from "./setPattern";

function getUpdate(ast, env, step = 1) {
  const { prefix, argument } = ast;
  const rv = parseAst(argument, env)
  const value = parseRuntimeValue(rv);
  const updateRvValue = value+1* step
  const updateRv = new RuntimeValue(typeof updateRvValue, updateRvValue)
  setPattern(updateRv, argument, env, {
    useSet: true,
  });
  return prefix ? rv : updateRv;
}

export default function parseUpdateExpression(ast, env) {
  const { operator, argument } = ast;
  //todo ++ -- 
  switch(operator) {
    case '++' : return getUpdate(ast, env, 1);
    case '--' : return getUpdate(ast, env, -1);
  }
}