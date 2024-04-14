import parseAst from "..";
import { createRuntimeValueAst } from "../Environment/utils";
import { AST_TYPE } from "../ast/constants";
import { AST_DICTS } from "../constant";
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
    let leftAst = left;
    // 可能是一整串表达式，在这里不合适。
    // if (env.isInWithBlock()) {
    //   const withRv = env.getCurrentWithRuntimeValue();
    //   if (left.type === 'Identifier' && withRv.has?.(left.name)) {
    //     const obj = {
    //       type: 'MemberExpression',
    //       object: createRuntimeValueAst(withRv),
    //       property: left,
    //       computed: false,
    //       optional: false,
    //     };
  
    //     if (env.canYieldAble()) {
    //       _.set(obj, AST_DICTS._config, ast[ AST_DICTS._config].getAssignmentExpressionInWithBlockAstConfig());
    //     }
  
    //     leftAst = createRuntimeValueAst(obj)
    //   }
    // }
    return setExpression(leftAst, right, env, {});
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
      },
      ..._.pick(ast, AST_DICTS._config),
    }, env)
  }
}