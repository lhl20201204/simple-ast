export default function parsePreDeclaration(ast, env) {
  _.forEach(ast.declarations, ({ id, }) => {
     let key;
     if (id.type === 'Identifier') {
       key = id.name;
     }
     env.placeholder(key)
   });
}