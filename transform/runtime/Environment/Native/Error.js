const code = `
function Error(message) {
  this.message = message
}
`

export const _ErrorAst =  {
  "type": "FunctionDeclaration",
  "start": 0,
  "end": 81,
  "id": {
    "type": "Identifier",
    "start": 9,
    "end": 14,
    "name": "Error"
  },
  "expression": false,
  "generator": false,
  "async": false,
  "params": [
    {
      "type": "Identifier",
      "start": 15,
      "end": 22,
      "name": "message"
    }
  ],
  "body": {
    "type": "BlockStatement",
    "start": 24,
    "end": 81,
    "body": [
      {
        "type": "ExpressionStatement",
        "start": 28,
        "end": 54,
        "expression": {
          "type": "CallExpression",
          "start": 28,
          "end": 54,
          "callee": {
            "type": "MemberExpression",
            "start": 28,
            "end": 39,
            "object": {
              "type": "Identifier",
              "start": 28,
              "end": 35,
              "name": "console"
            },
            "property": {
              "type": "Identifier",
              "start": 36,
              "end": 39,
              "name": "log"
            },
            "computed": false,
            "optional": false
          },
          "arguments": [
            {
              "type": "Literal",
              "start": 40,
              "end": 47,
              "value": "Error",
              "raw": "'Error'"
            },
            {
              "type": "ThisExpression",
              "start": 49,
              "end": 53
            }
          ],
          "optional": false
        }
      },
      {
        "type": "ExpressionStatement",
        "start": 57,
        "end": 79,
        "expression": {
          "type": "AssignmentExpression",
          "start": 57,
          "end": 79,
          "operator": "=",
          "left": {
            "type": "MemberExpression",
            "start": 57,
            "end": 69,
            "object": {
              "type": "ThisExpression",
              "start": 57,
              "end": 61
            },
            "property": {
              "type": "Identifier",
              "start": 62,
              "end": 69,
              "name": "message"
            },
            "computed": false,
            "optional": false
          },
          "right": {
            "type": "Identifier",
            "start": 72,
            "end": 79,
            "name": "message"
          }
        }
      }
    ]
  }
}