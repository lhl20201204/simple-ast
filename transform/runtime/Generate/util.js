import { getAstCode } from "."
import { DEBUGGER_DICTS } from "../constant"

function wtc(x, c, config) {
  if (!config) {
    throw new Error(`config 不能为空`)
  }
  return config[DEBUGGER_DICTS.isHTMLMode] ?  `<span title="颜色为${c}" style="cursor:pointer;color:${c};">${x}</span>` : x
}

export function space(config, count = 1) {
  if (!config) {
    throw new Error('config 必传')
  }
  return _.map(new Array(count), () => (config[DEBUGGER_DICTS.isHTMLMode] ? '&nbsp;' : ' ')).join('')
}

export function prefixSpace(config) {
  return space(config, config[DEBUGGER_DICTS.prefixSpaceCount])
}

export function purple(x, config) {
  return wtc(x, '#770088', config)
}

export function red(x, config) {
  return wtc(x, '#B33232', config)
}

export function blue(x, config) {
  return wtc(x, '#0055AA', config)
}

export function numGreen(x, config) {
  return wtc(x, '#49866D', config)
}

export function remark(x, config) {
  return wtc(x, '#6A9955', config)
}

export function letInObjectLeftKey(config) {
  return { ...config, isInObjectLeft: true }
}

export function letInObjectPropertyKey(config) {
  return { ...config, isInObjectProperty: true }
}

export function tabSpace(config) {
  return { ...config, [DEBUGGER_DICTS.prefixSpaceCount]: (config[DEBUGGER_DICTS.prefixSpaceCount] ?? 0) + 4 }
}

export function letVariableDeclarationInForOFStatement(config) {
  return { ...config, isVariableDeclarationInForOFStatement: true }
}

export function putParentOperator(config, opLevel) {
  return { ...config, parentOperators: [opLevel, ...config.parentOperators ?? []]}
}

export function templateCount(config, i, len) {
  return { ...config, 
      isSingleTemplate: len === 1,
      isTemplateStart: i === 0,
      isTemplateEnd: i === len - 1,
      isTemplateBody: i > 0 && i < len -1
    }
}

export function wrapSpace(str, config) {
  return `${space(config)}${str}${space(config)}`
}

export function letFunctionInClassMethodDefinition(config) {
  return {...config, [DEBUGGER_DICTS.isFunctionInClassMethodDefinition]: true }
}

export function isInCallExpressionCalleer(config) {
  return {...config, [DEBUGGER_DICTS.isInCallExpressionCalleer]: true }
}

export function isFunctionEndNotRemark(config) {
  return {...config, [DEBUGGER_DICTS.isFunctionEndNotRemark]: true }
}

export function isElementInArray(config) {
  return {
    ...config,
    isElementInArray: true,
  }
}

export function letConfigBeNotHtml(config) {
  return {
    ...config,
    [DEBUGGER_DICTS.isHTMLMode]: false,
  }
}

export function replaceFunctionName(name, config) {
  return {
    ...config,
    [DEBUGGER_DICTS.replaceFunctionName]: name
  }
}

export function hideFunctionField(config) {
  return {
    ...config,
    [DEBUGGER_DICTS.hideFunctionField]: true,
  }
}

export function wrapSmallBracket(contentStr, config) {
  return config[DEBUGGER_DICTS.isInCallExpressionCalleer] ? `(${contentStr})` : contentStr
}

export function wrapBigBrace(contentStr, config) {
  return `{\n` + prefixSpace(tabSpace(config)) + contentStr + `\n${prefixSpace(config)}}`
}

export function wrapBlockWithBigBrace(body, config) {
  return `{\n${getAstCode(body, tabSpace(config))}\n${prefixSpace(config)}}`
}