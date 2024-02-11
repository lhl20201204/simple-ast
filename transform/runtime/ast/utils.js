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

let tempSelfResult =  null;
_.omitAttr = (xx, bol) => {
  if (bol) {
    tempSelfResult = omitAttr(xx)
    return tempSelfResult;
  } else {
    const c = omitAttr(xx);
    if (!_.isEqual(tempSelfResult, c)) {
      console.error('不匹配')
      return c;
    } else {
      return '跟正宗的一模一样'
    }
  }
};

export function checkThrowIfSameName(astArr) {
  const set = new Set();
  function dfsJudgeAstHadDeclaration(ast) {
    switch(ast.type) {
      case AST_TYPE.Identifier: 
       if (set.has(ast.name)) {
        throwError('参数重复声明',ast.tokens[0])
       }
       set.add(ast.name);
         return
      case AST_TYPE.RestElement:
         return dfsJudgeAstHadDeclaration(ast.argument);
      case AST_TYPE.AssignmentPattern:
         return dfsJudgeAstHadDeclaration(ast.left);
      case AST_TYPE.ObjectPattern: 
        return _.map(ast.properties, x => dfsJudgeAstHadDeclaration(x.value));
      case AST_TYPE.ArrayPattern: 
        return _.map(ast.elements, dfsJudgeAstHadDeclaration)
    }
    throwError('未允许的参数声明类型' + ast.type, ast.tokens[0])
  }
  _.forEach(astArr, dfsJudgeAstHadDeclaration)
}

function _innerGetAvoidPureArrowFuncitonExpression(text, func) {
  return function (ast) {
    if (_.includes(AST_TYPE.ArrowFunctionExpression, ast.type)
  && (!_.last(ast.tokens).is(TOKEN_TYPE.RightParenthesis))) {
    throwError('箭头函数不加括号'+ text +'不能直接跟着语法符号', _[func](ast.tokens))
  }
  }
}

export const avoidPureArrowFuncitonExpressionNextTokenIsOperator = _innerGetAvoidPureArrowFuncitonExpression('后面', 'last')
export const avoidPureArrowFuncitonExpressionPrefixTokenIsOperator = _innerGetAvoidPureArrowFuncitonExpression('前面', 'first')