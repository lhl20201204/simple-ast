import parseAst from "..";
import { createRuntimeValueAst } from "../Environment/utils";
import setExpression from "./setExpression";

export default function parseAssignmentExpression(ast, env) {
  const { left, operator, right } = ast;
  // const value = parseAst(right, env); // { a: 1, b: [6]}
  // setExpression(value, left, env)
  // console.log(env, value);
  // todo
  // console.error(left, right)
  
  if (operator === '=') {
    // console.error(left, right);
    return setExpression(left, right, env, {});
  } else  {    
    return parseAst({
      type: "ExpressionStatement",
      expression: {
        type: "AssignmentExpression",
        operator: "=",
        left,
        right: {
          type: "BinaryExpression",
          left,
          operator: operator.slice(0, -1),
          right,
        }
      }
    }, env)
  }
}