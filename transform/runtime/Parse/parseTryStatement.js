import parseAst from "..";
import Environment from "../Environment";
import AstConfig, { ensureAstHadConfig } from "../Environment/Generator/AstConfig";
import createEnviroment, { createEmptyEnviromentExtraConfig } from "../Environment/createEnviroment";
import { createLiteralAst } from "../Environment/utils";
import { AST_DICTS, ENV_DICTS } from "../constant";
import { getYieldValue, isYieldError } from "./parseYieldExpression";

export default function parseTryStatement(ast, env) {
  const runFinally = () => {
    // console.error('finally run', ast.finalizer)
    const childEnv = createEnviroment('finally_of_env', env, {
      [ENV_DICTS.isFinallyEnv]: true,
      [ENV_DICTS.noNeedLookUpVar]: true
    }, createEmptyEnviromentExtraConfig({ ast: ast.finalizer }))
    try{
      parseAst(ast.finalizer, childEnv)
    }catch(e) {
      // console.log(e, getYieldValue(e))
      throw e
    }
   
    return childEnv;
  };
  function addFinally() {
    if (ast.finalizer) {
      runFinally()
    }
  }

  const childEnv = createEnviroment('try_of_env', env, {
    [ENV_DICTS.isTryEnv]: true,
    [ENV_DICTS.noNeedLookUpVar]: true
  }, createEmptyEnviromentExtraConfig({ ast: ast.block }))
  try {
    parseAst(ast.block, childEnv)
  } catch (e) {
    if (isYieldError(e)) {
      throw e;
    }
    if (!ast.handler) {
      if (ast.finalizer) {
       if (runFinally().hadReturn()) {
        // console.log('提前return')
         return;
       }
      } 
      throw e;
    }

    const childEnv = createEnviroment('catch_of_env', env, {
      [ENV_DICTS.isCatchEnv]: true,
      [ENV_DICTS.noNeedLookUpVar]: true
    }, createEmptyEnviromentExtraConfig({ ast: ast.handler.body }))
    const { param } = ast.handler;
    const { message } = e;
    if (param) {
      ensureAstHadConfig(param);
      parseAst({
        "type": "VariableDeclaration",
        "declarations": [
          {
            "type": "VariableDeclarator",
            "id": param,
            "init": {
              "type": "NewExpression",
              "callee": {
                "type": "Identifier",
                "name": "Error"
              },
              "arguments": [
                createLiteralAst(message)
              ]
            }
          }
        ],
        "kind": "let",
        [AST_DICTS._config]: param[AST_DICTS._config],
      }, childEnv)
    }
    try {
      parseAst(ast.handler.body, childEnv)
    } catch(e) {
      if (!isYieldError(e)) {
        if (ast.finalizer) {
          if (runFinally().hadReturn()) {
           // console.log('提前return')
            return;
          }
        } 
      }
      throw e;
    }
  }
  addFinally()
}