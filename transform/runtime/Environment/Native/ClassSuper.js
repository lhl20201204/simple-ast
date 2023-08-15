export const _classConstructorSuperAst = {
  "type": "MethodDefinition",
  "start": 126,
  "end": 171,
  "static": false,
  "computed": false,
  "key": {
    "type": "Identifier",
    "start": 126,
    "end": 137,
    "name": "constructor"
  },
  "kind": "constructor",
  "value": {
    "type": "FunctionExpression",
    "start": 137,
    "end": 171,
    "id": null,
    "expression": false,
    "generator": false,
    "async": false,
    "params": [
      {
        "type": "RestElement",
        "start": 138,
        "end": 145,
        "argument": {
          "type": "Identifier",
          "start": 141,
          "end": 145,
          "name": "args"
        }
      }
    ],
    "body": {
      "type": "BlockStatement",
      "start": 147,
      "end": 171,
      "body": [
        {
          "type": "ExpressionStatement",
          "start": 153,
          "end": 167,
          "expression": {
            "type": "CallExpression",
            "start": 153,
            "end": 167,
            "callee": {
              "type": "Super",
              "start": 153,
              "end": 158
            },
            "arguments": [
              {
                "type": "SpreadElement",
                "start": 159,
                "end": 166,
                "argument": {
                  "type": "Identifier",
                  "start": 162,
                  "end": 166,
                  "name": "args"
                }
              }
            ],
            "optional": false
          }
        }
      ]
    }
  }
}