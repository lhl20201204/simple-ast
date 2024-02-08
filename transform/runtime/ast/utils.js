import { isInstanceOf } from "../../commonApi";
import ASTItem from "./ASTITem";
import { Token } from "./Token";
import { AST_TYPE, TOKEN_TYPE } from "./constants";

export function valueToRaw({ value, type}) {
  if (type === TOKEN_TYPE.String) {
    return `${value}`
  }

  return value;
}

export function onlyAllowMemberExpressionOrIdentifier(ast, prefixTip) {
  if (![AST_TYPE.MemberExpression, AST_TYPE.Identifier].includes(ast.type)) {
    throwError(`${prefixTip}${AST_TYPE.MemberExpression}或者${AST_TYPE.Identifier}`, ast.tokens[0])
  }
}

export function throwError(errorInfo, token) {
   if (!isInstanceOf(token, Token)) {
    throw 'throwError方法token 漏传'
   }
   const e = new Error(`${token.startRow}行:${token.startCol}列-${token.endRow}行:${token.endCol}列  ${token.value} ${errorInfo}`);
   e.token = token
  throw e;
}

export function omitAttr(ast) {
  if (_.isArray(ast)) {
    return _.map(ast, omitAttr);
  }
  if (_.isObject(ast)) {
    const obj = _.reduce(ast, (obj, v, k) => {
      if (['start', 'end', 'tokens'].includes(k)) {
        return obj;
      }
      return Object.assign(obj, {
        [k]: omitAttr(v)
      })
    }, {});
    return _.pick(obj, _.sortBy(_.keys(obj)))
  }
  return ast
}

_.omitAttr = omitAttr;