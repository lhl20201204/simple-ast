import { getAstCode } from ".";
import { isElementInArray, letConfigBeNotHtml, prefixSpace, space, tabSpace } from "./util";


export function getElememtCode(ast, config) {
  const children = _.map(ast, a => getAstCode(a, tabSpace(config)))
  let temp
  let isLong = children.length > 3 || (temp = _.map(ast, a => getAstCode(a, letConfigBeNotHtml(config))), temp.length > 0 && temp.some(x => x.length > 15))
  // const ret = children.join(`,${space(config)}`);
  return isLong ?
    (
      ('\n' + prefixSpace((tabSpace(config)))) +
      children.join(`,\n${prefixSpace((tabSpace(config)))}`)
      + ('\n' + prefixSpace(config))
    )
    : children.join(`,${space(config)}`)
}

export function getArrayExpressionCode(ast, config) {
  const { elements } = ast;
  return `[${getElememtCode(elements, isElementInArray(config))}]`
}

export function getArrayPatternCode(ast, config) {
  return `[${space(config)}${getElememtCode(ast.elements, config)}${space(config)}]`
}