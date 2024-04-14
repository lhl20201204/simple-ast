import parseAst from "..";
import { createArray, createObject } from "../Environment/RuntimeValueInstance";
import { createRuntimeValueAst } from "../Environment/utils";
import { AST_DICTS } from "../constant";

export default function parseTaggedTemplateExpression(ast, env) {
  const isGeneratorEnv = env.canYieldAble()
  const { tag, quasi } = ast;
  const getArgsRv = () => createArray(_.map(quasi.quasis, 'value.raw'));

  const retRv = getArgsRv()
  const obj = {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": "Reflect"
      },
      "property": {
        "type": "Identifier",
        "name": "defineProperty"
      },
      "computed": false,
      "optional": false
    },
    "arguments": [
      createRuntimeValueAst(retRv),
      {
        "type": "Literal",
        "value": "raw",
        "raw": "'raw'"
      },
      createRuntimeValueAst(createObject({
        value: getArgsRv(),
      }))
    ],
    "optional": false
  };
  const astConfig = ast[AST_DICTS._config];
  if (isGeneratorEnv) {
    _.set(obj, AST_DICTS._config, astConfig.getTaggedTemplateExpressionReflectAstConfig())
  }
  parseAst(obj, env)

  const ret = parseAst(ast.tag, env);
  const obj2 = {
    type: 'CallExpression',
    callee: createRuntimeValueAst(ret),
    arguments: [createRuntimeValueAst(retRv)],
    optional: false,
  };
  if (isGeneratorEnv) {
    _.set(obj2, AST_DICTS._config, astConfig.getTaggedTemplateExpressionExectueAstConfig())
  }
  return parseAst(obj2, env)
}