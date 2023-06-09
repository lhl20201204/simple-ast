export default function parseThisExpression(ast, env) {
  return env.get('this');
}