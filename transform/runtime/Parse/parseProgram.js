import _ from "lodash";
import parseAst from "..";
import { getWindowEnv } from "../Environment/getWindow";
import { RUNTIME_LITERAL } from "../constant";
import { initEnviroment } from "../Environment/initEnviroment";
export function geStatement(statements) {
  const fnS = []
  const varS = [];
  const letConstS = []
  const total = []
  const lookupVar = (c) => {
    if (c.type === 'VariableDeclaration' && c.kind === 'var') {
      varS.push({
        ...c,
        declarations: _.map(c.declarations, item => {
          return {
            ...item,
            init: {
              type: 'Identifier',
              name: `${RUNTIME_LITERAL.undefined}`
            }
          }
        }),
        kind: 'var',
      })
    } else if (c.type === 'FunctionDeclaration') {
      varS.push({
        type: 'VariableDeclaration',
        declarations:[{
          type: 'VariableDeclarator',
          id: c.id, // todo,
          init: {
            type: 'Identifier',
            name: `${RUNTIME_LITERAL.undefined}`
          }
        }],
        kind: 'var',
      })
    }
  }
  // 遍历for循环和if语句里的block，找到var使其提升
  const findVarInForIf = (ast) => {
    if (ast.type === 'BlockStatement') {
      _.forEach(ast.body, findVarInForIf)
    }else if (ast.type === 'ForStatement') {
      lookupVar(ast.init)
      findVarInForIf(ast.body);
    } else if (['ForOfStatement', 'ForInStatement'].includes(ast.type) ) {
      lookupVar(ast.left);
      findVarInForIf(ast.body);
    } else if (ast.type === 'IfStatement') {
      findVarInForIf(ast.consequent)
      if (ast.alternate ) {
        findVarInForIf(ast.alternate)
      }
    } 
    lookupVar(ast)
  }
  _.forEach(statements, c => {
    if (c.type === 'FunctionDeclaration') {
      fnS.push(c)
    } else if (c.type === 'ClassDeclaration') {
      letConstS.push({
        type: 'PreDeclaration',
        declarations:[{
          type: 'VariableDeclarator',
          id: c.id, // todo,
          init: null
        }],
        kind: 'class',
      })
      total.push(c)
    } else {
      if (c.type === 'VariableDeclaration' ) {
        if (c.kind === 'var') {
          lookupVar(c)
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
      } else {
        findVarInForIf(c)
      }
      total.push(c)
    }
  })
  total.unshift(...fnS, ...varS, ...letConstS)
  return total;
}

export default function parseProgram(ast) {
  const env = getWindowEnv()
  initEnviroment()
  const statements = geStatement(ast.body);
  _.forEach(statements, c => {
    parseAst(c, env)
  });
}