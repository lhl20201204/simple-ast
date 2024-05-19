import { negate } from "lodash";
import { RegExpToken } from "./Token";
import { TOKEN_TYPE } from "./constant";
import { isInstanceOf } from "../../commonApi";
import NFANode from "./NFANode";

export function throwError(errorInfo, token) {
  if (!isInstanceOf(token, RegExpToken)) {
    throw 'throwError方法token 漏传'
  }
  let isUnhandleError = false;
  if (errorInfo.slice(0, 2) === '{{' && errorInfo.slice(-2) === '}}') {
    errorInfo = errorInfo.slice(2, -2);
    isUnhandleError = true;
  }
  const e = new Error(`${token.startRow}行:${token.startCol}列-${token.endRow}行:${token.endCol}列  ${token.value} ${errorInfo}`);
  e.isUnhandleError = isUnhandleError;
  e.token = token
  throw e;
}

export const hexDicts = [['u', 4], ['x', 2]]

export function getValueByToken(token) {
  // TODO 先拿最后一个字符的值
  for (const x of hexDicts) {
    if (_.startsWith(token.value, '\\' + x[0])
     && _.size(token.value) === x[1] + 2
     && isHex(_.slice(token.value, -x[1]).join(''))) {
      return parseInt(_.slice(token.value, -x[1]).join(''), 16)
    }
  }
  //TODO 慢慢补 看起来没有任何规律，只能手敲了。。。
  const obj = {
    '\\a': '\a',
    '\\b': '\b',
    '\\f': '\f',
  };

  if (SpecialSign.includes(token.value) && _.has(obj, token.value)) {
    return _.get(obj, token.value).charCodeAt(0)
  }

  return (token.value).charCodeAt(_.size(token.value) - 1)
}

export function getRestConfigByAssertionToken(token) {
  switch (token.type) {
    case TOKEN_TYPE.Start: return { kind: 'start' };
    case TOKEN_TYPE.End: return { kind: 'end' };
    case TOKEN_TYPE.DemarcationLine: return { kind: 'word', negate: false };
    case TOKEN_TYPE.NotDemarcationLine: return { kind: 'word', negate: true };
    case TOKEN_TYPE.LookAheagNegate: return { kind: 'lookahead', negate: true };
    case TOKEN_TYPE.Lookahead: return { kind: 'lookahead', negate: false };
    case TOKEN_TYPE.Lookbehind: return { kind: 'lookbehind', negate: false };
    case TOKEN_TYPE.LookbehindNegate: return { kind: 'lookbehind', negate: true };
  }
  throwError('未处理的类型', token)
}

export function getRestConfigByCharacterSetToken(token) {
  // TODO 应该还有其他类型的
  switch (token.type) {
    case TOKEN_TYPE.Point: return {
      kind: 'any'
    }
    case TOKEN_TYPE.Alpha: return {
      kind: 'word',
      negate: false,
    }
    case TOKEN_TYPE.NotAlpha: return {
      kind: 'word',
      negate: true,
    }
    case TOKEN_TYPE.DNumber: return {
      kind: 'digit',
      negate: false,
    }
    case TOKEN_TYPE.NotDNumber: return {
      kind: 'digit',
      negate: true,
    }
    case TOKEN_TYPE.Space: return {
      kind: 'space',
      negate: false,
    }
    case TOKEN_TYPE.NotSpace: return {
      kind: 'space',
      negate: true,
    }
  }
  throwError('未处理的类型', token)
}

export const SpecialSign = [
  '\\-', '\\.', '\\+', '\\*', '\\?', '\\/', '\\\\', '\\(', '\\)', '\\{', '\\}', '\\[', '\\]',
     // 大写 跳过b 和d 和s w
  ..._.compact(new Array(26).fill(0).map((_c, i) => {
    const c = String.fromCharCode(i + 65)
    if (['B', 'D', 'S', 'W'].includes(c)) {
      return null
    }
    return '\\' + c
})),
 // 小写 跳过b 和 c和d 和s w
 ..._.compact(new Array(26).fill(0).map((_c, i) => {
  const c = String.fromCharCode(i + 97)
  if (['b', 'c', 'd', 's', 'w'].includes(c)) {
    return null
  }
  return '\\' + c
})),
];


export const isHex = (str) => _.every(str, c => c.match(/[0-9A-Fa-f]/));

export function strToRaw(str, backreferenceIndexArr = []) {
  const ret = [];
  const len = _.size(str);
  let i = 0;
  while (i < len) {
    const c = str[i];
    if (c === '\\'
      && _.size(str[i + 1])
      && !['d', 'D', 's', 'S', 'w', 'W', 'c', ...SpecialSign.map(x => _.slice(x, 1).join(''))].includes(str[i + 1])
      && 
      !_.some(hexDicts, c => str[i + 1] == c[0] && isHex(_.slice(str, i + 2, i + 2 +c[1]).join('')))
      && backreferenceIndexArr.includes(str[i+1])
    ) {
      ret.push('\\', '\\')
    } else {
      ret.push(c)
    }
    i++;
  }
  return ret.join('')
}

export function getInfinity() {
  return null;
}

export function createNode(ctx) {
  return new NFANode(ctx.getStateIndex())
}