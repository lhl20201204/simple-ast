import { negate } from "lodash";
import { RegExpToken } from "./Token";
import { TOKEN_TYPE } from "./constant";
import { isInstanceOf } from "../../commonApi";

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
  e.isUnhandleError= isUnhandleError;
  e.token = token
 throw e;
}


export function getValueByToken(token) {
  // TODO 
  return (token.value).charCodeAt(0)
}

export function getRestConfigByAssertionToken(token) {
  switch(token.type) {
    case TOKEN_TYPE.Start: return { kind: 'start'};
    case TOKEN_TYPE.End: return { kind: 'end' };
    case TOKEN_TYPE.DemarcationLine: return { kind: 'word', negate: false };
    case TOKEN_TYPE.NotDemarcationLine: return { kind: 'word', negate: true };
    case TOKEN_TYPE.LookAheagNegate: return { kind: 'lookahead', negate: true };
    case TOKEN_TYPE.Lookahead: return  { kind: 'lookahead', negate: false };
    case TOKEN_TYPE.Lookbehind: return { kind: 'lookbehind', negate: false};
    case TOKEN_TYPE.LookbehindNegate: return { kind: 'lookbehind', negate: true};
  }
  throwError('未处理的类型',token)
}

export function getRestConfigByCharacterSetToken(token) {
  // TODO 应该还有其他类型的
  switch(token.type) {
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
      negate: true,
    }
    case TOKEN_TYPE.NotDNumber: return { 
      kind: 'digit',
      negate: false,
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
  throwError('未处理的类型',token)
}

export function strToRaw(str) {
  const ret =[];
  for(const c of str) {
    if (c !== '\\') {
      ret.push(c)
    } else {
      ret.push('\\', '\\')
    }
  }
  return ret.join('')
}

export function getInfinity() {
  return null;
}