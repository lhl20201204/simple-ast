const code = `
function Object(x) {
  for(const attr in obj) {
      this[attr] = obj[attr]
  }
}
`

export const _ObjectAst = {
  "type": "FunctionDeclaration",
  "start": 0,
  "end": 82,
  "id": {
    "type": "Identifier",
    "start": 9,
    "end": 15,
    "name": "Object"
  },
  "expression": false,
  "generator": false,
  "async": false,
  "params": [
    {
      "type": "Identifier",
      "start": 16,
      "end": 17,
      "name": "x"
    }
  ],
  "body": {
    "type": "BlockStatement",
    "start": 19,
    "end": 82,
    "body": [
      {
        "type": "ForInStatement",
        "start": 23,
        "end": 80,
        "left": {
          "type": "VariableDeclaration",
          "start": 27,
          "end": 37,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 33,
              "end": 37,
              "id": {
                "type": "Identifier",
                "start": 33,
                "end": 37,
                "name": "attr"
              },
              "init": null
            }
          ],
          "kind": "const"
        },
        "right": {
          "type": "Identifier",
          "start": 41,
          "end": 44,
          "name": "obj"
        },
        "body": {
          "type": "BlockStatement",
          "start": 46,
          "end": 80,
          "body": [
            {
              "type": "ExpressionStatement",
              "start": 54,
              "end": 76,
              "expression": {
                "type": "AssignmentExpression",
                "start": 54,
                "end": 76,
                "operator": "=",
                "left": {
                  "type": "MemberExpression",
                  "start": 54,
                  "end": 64,
                  "object": {
                    "type": "ThisExpression",
                    "start": 54,
                    "end": 58
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 59,
                    "end": 63,
                    "name": "attr"
                  },
                  "computed": true,
                  "optional": false
                },
                "right": {
                  "type": "MemberExpression",
                  "start": 67,
                  "end": 76,
                  "object": {
                    "type": "Identifier",
                    "start": 67,
                    "end": 70,
                    "name": "obj"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 71,
                    "end": 75,
                    "name": "attr"
                  },
                  "computed": true,
                  "optional": false
                }
              }
            }
          ]
        }
      }
    ]
  }
}