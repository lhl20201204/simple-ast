import { getLookUpUndefinedRv } from "../Environment/NativeRuntimeValue/undefined";
import { AST_DICTS } from "../constant";

function getIdentifierKey(ast, config ) {
  return [ast.name];
}

function getArrayPatternKey(ast, config) {
  return _.flatten(_.map(ast.elements, item => getDeclarationsKey(item, config)))
}

function getObjectPatternKey(ast, config) {
  const { properties }= ast;
  const ret = []
  _.forEach(properties, p => {
    const {  value } = p;
    ret.push(...getDeclarationsKey(value, config))
  })
  return ret;
}

function getAssignmentPatternKey(ast, config) {
  return [...getDeclarationsKey(ast.left, config), ...getDeclarationsKey(ast.right, config)]
}

function getRestElementKey(ast, config) {
  return getDeclarationsKey(ast.argument, config)
}


function getDeclarationsKey(ast, config) {
  if (!config) {
    throw new Error('config 不能为空')
  }
  switch(ast.type) {
    case 'Identifier': return getIdentifierKey(ast, config);
    case 'ArrayPattern': return getArrayPatternKey(ast, config);
    case 'ObjectPattern': return getObjectPatternKey(ast, config);
    case 'AssignmentPattern': return getAssignmentPatternKey(ast, config);
    case 'RestElement': return getRestElementKey(ast, config);
    case 'AssignmentExpression':
    case "ObjectExpression": 
    case 'Literal':
    case 'ArrayExpression': return []
  }
  console.error(ast);
  throw new Error('未处理过的DeclarationsKey类型');
}

const lookUpUndefinedRuntimeValue = getLookUpUndefinedRv()

export function getPreDeclarationKey(ast) {
  if (ast.type !== AST_DICTS.PreDeclaration) {
    throw new Error('获取定义失败');
  }
  return _.flattenDeep(_.map(ast.declarations, ({ id }) => {
    return getDeclarationsKey(id,{ });
  }))
}

export default function parsePreDeclaration(ast, env) {
  const isSwitchPreDeclaration = ast[AST_DICTS.isSwitchPreDeclaration];
  _.forEach(ast.declarations, ({ id }) => {
     const keyList = getDeclarationsKey(id,{ env });
     _.forEach(keyList, key => {
      if (ast.kind !== 'var') {
        env.placeholder(key, ast.kind, isSwitchPreDeclaration);
        // env['add' + _.upperFirst(ast.kind)](key, beforeInitializationRv)
      } else {
        env.addVar(key, lookUpUndefinedRuntimeValue)
      }
     })
   });
}