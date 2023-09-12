import parseAst from "..";
import Environment from "../Environment";
import { createLiteralAst } from "../Environment/utils";
import { ENV_DICTS } from "../constant";
import { isYieldError } from "./parseYieldExpression";

export default function parseTryStatement(ast, env) {
  const runFinally = () => {
    const childEnv = new Environment('finally_of_env', env, {
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
    const childEnv = new Environment('try_of_env', env, {
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

    const childEnv = new Environment('catch_of_env', env, {
      [ENV_DICTS.isCatchEnv]: true,
      [ENV_DICTS.noNeedLookUpVar]: true
    })
    const { param } = ast.handler;
    const { message } = e;
    if (param) {
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
        "kind": "let"
      }, childEnv)
    }
    parseAst(ast.handler.body, childEnv)
    addFinally()
  }
}