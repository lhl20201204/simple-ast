import parseAst from "..";
import Environment from "../Environment";
import AstConfig, { ensureAstHadConfig } from "../Environment/Generator/AstConfig";
import createEnviroment from "../Environment/createEnviroment";
import { createLiteralAst } from "../Environment/utils";
import { AST_DICTS, ENV_DICTS } from "../constant";
import { isYieldError } from "./parseYieldExpression";

export default function parseTryStatement(ast, env) {
  const runFinally = () => {
    const childEnv = createEnviroment('finally_of_env', env, {
      [ENV_DICTS.isFinallyEnv]: true,
      [ENV_DICTS.noNeedLookUpVar]: true
    })
    parseAst(ast.finalizer, childEnv)
    return childEnv;
  };
  function addFinally() {
    if (ast.finalizer) {
      runFinally()
    }
  }
  

  try {
    const childEnv = createEnviroment('try_of_env', env, {
      [ENV_DICTS.isTryEnv]: true,
      [ENV_DICTS.noNeedLookUpVar]: true
    })
    parseAst(ast.block, childEnv)
    addFinally(childEnv)
  } catch (e) {
    if (isYieldError(e)) {
      throw e;
    }
    if (!ast.handler) {
      if (ast.finalizer) {
       if (runFinally().hadReturn()) {
         return;
       }
      } 
      throw e;
    }

    const childEnv = createEnviroment('catch_of_env', env, {
      [ENV_DICTS.isCatchEnv]: true,
      [ENV_DICTS.noNeedLookUpVar]: true
    })
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
    parseAst(ast.handler.body, childEnv)
    addFinally()
  }
}