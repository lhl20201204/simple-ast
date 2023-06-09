import _ from "lodash";

function wtc(x, c, config) {
  return config.text ? x : `<span title="颜色为${c}" style="cursor:pointer;color:${c};">${x}</span>`
}

function space(config, count = 1) {
  return _.map(new Array(count), () => (config.text ? ' ' : '&nbsp;')).join('')
}

function prefixSpace(config) {
  return space(config, config.prefixSpaceCount)
}

function purple(x, config) {
  return wtc(x, '#770088', config)
}

function red(x, config) {
  return wtc(x, '#B33232', config)
}

function blue(x, config) {
  return wtc(x, '#0055AA', config)
}

function numGreen(x, config) {
  return wtc(x, '#49866D', config)
}

function letInObjectLeftKey(config) {
  return { ...config, isInObjectLeft: true }
}

function letInObjectPropertyKey(config) {
  return { ...config, isInObjectProperty: true }
}

function tabSpace(config) {
  return { ...config, prefixSpaceCount: (config.prefixSpaceCount ?? 0) + 4 }
}

function templateCount(config, i, len) {
  return { ...config, 
      isSingleTemplate: len === 1,
      isTemplateStart: i === 0,
      isTemplateEnd: i === len - 1,
      isTemplateBody: i > 0 && i < len -1
    }
}

function getProgramCode(ast, config) {
  const { body } = ast;
  return _.map(body, (x, i) => {
    let suffix = '';
    if (i < body.length - 1) {
      suffix = ((x.type.endsWith('Statement') || x.type.endsWith('Declaration')) ? '\n' : ';\n')
    }
    return prefixSpace(config) + getAstCode(x, config) + suffix
  }).join('')
}

function getBlockStatementCode(ast, config) {
  return getProgramCode(ast, config)
}

function getIdentifierCode(ast, config) {
  return config.isInObjectLeft || config.isInObjectProperty ? ast.name : blue(ast.name, config);
}

function getBinaryExpressionCode(ast, config) {
  const { left, right, operator } = ast;
  return getAstCode(left, config) + `${space(config)}${operator}${space(config)}` + getAstCode(right, config)
}

function getVariableDeclarationCode(ast, config) {
  const { kind, declarations } = ast;
  return purple(kind, config) + `${space(config)}` + _.map(declarations, d => {
    const { id, init } = d;
    return getAstCode(id, config) + `${space(config)}=${space(config)}` + getAstCode(init, config);
  }).join(',') + ';';
}

function getObjectExpressionCode(ast, config) {
  const { properties } = ast;
  return '{\n' + prefixSpace(tabSpace(config)) + _.map(properties, p => {
    const { key, value, computed, shorthand } = p;
    if (shorthand) {
      return getAstCode(key, letInObjectLeftKey(config))
    }
    if (computed) {
      return `[${getAstCode(key, config)}]${space(config)}:${space(config)}${getAstCode(value, config)}`
    }
    return `${getAstCode(key, letInObjectLeftKey(config))}${space(config)}:${space(config)}${getAstCode(value, config)}`
  }).join(',\n' + prefixSpace(tabSpace(config))) + `\n${prefixSpace(config)}}`
}

function getLiteralCode(ast, config) {
  return +ast.raw === +ast.value ? numGreen(ast.raw, config) : red(ast.raw, config)
}

function getElememtCode(ast, config) {
  const ret = _.map(ast, a => getAstCode(a, config)).join(`,${space(config)}`);
  return ret;
}

function getArrayExpressionCode(ast, config) {
  const { elements } = ast;
  return `[${getElememtCode(elements, config)}]`
}

function getMemberExpressionCode(ast, config) {
  const { object, property, computed, optional } = ast;
  const obj = getAstCode(object, config);
  const p = getAstCode(property, letInObjectPropertyKey(config))
  if (computed) {
    return `${obj}${optional ? '?.' : ''}[${p}]`
  }
  return `${obj}${optional ? '?.' : '.'}${p}`
}

function getFunctionDeclarationCode(ast, config) {
  const { id, body, params } = ast;
  return `${purple('function', config)}${space(config)}${getAstCode(id, config)}${space(config)}(${getElememtCode(params, config)})${space(config)}{\n${getAstCode(body, tabSpace(config))}\n${prefixSpace(config)}}`
}

function getCallExpressionCode(ast, config) {
  const { callee, arguments: args, optional } = ast;
  return `${getAstCode(callee, config)}${optional ? '?.' : ''}(${getElememtCode(args, config)
    })`
}

function getReturnStatementCode(ast, config) {
  return `return ${getAstCode(ast.argument, config)}`;
}

function getAssignmentExpressionCode(ast, config) {
  const { left, right, operator } = ast;
  return `${getAstCode(left, config)} ${operator} ${getAstCode(right, config)}`;
}

function getUnaryExpressionCode(ast, config) {
  const { operator, prefix, argument } = ast;
  return `${prefix ? operator : ''}${getAstCode(argument, config)}${!prefix ? operator : ''}`;
}

function getExpressionStatementCode(ast, config) {
  return getAstCode(ast.expression, config);
}

function getFunctionExpressionCode(ast, config) {
  const { params, body } = ast;
  return `${purple('function', config)}${space(config)}(${getElememtCode(params, config)})${space(config)}{\n${getAstCode(body, tabSpace(config))}\n${prefixSpace(config)}}`
}

function getIfStatementCode(ast, config) {
  const { test, consequent, alternate } = ast;
  const p = `${purple('if', config)}${space(config)}(${getAstCode(test, config)})${space(config)}{\n${getAstCode(consequent, tabSpace(config))}\n${prefixSpace(config)}}`
  if (!alternate) {
    return p
  }
  if (alternate.type === 'BlockStatement') {
    return p + ` ${purple('else', config)}${space(config)}{\n${getAstCode(alternate, tabSpace(config))}\n${prefixSpace(config)}}`
  }
  return p + ` ${purple('else', config)} ${getAstCode(alternate, config)}`
}

function getThisExpressionCode(ast, config) {
  return purple('this', config);
}

function getRestElementCode(ast, config) {
  return `...${getAstCode(ast.argument, config)}`;
}

function getAssignmentPattern(ast, config) {
  const { left, right } = ast;
  return `${getAstCode(left, config)} = ${getAstCode(right, config)}`
}

function getTemplateLiteralCode(ast, config) {
  const { quasis, expressions } = ast;
  const qq = [...quasis];
  const ex = [...expressions];
  let ret = '';
  let i = 0;
  let len = qq.length;
  while(qq.length) {
    ret+=(getTemplateElementCode(qq.shift(), templateCount(config, i, len)))
    if (ex.length) {
      ret+=(getAstCode(ex.shift(), config))
    }
    i++;
  }
  if (qq.length || ex.length) {
    throw new Error('模版字符串解析错误')
  }
  return ret;
}

function getTemplateElementCode(ast, config) {
  if (config.isSingleTemplate) {
    return red('`' + ast.value.cooked + '`', config);
  }

  if (config.isTemplateStart) {
    return red('`' + ast.value.cooked + '${', config);
  }

  if (config.isTemplateBody) {
    return red('}' + ast.value.cooked + '${', config);
  }
 
  if (config.isTemplateEnd) {
    return red('}' + ast.value.cooked + '`', config);
  }

  throw new Error('未处理的模版类型')
}

function getAstCode(ast, config) {
  const type = ast.type;
  switch (type) {
    case 'BinaryExpression': return getBinaryExpressionCode(ast, config);
    case 'Identifier': return getIdentifierCode(ast, config);
    case 'VariableDeclaration': return getVariableDeclarationCode(ast, config);
    case 'ObjectExpression': return getObjectExpressionCode(ast, config);
    case 'Literal': return getLiteralCode(ast, config);
    case 'Program': return getProgramCode(ast, config);
    case 'ArrayExpression': return getArrayExpressionCode(ast, config);
    case 'MemberExpression': return getMemberExpressionCode(ast, config);
    case 'FunctionDeclaration': return getFunctionDeclarationCode(ast, config);
    case 'BlockStatement': return getBlockStatementCode(ast, config);
    case 'CallExpression': return getCallExpressionCode(ast, config);
    case 'ReturnStatement': return getReturnStatementCode(ast, config);
    case 'AssignmentExpression': return getAssignmentExpressionCode(ast, config);
    case 'UnaryExpression': return getUnaryExpressionCode(ast, config);
    case 'ExpressionStatement': return getExpressionStatementCode(ast, config);
    case 'FunctionExpression': return getFunctionExpressionCode(ast, config);
    case 'IfStatement': return getIfStatementCode(ast, config);
    case 'ThisExpression': return getThisExpressionCode(ast, config);
    case 'RestElement': return getRestElementCode(ast, config);
    case 'AssignmentPattern': return getAssignmentPattern(ast, config);
    case 'TemplateLiteral': return getTemplateLiteralCode(ast, config);
    case 'TemplateElement': return getTemplateElementCode(ast, config);
    case 'EmptyStatement': return ';';
  }
  console.warn('ast to code fail', ast);
  return ''
}


export default function generateCode(ast, config = { prefixSpaceCount: 0 }) {
  return getAstCode(ast, config)
}