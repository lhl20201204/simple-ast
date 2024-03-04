export default function parseContinueStatement(ast, env) {
  let name = ast.label ? ast.label.name : null
  env.setContinueFlagDfs(true, name);
}