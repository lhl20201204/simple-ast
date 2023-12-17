import { getAstCode } from '.';
import { stringFormat } from '../../commonApi';
import { DEBUGGER_DICTS, RUNTIME_LITERAL, AST_DICTS } from '../constant';
import { getElememtCode } from './arrayCode';
import {
  space, prefixSpace, purple, red, blue, numGreen, remark,
  tabSpace,
  letInObjectPropertyKey,
  letVariableDeclarationInForOFStatement,
  putParentOperator,
  templateCount,
  wrapSpace,
  isInCallExpressionCalleer,
  wrapBigBrace,
  wrapBlockWithBigBrace,
} from './util'
const priorityArr = [
  [
    ','
  ],
  [
    '...'
  ],
  [ // 从右到左
    'yield exp',
    'yield* exp'
  ],
  [ // 从右到左
    '=', '+=', '-=', '*=', '/=',
    '%=', '<<=', '>>=', '>>>=',
    '&=', '^=', '|=',
  ],
  ['exp?exp:exp'],// 从右到左
  ['||'],
  ['??'],
  ['&&'],
  ['|'],
  ['^'],
  ['&'],
  ['!=', '===', '!==', '=='],
  ['<', '<=', '>', '>=', RUNTIME_LITERAL.in, RUNTIME_LITERAL.instanceof],
  ['<<', '>>', '>>>'],
  ['+', '-'],
  ['*', '/', '%'],
  ['**'],// 从右到左
  [// 从右到左
    '~', '!', '+', '-', '++', '--', RUNTIME_LITERAL.typeof, RUNTIME_LITERAL.void, RUNTIME_LITERAL.delete, RUNTIME_LITERAL.await],
  ['exp++', 'exp--'],
  ['new exp'], // 从右到左
  ['exp.exp', 'exp[exp]', 'new exp( exp )', 'exp( exp )', '?.'],
  ['(exp)']
];

const prioritySet = new Map();
const signList = new Set();
priorityArr.forEach((arr, index) => {
  arr.forEach((sign) => {
    if (!prioritySet.has(sign)) {
      prioritySet.set(sign, index + 1)
    } else {
      const oldV = _.flatten([prioritySet.get(sign)])
      prioritySet.set(sign, [...oldV, index + 1])
    }
    signList.add(sign)
  })
})

export function getProgramCode(ast, config) {
  const { body } = ast;
  return _.map(body, (x, i) => {
    let suffix = '';
    if (i < body.length - 1) {
      suffix = ((x.type.endsWith('Statement') || x.type.endsWith('Declaration')) ? '\n' : ';\n')
    }
    return prefixSpace(config) + getAstCode(x, config) + suffix
  }).join('')
}

export function getBlockStatementCode(ast, config) {
  return getProgramCode(ast, config)
}

export function getIdentifierCode(ast, config) {
  if (config.isInObjectLeft || config.isInObjectProperty) {
    return ast.name;
  }
  return blue(ast.name, config);
}

export function getTwoOperatorCode(ast, config) {
  // 处理符号优先级，判断是否加括号 (a+b)*(c+d)
  const { left, right, operator } = ast;
  if (!signList.has(operator)) {
    console.error(signList)
    throw new Error('未处理的符号' + operator);
  }
  const level = prioritySet.get(operator)
  const opCurrentLevel = level[0] ?? level;
  // console.error(operator, opCurrentLevel);
  const shouldAddParenthesis = _.size(config.parentOperators) && opCurrentLevel < config.parentOperators[0];
  return (shouldAddParenthesis ? `(${space(config)}` : '') + getAstCode(left, putParentOperator(config, opCurrentLevel)) + `${space(config)}${operator}${space(config)}` + getAstCode(right, putParentOperator(config, opCurrentLevel)) + (shouldAddParenthesis ? `${space(config)})` : '')
}

export function getBinaryExpressionCode(ast, config) {
  // 处理符号优先级，判断是否加括号 (a+b)*(c+d)
  return getTwoOperatorCode(ast, config)
}

export function getLogicalExpressionCode(ast, config) {
  return getTwoOperatorCode(ast, config)
}

export function getDeclarationCode(ast, config) {
  const { kind, declarations } = ast;
  return purple(kind, config) + `${space(config)}` + _.map(declarations, d => {
    const { id, init } = d;
    return getAstCode(id, config) + (init ? (`${space(config)}${RUNTIME_LITERAL.equal}${space(config)}` + getAstCode(init, config)) : '');
  }).join(`${space(config)},`) + (config.isVariableDeclarationInForOFStatement ? '' : ';');
}

export function getVariableDeclarationCode(ast, config) {
   return getDeclarationCode(ast, config)
}

export function getLiteralCode(ast, config) {
  return +ast.raw === +ast.value ? numGreen(ast.raw, config) : red(ast.raw, config)
}


export function getMemberExpressionCode(ast, config) {
  const { object, property, computed, optional } = ast;
  const obj = getAstCode(object, putParentOperator(config, prioritySet.get('exp.exp')));
  const p = stringFormat(getAstCode(property, letInObjectPropertyKey(config)))
  if (computed) {
    return `${obj}${optional ? RUNTIME_LITERAL.optional : ''}[${p}]`
  }
  return `${obj}${optional ? RUNTIME_LITERAL.optional : '.'}${p}`
}


export function getCallExpressionCode(ast, config) {
  const { callee, arguments: args, optional } = ast;
  return `${getAstCode(callee, isInCallExpressionCalleer(config))}${optional ? RUNTIME_LITERAL.optional : ''}(${getElememtCode(args, config)
    })`
}

export function getReturnStatementCode(ast, config) {
  return `${purple(RUNTIME_LITERAL.return, config)} ${ast.argument ? getAstCode(ast.argument, config) : ''}`;
}

export function getAssignmentExpressionCode(ast, config) {
  const { left, right, operator } = ast;
  return `${getAstCode(left, config)} ${wrapSpace(operator, config)} ${getAstCode(right, config)}`;
}

export function getUnaryExpressionCode(ast, config) {
  const { operator, prefix, argument } = ast;
  const level = prioritySet.get(operator)
  const opCurrentLevel = level[1] ?? level;
  // console.error(operator, opCurrentLevel);
  const shouldAddParenthesis = _.size(config.parentOperators) && opCurrentLevel < config.parentOperators[0];
  return `${prefix ? operator : ''}${shouldAddParenthesis ? '(' : ''}${space(config)}${getAstCode(argument, putParentOperator(config, opCurrentLevel))}${shouldAddParenthesis ? ')' : ''}${!prefix ? operator : ''}`;
}

export function getExpressionStatementCode(ast, config) {
  return getAstCode(ast.expression, config);
}


export function getIfStatementCode(ast, config) {
  const { test, consequent, alternate } = ast;
  const p = `${purple(RUNTIME_LITERAL.if, config)}${space(config)}(${getAstCode(test, config)})${space(config)
    + wrapBlockWithBigBrace(consequent, config)
  }`
  if (!alternate) {
    return p + `${remark(` /* ${RUNTIME_LITERAL.if} end */`, config)}`
  }
  if (alternate.type === 'BlockStatement') {
    return p + ` ${purple(RUNTIME_LITERAL.else, config)}${space(config)
      + wrapBlockWithBigBrace(alternate, config)
    }${space(config)}${remark(` /* ${RUNTIME_LITERAL.else} ${RUNTIME_LITERAL.if} end */`, config)}`
  }
  return p + ` ${purple(RUNTIME_LITERAL.else, config)} ${getAstCode(alternate, config)}`
}

export function getThisExpressionCode(ast, config) {
  return purple(RUNTIME_LITERAL.this, config);
}

export function getRestElementCode(ast, config) {
  return `...${getAstCode(ast.argument, config)}`;
}

export function getSpreadElementCode(ast, config) {
  return `...${getAstCode(ast.argument, config)}`;
}

export function getAssignmentPatternCode(ast, config) {
  const { left, right } = ast;
  return `${getAstCode(left, config)} ${RUNTIME_LITERAL.equal} ${getAstCode(right, config)}`
}

export function getTemplateLiteralCode(ast, config) {
  const { quasis, expressions } = ast;
  const qq = [...quasis];
  const ex = [...expressions];
  let ret = '';
  let i = 0;
  let len = qq.length;
  while (qq.length) {
    ret += (getTemplateElementCode(qq.shift(), templateCount(config, i, len)))
    if (ex.length) {
      ret += (getAstCode(ex.shift(), config))
    }
    i++;
  }
  if (qq.length || ex.length) {
    throw new Error('模版字符串解析错误')
  }
  return ret;
}

export function getTemplateElementCode(ast, config) {
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

export function getForOfOrInStatementCode(ast, config, type) {
  const { left, right, body, await: isAwait } = ast;
  return `${purple(RUNTIME_LITERAL.for, config)}${
    isAwait ? wrapSpace(purple(RUNTIME_LITERAL.await, config), config): space(config)
  }(${space(config)}${getAstCode(left, letVariableDeclarationInForOFStatement(config))}${space(config)}${type}${space(config)}${getAstCode(right, config)}${space(config)})${space(config)}{\n${getAstCode(body, tabSpace(config))}\n${prefixSpace(config)}}${space(config)}${remark(` /* ${RUNTIME_LITERAL.for} ` + type + ' end */', config)}`
}

export function getForOfStatementCode(ast, config) {
  return getForOfOrInStatementCode(ast, config, RUNTIME_LITERAL.of)
}

export function getForInStatementCode(ast, config) {
  return getForOfOrInStatementCode(ast, config, RUNTIME_LITERAL.in)
}

export function getContinueStatementCode(ast, config) {
  return purple(RUNTIME_LITERAL.continue, config);
}

export function getBreakStatementCode(ast, config) {
  return purple(RUNTIME_LITERAL.break, config);
}


export function getForStatementCode(ast, config) {
  const { init, test, update, body } = ast;
  return `${purple(RUNTIME_LITERAL.for, config)}${space(config)}(${space(config)}${[init, test, update].map(a =>
    getAstCode(a, letVariableDeclarationInForOFStatement(config))).join(`${space(config)};${space(config)}`)}${space(config)})${space(config)}{\n${getAstCode(body, tabSpace(config))}\n${prefixSpace(config)}}${space(config)}${remark(` /* ${RUNTIME_LITERAL.for} end */`, config)}`
}

export function getUpdateExpressionCode(ast, config) {
  const { prefix, argument, operator } = ast;
  const t = getAstCode(argument, putParentOperator(config, prioritySet.get(prefix ? operator :'exp' + operator)))
  return prefix ? `${operator}${t}` : `${t}${operator}`
}

export function getWhileStatementCode(ast, config) {
  const { test, body } = ast;
  const p = `${purple(RUNTIME_LITERAL.while, config)}${space(config)}(${getAstCode(test, config)})${space(config)
   + wrapBlockWithBigBrace(body, config)}`
  return p + `${remark(` /* ${RUNTIME_LITERAL.while} end */`, config)}`
}


export function getYieldExpressionCode(ast, config) {
  // console.error(prioritySet.get('yield exp'))
  const opCurrentLevel = prioritySet.get('yield exp');
  const shouldAddParenthesis = _.size(config.parentOperators) && opCurrentLevel < config.parentOperators[0];
  const str = `${purple(RUNTIME_LITERAL.yield, config)}${ast.delegate ? wrapSpace(
    '*'
    ,config)  : space(config)}${ast.argument ? getAstCode(ast.argument, putParentOperator(config, opCurrentLevel)) : ''}`;
  return shouldAddParenthesis ? `(${str})` : str;
}

export function getAwaitExpressionCode(ast, config) {
  return `${purple(RUNTIME_LITERAL.await, config)}${space(config)}${getAstCode(ast.argument, config)}`
}

export function getRuntimeValueCode(ast, config) {
  if (ast.name?.type) {
    return getAstCode(ast.name, config) + (ast.ast ? remark(`/*${wrapSpace(RUNTIME_LITERAL.equal, config)}${wrapSpace(getAstCode(ast.ast, config), config)}*/`, config) : '');
  }
  return ast.name ?? '_ref'
}

export function getChainExpressionCode(ast, config) {
  return getAstCode(ast.expression, config)
}

// export function getCallFunctionExpressionCode(ast, config) {
//   return getAstCode(ast._fnAst[RUNTIME_VALUE_DICTS.symbolAst], config)
// }

export function getThrowStatementCode(ast, config) {
  return purple(RUNTIME_LITERAL.throw, config) + space(config) + getAstCode(ast.argument, config)
}


export function getStaticBlockCode(ast, config) {
  return purple(RUNTIME_LITERAL.static, config) + space(config) + 
  `{\n${getAstCode({ type: 'BlockStatement', body: ast.body }, tabSpace(tabSpace(config)))}\n${prefixSpace(tabSpace(config))
    }}${
      remark(` /* ${RUNTIME_LITERAL.static} Block end */`, config)}`
}

export function getConditionalExpressionCode(ast, config) {
  return `${getAstCode(ast.test, config)}${wrapSpace('?', config)}${getAstCode(ast.consequent, config)
    }${wrapSpace(':', config)}${getAstCode(ast.alternate, config)
    }`
}


export function getDebuggerStatementCode(ast, config) {
  const text = purple(RUNTIME_LITERAL.debugger, config);
  if (config[DEBUGGER_DICTS.isHTMLMode]) {
    const spanId = `currentDebuggerSpan`;
    // setTimeout(() => {
    //   const dom = document.getElementById(spanId);
    //   if (dom) {
    //     const child = document.getElementById('debuggerScene');
    //     document.body.removeChild(child);
    //     dom.appendChild(child);
    //   }
      
    // }, 0)
    return `<span id="${spanId}" style="position:relative;">${text}</span>`
  }
  return text;
}

export function getSwitchStatementCode(ast, config) {
  const tabSpaceConfig = tabSpace(config);
  return `${purple(RUNTIME_LITERAL.switch, config)}(${wrapSpace(getAstCode(ast.discriminant, config), config)})${space(config)}${
    
    wrapBigBrace(_.map(ast.cases, c => {
      return `${(c.test ? (purple(RUNTIME_LITERAL.case, config) + (
         wrapSpace(getAstCode(c.test, tabSpaceConfig), config)
      ) ) : purple(RUNTIME_LITERAL.default, config)) + space(config)}:${
       _.size(c.consequent) ? '\n' : ''}${
        getAstCode({
          type: 'BlockStatement',
          body: c.consequent,
        }, tabSpace(tabSpaceConfig))
      }`
    }).join(`\n${prefixSpace(tabSpaceConfig)}`), config)
  }`
}

export function getPreDeclarationCode(ast, config) {
  return `${remark(`// 变量声明预提升`, config)}\n${
    prefixSpace(config) + '//' + space(config) + getDeclarationCode(ast, config) + (
      ast.kind === 'var' ? wrapSpace(wrapSpace('// =', config) + RUNTIME_LITERAL.undefined, config) : ''
    )
  }`
}

export function getTryStatementCode(ast, config) {
  const getCode = (k, block) => {
    return `${purple(k, config) + space(config)}${wrapBlockWithBigBrace(block, config)}`
  }
  const { block, handler, finalizer} = ast;
 
  return `${getCode(RUNTIME_LITERAL.try, block)}${
    handler ?
    (wrapSpace(purple(RUNTIME_LITERAL.catch, config) 
    + 
    (handler.param ? `(${
      wrapSpace(getAstCode(handler.param, config), config)
    })` : '')
    ,config)
    + wrapBlockWithBigBrace(handler.body,config)): ''
  }${
    finalizer ? space(config) + getCode(RUNTIME_LITERAL.finally,{
      type: 'BlockStatement',
      body: finalizer.body,
      }) : ''
  }`
}

export function getDoWhileStatementCode(ast, config) {
  const { test, body } = ast;
  const p = `${purple(RUNTIME_LITERAL.do, config) 
    + wrapSpace(wrapBlockWithBigBrace(body, config), config)}${purple(RUNTIME_LITERAL.while, config)}${space(config)}(${getAstCode(test, config)})`
  return p + `${remark(` /* ${RUNTIME_LITERAL.while} end */`, config)}`
}

export function getSequenceExpressionCode(ast, config) {
  return getElememtCode(ast.expressions, config)
}

export function getUseRuntimeValueCode(ast, config) {
  const str = getAstCode(ast.argument, config);
  return remark(`// useRuntimeValue(`, config) +_.join(_.split(str, '\n'), '\n //') + ')';
}

export function getGetRuntimeValueCode(ast, config) {
  return remark(`${ast.ast ?? '_ref' + ast.index} // getRuntimeValue(${ast.index})`, config)
}