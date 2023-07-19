import { getAstCode } from ".";
import { RUNTIME_LITERAL } from "../constant";
import { getElememtCode } from "./commonCode";
import { letFunctionInClassMethodDefinition, prefixSpace, purple, remark, space, tabSpace, wrapSpace } from "./util";

export function getClassCode(ast, config, type) {
  const { id, body, superClass } = ast;
  return `${purple(RUNTIME_LITERAL.class, config)}${space(config)}${getAstCode(id,config)}${
    superClass ? space(config) + purple(RUNTIME_LITERAL.extends, config) + space(config) + getAstCode(superClass, config) : ''
  }${space(config)}{\n${prefixSpace(tabSpace(config))}${
    getAstCode(body, config)
  }\n${prefixSpace(config)}}${remark(` /*${RUNTIME_LITERAL.class} ` + type+ ' end */', config)}`
}


export function getClassDeclarationCode(ast, config) {
  return getClassCode(ast, config, 'declaration');
}

export function getClassExpressionCode(ast, config) {
  return getClassCode(ast, config, 'expression');
}

export function getClassBodyCode(ast, config) {
  return ast.body.map(c => getAstCode(c, config)).join(';\n' + prefixSpace((tabSpace(config))))
}

export function getPropertyDefinitionCode(ast, config){
  const { static: isStatic, computed, key, value } = ast;
  const keystr = getAstCode(key, config)
  return `${isStatic ? purple(RUNTIME_LITERAL.static, config) + space(config) : ''}${
    computed ? `[${wrapSpace( keystr, config)}]`: keystr
  }${
    value ? wrapSpace(RUNTIME_LITERAL.equal, config) + getAstCode(value, tabSpace(config)) : ''
  }` 
}

export function getSuperCode(ast, config) {
  return purple(RUNTIME_LITERAL.super, config)
}

export function getMethodDefinitionCode(ast, config) {
  const { static: isStatic, computed, key, value, kind } = ast;
  const keystr = getAstCode(key, config)
  return `${isStatic ? purple(RUNTIME_LITERAL.static, config) + space(config) : ''}${
    [RUNTIME_LITERAL.set, RUNTIME_LITERAL.get].includes(kind) ?
    purple(kind, config) + space(config) :
    ''
  }${
    computed ? `[${wrapSpace( keystr, config)}]`: keystr
  }${
    getAstCode(value, letFunctionInClassMethodDefinition(tabSpace(config)))
  }` 
}

export function getNewExpressionCode(ast, config) {
  const { callee, arguments: args } = ast;
  return `${purple(RUNTIME_LITERAL.new, config)}${wrapSpace(getAstCode(callee, config), config)}(${getElememtCode(args, config)
  })`
}