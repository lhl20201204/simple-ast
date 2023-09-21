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
  "start": 2,
  "end": 139,
  "expression": {
    "type": "AssignmentExpression",
    "start": 2,
    "end": 139,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 2,
      "end": 34,
      "object": {
        "type": "MemberExpression",
        "start": 2,
        "end": 17,
        "object": {
          "type": "Identifier",
          "start": 2,
          "end": 7,
          "name": "Array"
        },
        "property": {
          "type": "Identifier",
          "start": 8,
          "end": 17,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "MemberExpression",
        "start": 18,
        "end": 33,
        "object": {
          "type": "Identifier",
          "start": 18,
          "end": 24,
          "name": "Symbol"
        },
        "property": {
          "type": "Identifier",
          "start": 25,
          "end": 33,
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
      "start": 37,
      "end": 139,
      "id": {
        "type": "Identifier",
        "start": 48,
        "end": 69,
        "name": "Array$Symbol$iterator"
      },
      "expression": false,
      "generator": true,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 72,
        "end": 139,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 76,
            "end": 86,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 80,
                "end": 85,
                "id": {
                  "type": "Identifier",
                  "start": 80,
                  "end": 81,
                  "name": "i"
                },
                "init": {
                  "type": "Literal",
                  "start": 84,
                  "end": 85,
                  "value": 0,
                  "raw": "0"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "WhileStatement",
            "start": 89,
            "end": 137,
            "test": {
              "type": "BinaryExpression",
              "start": 95,
              "end": 110,
              "left": {
                "type": "Identifier",
                "start": 95,
                "end": 96,
                "name": "i"
              },
              "operator": "<",
              "right": {
                "type": "MemberExpression",
                "start": 99,
                "end": 110,
                "object": {
                  "type": "ThisExpression",
                  "start": 99,
                  "end": 103
                },
                "property": {
                  "type": "Identifier",
                  "start": 104,
                  "end": 110,
                  "name": "length"
                },
                "computed": false,
                "optional": false
              }
            },
            "body": {
              "type": "BlockStatement",
              "start": 112,
              "end": 137,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 118,
                  "end": 133,
                  "expression": {
                    "type": "YieldExpression",
                    "start": 118,
                    "end": 133,
                    "delegate": false,
                    "argument": {
                      "type": "MemberExpression",
                      "start": 124,
                      "end": 133,
                      "object": {
                        "type": "ThisExpression",
                        "start": 124,
                        "end": 128
                      },
                      "property": {
                        "type": "UpdateExpression",
                        "start": 129,
                        "end": 132,
                        "operator": "++",
                        "prefix": false,
                        "argument": {
                          "type": "Identifier",
                          "start": 129,
                          "end": 130,
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