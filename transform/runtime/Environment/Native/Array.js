const code = `
Array.prototype[Symbol.iterator] = function * Array$Symbol$iterator() {
  let i = 0;
  while(i < this.length) {
    yield this[i++]
  }
}
`

export const _ArraySymbolIteratorAst = {
  "type": "ExpressionStatement",
  "start": 0,
  "end": 137,
  "expression": {
    "type": "AssignmentExpression",
    "start": 0,
    "end": 137,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 0,
      "end": 32,
      "object": {
        "type": "MemberExpression",
        "start": 0,
        "end": 15,
        "object": {
          "type": "Identifier",
          "start": 0,
          "end": 5,
          "name": "Array"
        },
        "property": {
          "type": "Identifier",
          "start": 6,
          "end": 15,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "MemberExpression",
        "start": 16,
        "end": 31,
        "object": {
          "type": "Identifier",
          "start": 16,
          "end": 22,
          "name": "Symbol"
        },
        "property": {
          "type": "Identifier",
          "start": 23,
          "end": 31,
          "name": "iterator"
        },
        "computed": false,
        "optional": false
      },
      "computed": true,
      "optional": false
    },
    "right": {
      "type": "FunctionExpression",
      "start": 35,
      "end": 137,
      "id": {
        "type": "Identifier",
        "start": 46,
        "end": 67,
        "name": "Array$Symbol$iterator"
      },
      "expression": false,
      "generator": true,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 70,
        "end": 137,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 74,
            "end": 84,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 78,
                "end": 83,
                "id": {
                  "type": "Identifier",
                  "start": 78,
                  "end": 79,
                  "name": "i"
                },
                "init": {
                  "type": "Literal",
                  "start": 82,
                  "end": 83,
                  "value": 0,
                  "raw": "0"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "WhileStatement",
            "start": 87,
            "end": 135,
            "test": {
              "type": "BinaryExpression",
              "start": 93,
              "end": 108,
              "left": {
                "type": "Identifier",
                "start": 93,
                "end": 94,
                "name": "i"
              },
              "operator": "<",
              "right": {
                "type": "MemberExpression",
                "start": 97,
                "end": 108,
                "object": {
                  "type": "ThisExpression",
                  "start": 97,
                  "end": 101
                },
                "property": {
                  "type": "Identifier",
                  "start": 102,
                  "end": 108,
                  "name": "length"
                },
                "computed": false,
                "optional": false
              }
            },
            "body": {
              "type": "BlockStatement",
              "start": 110,
              "end": 135,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 116,
                  "end": 131,
                  "expression": {
                    "type": "YieldExpression",
                    "start": 116,
                    "end": 131,
                    "delegate": false,
                    "argument": {
                      "type": "MemberExpression",
                      "start": 122,
                      "end": 131,
                      "object": {
                        "type": "ThisExpression",
                        "start": 122,
                        "end": 126
                      },
                      "property": {
                        "type": "UpdateExpression",
                        "start": 127,
                        "end": 130,
                        "operator": "++",
                        "prefix": false,
                        "argument": {
                          "type": "Identifier",
                          "start": 127,
                          "end": 128,
                          "name": "i"
                        }
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
  }
}