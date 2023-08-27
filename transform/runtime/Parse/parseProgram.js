import _ from "lodash";
import parseAst from "..";
import { getWindowEnv } from "../Environment/getWindow";
import { AST_DICTS, RUNTIME_LITERAL } from "../constant";
import { initEnviroment } from "../Environment/initEnviroment";
import generateCode from "../Generate";
export function geStatement(statements, totalAst = {}) {
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
  // 遍历for循环和if语句, switch里的block，找到var使其提升
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
    } else if (ast.type === 'SwitchStatement') {
      for(const c of ast.cases) {
        findVarInForIf({
          type: 'BlockStatement',
          body: c.consequent,
        })
      }
    }
    lookupVar(ast)
  }
  
  function prePlaceHolderLetOrConst(c) {
    if ([RUNTIME_LITERAL.let, RUNTIME_LITERAL.const].includes(c.kind)) {
      letConstS.push({
        ...c,
        type: AST_DICTS.PreDeclaration,
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

  const runStatement = (statements, excludeCheckVar) =>  {
    _.forEach(statements, c => {
      if (c.type === 'FunctionDeclaration') {
        fnS.push(c)
      } else if (c.type === 'ClassDeclaration') {
        letConstS.push({
          type: AST_DICTS.PreDeclaration,
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
          if (c.kind === 'var' && !excludeCheckVar) {
            lookupVar(c)
          } else if (['let', 'const'].includes(c.kind)) {
            prePlaceHolderLetOrConst(c)
          }
        } else {
          findVarInForIf(c)
        }
        total.push(c)
      }
    })
  }
  runStatement(statements);
  total.unshift(...fnS, ...varS, ...letConstS)
  // console.log(generateCode({
  //   type: 'BlockStatement',
  //   body: total,
  // }))
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