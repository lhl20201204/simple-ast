import parseAst from "..";

export default function parseVariableDeclaration(ast, env) {
  const type = ast.kind
 _.forEach(ast.declarations, ({ id, init}) => {
    const value = parseAst(init, env);
    let key;
    if (id.type === 'Identifier') {
      key = id.name;
    }
    env[`add${_.upperFirst(type)}`](key, value)
  });
}