import _ from "lodash";
import parseAst from "..";
import Environment from "../Environment";
const env = new Environment('window', null)
export function getWindow() {
  return env;
}

export function geStatement(statements) {
  const fnS = []
  const varS = [];
  const total = []
  _.forEach(statements, c => {
    if (c.type === 'FunctionDeclaration') {
      fnS.push(c)
    } else {
      if (c.type === 'VariableDeclaration' && c.kind === 'var') {
        varS.push({
          ...c,
          declarations: _.map(c.declarations, item => {
            return {
              ...item,
              init: {
                type: 'Literal',
                raw: 'undefined',
                valueType: 'undefined',
              }
            }
          }),
          kind: 'var',
        })
      }
      total.push(c)
    }
  })
  total.unshift(...fnS, ...varS)
  return total;
}

export default function parseProgram(ast) {
  env.reset();
  const statements = geStatement(ast.body);
  _.forEach(statements, c => {
    parseAst(c, env)
  });
  console.log(env);
}