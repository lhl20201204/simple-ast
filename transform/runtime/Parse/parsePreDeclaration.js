function getIdentifierKey(ast, env, config ) {
  return [ast.name];
}

function getArrayPatternKey(ast, env, config) {
  return _.flatten(_.map(ast.elements, item => getDeclarationsKey(item, env, config)))
}

function getObjectPatternKey(ast, env, config) {
  const { properties }= ast;
  const ret = []
  _.forEach(properties, p => {
    const {  value } = p;
    ret.push(...getDeclarationsKey(value, env, config))
  })
  return ret;
}

function getAssignmentPatternKey(ast, env, config) {
  return [...getDeclarationsKey(ast.left, env, config), ...getDeclarationsKey(ast.right, env, config)]
}

function getRestElementKey(ast, env, config) {
  return getDeclarationsKey(ast.argument, env, config)
}


function getDeclarationsKey(ast, env, config) {
  if (!config) {
    throw new Error('config 不能为空')
  }
  switch(ast.type) {
    case 'Identifier': return getIdentifierKey(ast, env, config);
    case 'ArrayPattern': return getArrayPatternKey(ast, env, config);
    case 'ObjectPattern': return getObjectPatternKey(ast, env, config);
    case 'AssignmentPattern': return getAssignmentPatternKey(ast, env, config);
    case 'RestElement': return getRestElementKey(ast, env, config);
    case 'AssignmentExpression':
    case "ObjectExpression": 
    case 'Literal':
    case 'ArrayExpression': return []
  }
  console.error(ast);
  throw new Error('未处理过的DeclarationsKey类型');
}

export default function parsePreDeclaration(ast, env) {
  _.forEach(ast.declarations, ({ id }) => {
     const keyList = getDeclarationsKey(id, env, {});
     _.forEach(keyList, key => {
      env.placeholder(key, ast.kind);
     })
   });
}