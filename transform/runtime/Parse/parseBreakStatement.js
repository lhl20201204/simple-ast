export default function parseBreakStatement(ast, env) {

  env.setBreakFlag(true, ast.label ? ast.label.name : null);
  
}