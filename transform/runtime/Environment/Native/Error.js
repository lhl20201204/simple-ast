const code = `
function Error(message) {
  this.message = message
}
`

export const _ErrorAst = {
  "type": "FunctionDeclaration",
  "start": 0,
  "end": 52,
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
    "end": 52,
    "body": [
      {
        "type": "ExpressionStatement",
        "start": 28,
        "end": 50,
        "expression": {
          "type": "AssignmentExpression",
          "start": 28,
          "end": 50,
          "operator": "=",
          "left": {
            "type": "MemberExpression",
            "start": 28,
            "end": 40,
            "object": {
              "type": "ThisExpression",
              "start": 28,
              "end": 32
            },
            "property": {
              "type": "Identifier",
              "start": 33,
              "end": 40,
              "name": "message"
            },
            "computed": false,
            "optional": false
          },
          "right": {
            "type": "Identifier",
            "start": 43,
            "end": 50,
            "name": "message"
          }
        }
      }
    ]
  }
}