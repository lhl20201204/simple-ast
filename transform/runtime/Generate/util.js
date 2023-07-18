function wtc(x, c, config) {
  if (!config) {
    throw new Error(`config 不能为空`)
  }
  return config.text ? x : `<span title="颜色为${c}" style="cursor:pointer;color:${c};">${x}</span>`
}

export function space(config, count = 1) {
  return _.map(new Array(count), () => (config.text ? ' ' : '&nbsp;')).join('')
}

export function prefixSpace(config) {
  return space(config, config.prefixSpaceCount)
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
  return { ...config, prefixSpaceCount: (config.prefixSpaceCount ?? 0) + 4 }
}

export function letVariableDeclarationInForOFStatement(config) {
  return { ...config, isVariableDeclarationInForOFStatement: true }
}

export function putParentOperator(config, opLevel) {
  return { ...config, parentOperators: [opLevel, ...config.parentOperators ?? []]}
}

export function letFunctionInObjectRight(config) {
  return { ...config, isFunctionInObjectRight: true };
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
  return {...config, isFunctionInClassMethodDefinition: true }
}

export function isInCallExpressionCalleer(config) {
  return {...config, isInCallExpressionCalleer: true }
}

export function isFunctionEndNotRemark(config) {
  return {...config, isFunctionEndNotRemark: true }
}