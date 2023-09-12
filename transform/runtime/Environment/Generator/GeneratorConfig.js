import parseAst from "../..";
import { RUNTIME_LITERAL } from "../../constant";
import { createRuntimeValueAst } from "../utils";

export default class GeneratorConfig {
  constructor(x) {
    this.ast = x.ast;
    this.fnRv = x.fnRv;
    this.defineEnv = x.defineEnv;
    this.contextEnv = x.contextEnv;
    this.contextThis = x.contextThis;
    this.contextArguments = x.contextArguments
    this.runtimeStack = [];
  }

  runGeneratorFunction() {
    console.log(this.fnRv, 'generateConfig');
    parseAst({
      "type": "ExpressionStatement",
      "start": 23,
      "end": 38,
      "expression": {
        "type": "CallExpression",
        "start": 23,
        "end": 37,
        "callee": {
          "type": "MemberExpression",
          "start": 23,
          "end": 31,
          "object": createRuntimeValueAst(this.fnRv, this.fnRv.getDefinedName()),
          "property": {
            "type": "Identifier",
            "start": 26,
            "end": 31,
            "name": "apply"
          },
          "computed": false,
          "optional": false
        },
        "arguments": [
          createRuntimeValueAst(this.contextThis, RUNTIME_LITERAL.this),
          createRuntimeValueAst(this.contextArguments, RUNTIME_LITERAL.arguments),
        ],
        "optional": false
      }
    }, this.contextEnv)
  }
}