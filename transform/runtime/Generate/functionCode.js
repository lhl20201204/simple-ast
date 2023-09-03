import { getAstCode } from ".";
import { DEBUGGER_DICTS, RUNTIME_LITERAL } from "../constant";
import { getElememtCode } from "./arrayCode";
import { prefixSpace, purple, remark, space, tabSpace, wrapBlockWithBigBrace, wrapMiddleBracket, wrapSpace } from "./util";

export function getRemark( content, config) {
  if (!config) {
    throw new Error('config 必传')
  }
  return `${config[DEBUGGER_DICTS.isFunctionEndNotRemark] ? '' : remark(` /* ${content} end */`, config)}`
}

export function getFunctionDeclarationCode(ast, config) {
  const { async, generator, id, body, params } = ast;
  const GeneratorStr = generator ? wrapSpace('*', config) : space(config)
  return `${async ? purple(RUNTIME_LITERAL.async, config) + space(config) : ''}${purple(RUNTIME_LITERAL.function, config)}${GeneratorStr}${getAstCode(id, config)}${space(config)}(${getElememtCode(params, config)})${space(config)
  }${wrapBlockWithBigBrace(body, config)}${
    remark(` /* ${RUNTIME_LITERAL.function} end */`, config)}`
}

export function getFunctionExpressionCode(ast, config) {
  const { async, generator, params, body } = ast;
  const asyncStr =  async ? purple(RUNTIME_LITERAL.async, config) + space(config) : '';

  const functionStr = config[DEBUGGER_DICTS.hideFunctionField] 
  || config[DEBUGGER_DICTS.isFunctionInClassMethodDefinition]
  || config[DEBUGGER_DICTS.replaceFunctionName]
  ? '' : purple(RUNTIME_LITERAL.function, config)

  const GeneratorStr = generator ?
  (
    functionStr ? wrapSpace('*', config) : '*' + space(config)) 
  : (functionStr ? space(config) : '')

  const nameStr = config[DEBUGGER_DICTS.replaceFunctionName] ?
  wrapSpace(config[DEBUGGER_DICTS.replaceFunctionName], config) : ''

  const ret = `${
    asyncStr
  }${
    functionStr
  }${
    GeneratorStr
  }${
    nameStr
  }(${getElememtCode(params, config)})${space(config)}${
    wrapBlockWithBigBrace(body, config)
  }${
    getRemark(RUNTIME_LITERAL.function, config)
  }`
  return wrapMiddleBracket(ret, config)
}

export function getArrowFunctionExpressionCode(ast, config) {
  const { async, params, body } = ast;
  const ret = `${async ? purple(RUNTIME_LITERAL.async, config) + space(config) : ''}(${getElememtCode(params, config)})${space(config)}${purple('=>', config)}${space(config)}${
    wrapBlockWithBigBrace(body, config)
  }${
    remark(
    config[DEBUGGER_DICTS.isInCallExpressionCalleer] || config[DEBUGGER_DICTS.isFunctionEndNotRemark] ? "" : ` /* arrow ${RUNTIME_LITERAL.function} end */`, config)}`
  return wrapMiddleBracket(ret, config)
}