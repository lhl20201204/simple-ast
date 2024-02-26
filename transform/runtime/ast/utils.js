import AST from ".";
import { isInstanceOf } from "../../commonApi";
import ASTItem from "./ASTITem";
import { Token } from "./Token";
import { AST_TYPE, TOKEN_TYPE, literalAstToValue } from "./constants";

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
_.T = (xx, bol) => {
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
  function dfsJudgeAstHadDeclaration(ast, stack = []) {
    if (!isInstanceOf(ast, ASTItem)) {
      console.error(astArr, stack);
    }
    switch(ast.type) {
      case AST_TYPE.Identifier: 
       if (set.has(ast.name)) {
        console.warn(ast.tokens, ast, set)
        throwError('参数重复声明',_.last(ast.tokens))
       }
       set.add(ast.name);
         return
      case AST_TYPE.RestElement:
         return dfsJudgeAstHadDeclaration(ast.argument, [...stack, ast]);
      case AST_TYPE.AssignmentPattern:
         return dfsJudgeAstHadDeclaration(ast.left, [...stack, ast]);
      case AST_TYPE.ObjectPattern: 
        return _.map(ast.properties, x => dfsJudgeAstHadDeclaration(x, [...stack, ast]));
      case AST_TYPE.Property:
        return dfsJudgeAstHadDeclaration(ast.value, [...stack, ast])
      case AST_TYPE.ArrayPattern: 
        return _.map(ast.elements, c => dfsJudgeAstHadDeclaration(c, [...stack, ast]))
    }
    throwError('未允许的参数声明类型' + ast.type, ast.tokens[0])
  }
  _.forEach(astArr, c => dfsJudgeAstHadDeclaration(c))
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

export function ensureCannotHadAttrsInSameTime(item, attrs){
   if (!_.isObject(item) || !_.isArray(attrs) || _.size(_.filter(_.keys(item), x => _.includes(attrs, x))) !== 1) {
    throw new Error('方法使用错误，不能同时拥有' + attrs.join('/') + '，并且至多只能拥有一个')
   }
}

export function getValueOfLiteralToken(token) {
  if (token.is(TOKEN_TYPE.String)) {
    return _.slice(token.value, 1, -1).join('') 
  } 
  if (token.is(TOKEN_TYPE.Number)) {
    return Number(token.value)
  }
  if (!_.has(literalAstToValue, token.type)) {
    console.warn(token)
    throw '未处理的类型'
  }
  return _.get(literalAstToValue, token.type)
}

export function ensureAllTypeInList(type, list) {
  if (!(_.includes(list, type)
        || (_.isArray(type) && _.every(type, et => _.includes(list, et))))) {
            throw new Error('配置错误')
   }
}

export function tokenHadWrapLine(token) {
  return  _.find(token.prefixTokens, ['type', TOKEN_TYPE.WrapLine])
}

export function checkShouldWrapLine(body, token) {
  const lastAst = _.last(body);
  if (
    isInstanceOf(token, Token) &&
    !_.last(_.get(lastAst, 'tokens')).is?.(TOKEN_TYPE.Semicolon) &&
    !tokenHadWrapLine(token) &&
    !lastAst.is?.(AST_TYPE.MethodDefinition) &&
    !lastAst.is?.(AST_TYPE.IfStatement) && 
    !lastAst.is?.(AST_TYPE.WhileStatement)
  ) {
    // console.warn(this.astContext.tokens, _.last(this.astContext.tokens).is?.(TOKEN_TYPE.Semicolon))
    throwError('前面可能缺少运算符', token)
  }
}

export function rawToCooked(raw) {
  let ret = [];
  let i = 0;
  while(i < raw.length) {
    const c = raw[i]
    // 应该是一个 \ 直接省略。。。
    if (['$', '\`', '\\', 'f', 't', 'n', 'r', 'b'].includes(c) 
    && _.get(_.last(ret), 0) === '\\'
    && !_.get(_.last(ret), 1) 
       ) {
      ret.pop()
      const config = {
        f: '\f',
        t: '\t',
        n: '\n',
        r: '\r',
        b: '\b'
      }
      ret.push([config[c] || c, true])
    } else {
      ret.push([c, false])
    }
    i++
  }
  console.log(raw.split(''), ret);
  return _.map(ret, 0).join('')
}

_.rawToCooked = rawToCooked