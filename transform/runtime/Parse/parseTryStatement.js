import parseAst from "..";
import Environment from "../Environment";
import { createLiteralAst } from "../Environment/utils";
import { ENV_DICTS } from "../constant";

export default function parseTryStatement(ast, env){

    try{
      const childEnv = new Environment('try_of_env', env, {
        [ENV_DICTS.isTryEnv]: true,
        [ENV_DICTS.noNeedLookUpVar]: true
      })
      parseAst(ast.block, childEnv)
    } catch(e) {
      const childEnv = new Environment('catch_of_env',  env, {
        [ENV_DICTS.isCatchEnv]: true,
        [ENV_DICTS.noNeedLookUpVar]: true
      })
      const { param } = ast.handler;
      const { message } = e;
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
      parseAst(ast.handler.body, childEnv)
    } finally{
      if (ast.finalizer){
        const childEnv = new Environment('finally_of_env', env, {
          [ENV_DICTS.isFinallyEnv]: true,
          [ENV_DICTS.noNeedLookUpVar]: true
        })
        parseAst(ast.finalizer, childEnv)
      }
    }

}