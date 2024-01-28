import ASTItem from "./ASTITem";
import { AST_TYPE, TOKEN_TYPE } from "./constants";

export function valueToRaw({ value, type}) {
  if (type === TOKEN_TYPE.String) {
    return `'${value}'`
  }

  return value;
}

export function onlyAllowMemberExpressionOrIdentifier(ast, prefixTip) {
  if (![AST_TYPE.MemberExpression, AST_TYPE.Identifier].includes(ast.type)) {
    throw new Error(`${prefixTip}${AST_TYPE.MemberExpression}或者${AST_TYPE.Identifier}`)
  }
}
