import { getAstCode } from ".";
import { RUNTIME_LITERAL } from "../constant";
import { hideFunctionField, letConfigBeNotHtml, letInObjectLeftKey, prefixSpace, purple, replaceFunctionName, space, tabSpace, wrapBigBrace, wrapSpace } from "./util";

export function getObjectExpressionCode(ast, config) {
  const { properties } = ast;
  const childrenStr =(config) => _.map(properties, p => {
    if (p.type === 'SpreadElement') {
      return getAstCode(p, tabSpace(config))
    }
    const { key, value, computed, shorthand, method, kind } = p;
    if (shorthand) {
      return getAstCode(key, letInObjectLeftKey(config))
    }
    const kindAstCode = [RUNTIME_LITERAL.set, RUNTIME_LITERAL.get].includes(kind) ?
      purple(kind, config) + space(config)
      : ''

    const isFunctionType = ['ArrowFunctionExpression', 'FunctionExpression'].includes(value.type);
    const valueAstCode = getAstCode(value, isFunctionType ? tabSpace(hideFunctionField(config)) : tabSpace(config));
    const splitCode = isFunctionType ? '' : wrapSpace(':', config)
    if (computed && !method) {
      return `${kindAstCode}[${getAstCode(key, config)}]${splitCode}${valueAstCode}`
    }

    if (method) {
      const tempkey =getAstCode(key, letInObjectLeftKey(config))
      const leftKey = computed ? `[${tempkey}]` : tempkey;
      return `${kindAstCode
        }${
          value.id ? leftKey : ''
        }${space(config)}${getAstCode(value, replaceFunctionName(
          value.id ? getAstCode(value.id, config) : leftKey,
          tabSpace(hideFunctionField(config))))}`
    }
    
    return `${kindAstCode}${getAstCode(key, letInObjectLeftKey(config))}${splitCode}${valueAstCode
      }`
  });

  let temp;
  const isLong = _.size(properties) > 3 || (temp = childrenStr(letConfigBeNotHtml(config)), temp.length > 0 && temp.some(x => x.length > 15))

  return `{${isLong ? '\n' + prefixSpace(tabSpace(config)) : space(config)}` + childrenStr(config).join(',' + (isLong ? ('\n' + prefixSpace((tabSpace(config)))) : space(config))) + `${isLong ? '\n' + prefixSpace(config) : ''}${space(config)}}`

}

export function getObjectPatternCode(ast, config) {
  const { properties } = ast;
  return  wrapBigBrace(_.map(properties, p => {
    const { key, value, computed, shorthand, type } = p;
    if (type === 'RestElement') {
      return getAstCode(p, config)
    }
    if (shorthand) {
      if (value.type === 'AssignmentPattern') {
        return getAstCode(value, tabSpace(config));
      }
      return getAstCode(key, config)
    }
    if (computed) {
      return `[${getAstCode(key, config)}]${space(config)}:${space(config)}${getAstCode(value, tabSpace(config))}`
    }
    return `${getAstCode(key, config)}${space(config)}:${space(config)}${getAstCode(value, config)}`
  }).join(',\n' + prefixSpace(tabSpace(config))), config)
}