const code = `
function Error(message){
  return {
    message
  }
}
`

export const _ErrorAst = {
  "type": "FunctionDeclaration",
  "start": 0,
  "end": 53,
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
    "start": 23,
    "end": 53,
    "body": [
      {
        "type": "ReturnStatement",
        "start": 27,
        "end": 51,
        "argument": {
          "type": "ObjectExpression",
          "start": 34,
          "end": 51,
          "properties": [
            {
              "type": "Property",
              "start": 40,
              "end": 47,
              "method": false,
              "shorthand": true,
              "computed": false,
              "key": {
                "type": "Identifier",
                "start": 40,
                "end": 47,
                "name": "message"
              },
              "kind": "init",
              "value": {
                "type": "Identifier",
                "start": 40,
                "end": 47,
                "name": "message"
              }
            }
          ]
        }
      }
    ]
  }
}