export default function parseIdentifier(ast, env) {
  return env.get(ast.name)
}