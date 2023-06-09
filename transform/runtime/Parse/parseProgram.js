import _ from "lodash";
import parseAst from "..";
import { getCannotAccessBeforeInitialization, getWindowEnv } from "../Environment/getWindow";
export function geStatement(statements) {
  const fnS = []
  const varS = [];
  const letConstS = []
  const total = []
  _.forEach(statements, c => {
    if (c.type === 'FunctionDeclaration') {
      fnS.push(c)
    } else {
      if (c.type === 'VariableDeclaration' ) {
        if (c.kind === 'var') {
          varS.push({
            ...c,
            declarations: _.map(c.declarations, item => {
              return {
                ...item,
                init: {
                  type: 'Literal',
                  raw: 'undefined',
                  value: undefined,
                  valueType: 'undefined',
                }
              }
            }),
            kind: 'var',
          })
        } else if (['let', 'const'].includes(c.kind)) {
          letConstS.push({
            ...c,
            type: 'PreDeclaration',
            declarations: _.map(c.declarations, item => {
              return {
                ...item,
                init: null,
              }
            }),
            kind: c.kind,
          })
        }
      }
      total.push(c)
    }
  })
  total.unshift(...fnS, ...varS, ...letConstS)
  return total;
}

export default function parseProgram(ast) {
  const env = getWindowEnv()
  env.reset();
  const statements = geStatement(ast.body);
  _.forEach(statements, c => {
    parseAst(c, env)
  });
}