import parseAst from "..";
import RuntimeValue from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";

export default function parseUnaryExpression(ast, env) {
  const { operator, argument } = ast;
  const v = parseRuntimeValue(parseAst(argument, env));
  //todo ++ -- 
  switch(operator) {
    case '-' : return new RuntimeValue(typeof -v, -v);
    case '+' : return new RuntimeValue(typeof +v, +v);   
  }
}