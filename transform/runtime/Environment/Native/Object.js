const code = `
function Object(x) {
  for(const attr in obj) {
      this[attr] = obj[attr]
  }
}
`

const code2 = `
Reflect.defineProperty(Object, 'create', {
  writable: true,
  enumerable: false,
  configurable: true,
  value: function create(y, rest){
    const x = new Object(x)
    if (y) {
      x.__proto__ = {...y, ...rest||{}}
    }
    return x;
  }
})
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

export const _ObjectCreateAst = {
  "type": "ExpressionStatement",
  "start": 0,
  "end": 246,
  "expression": {
    "type": "CallExpression",
    "start": 0,
    "end": 246,
    "callee": {
      "type": "MemberExpression",
      "start": 0,
      "end": 22,
      "object": {
        "type": "Identifier",
        "start": 0,
        "end": 7,
        "name": "Reflect"
      },
      "property": {
        "type": "Identifier",
        "start": 8,
        "end": 22,
        "name": "defineProperty"
      },
      "computed": false,
      "optional": false
    },
    "arguments": [
      {
        "type": "Identifier",
        "start": 23,
        "end": 29,
        "name": "Object"
      },
      {
        "type": "Literal",
        "start": 31,
        "end": 39,
        "value": "create",
        "raw": "'create'"
      },
      {
        "type": "ObjectExpression",
        "start": 41,
        "end": 245,
        "properties": [
          {
            "type": "Property",
            "start": 45,
            "end": 59,
            "method": false,
            "shorthand": false,
            "computed": false,
            "key": {
              "type": "Identifier",
              "start": 45,
              "end": 53,
              "name": "writable"
            },
            "value": {
              "type": "Literal",
              "start": 55,
              "end": 59,
              "value": true,
              "raw": "true"
            },
            "kind": "init"
          },
          {
            "type": "Property",
            "start": 63,
            "end": 80,
            "method": false,
            "shorthand": false,
            "computed": false,
            "key": {
              "type": "Identifier",
              "start": 63,
              "end": 73,
              "name": "enumerable"
            },
            "value": {
              "type": "Literal",
              "start": 75,
              "end": 80,
              "value": false,
              "raw": "false"
            },
            "kind": "init"
          },
          {
            "type": "Property",
            "start": 84,
            "end": 102,
            "method": false,
            "shorthand": false,
            "computed": false,
            "key": {
              "type": "Identifier",
              "start": 84,
              "end": 96,
              "name": "configurable"
            },
            "value": {
              "type": "Literal",
              "start": 98,
              "end": 102,
              "value": true,
              "raw": "true"
            },
            "kind": "init"
          },
          {
            "type": "Property",
            "start": 106,
            "end": 243,
            "method": false,
            "shorthand": false,
            "computed": false,
            "key": {
              "type": "Identifier",
              "start": 106,
              "end": 111,
              "name": "value"
            },
            "value": {
              "type": "FunctionExpression",
              "start": 113,
              "end": 243,
              "id": {
                "type": "Identifier",
                "start": 122,
                "end": 128,
                "name": "create"
              },
              "expression": false,
              "generator": false,
              "async": false,
              "params": [
                {
                  "type": "Identifier",
                  "start": 129,
                  "end": 130,
                  "name": "y"
                },
                {
                  "type": "Identifier",
                  "start": 132,
                  "end": 136,
                  "name": "rest"
                }
              ],
              "body": {
                "type": "BlockStatement",
                "start": 137,
                "end": 243,
                "body": [
                  {
                    "type": "VariableDeclaration",
                    "start": 143,
                    "end": 166,
                    "declarations": [
                      {
                        "type": "VariableDeclarator",
                        "start": 149,
                        "end": 166,
                        "id": {
                          "type": "Identifier",
                          "start": 149,
                          "end": 150,
                          "name": "x"
                        },
                        "init": {
                          "type": "NewExpression",
                          "start": 153,
                          "end": 166,
                          "callee": {
                            "type": "Identifier",
                            "start": 157,
                            "end": 163,
                            "name": "Object"
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 164,
                              "end": 165,
                              "name": "x"
                            }
                          ]
                        }
                      }
                    ],
                    "kind": "const"
                  },
                  {
                    "type": "IfStatement",
                    "start": 171,
                    "end": 225,
                    "test": {
                      "type": "Identifier",
                      "start": 175,
                      "end": 176,
                      "name": "y"
                    },
                    "consequent": {
                      "type": "BlockStatement",
                      "start": 178,
                      "end": 225,
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "start": 186,
                          "end": 219,
                          "expression": {
                            "type": "AssignmentExpression",
                            "start": 186,
                            "end": 219,
                            "operator": "=",
                            "left": {
                              "type": "MemberExpression",
                              "start": 186,
                              "end": 197,
                              "object": {
                                "type": "Identifier",
                                "start": 186,
                                "end": 187,
                                "name": "x"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 188,
                                "end": 197,
                                "name": "__proto__"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "right": {
                              "type": "ObjectExpression",
                              "start": 200,
                              "end": 219,
                              "properties": [
                                {
                                  "type": "SpreadElement",
                                  "start": 201,
                                  "end": 205,
                                  "argument": {
                                    "type": "Identifier",
                                    "start": 204,
                                    "end": 205,
                                    "name": "y"
                                  }
                                },
                                {
                                  "type": "SpreadElement",
                                  "start": 207,
                                  "end": 218,
                                  "argument": {
                                    "type": "LogicalExpression",
                                    "start": 210,
                                    "end": 218,
                                    "left": {
                                      "type": "Identifier",
                                      "start": 210,
                                      "end": 214,
                                      "name": "rest"
                                    },
                                    "operator": "||",
                                    "right": {
                                      "type": "ObjectExpression",
                                      "start": 216,
                                      "end": 218,
                                      "properties": []
                                    }
                                  }
                                }
                              ]
                            }
                          }
                        }
                      ]
                    },
                    "alternate": null
                  },
                  {
                    "type": "ReturnStatement",
                    "start": 230,
                    "end": 239,
                    "argument": {
                      "type": "Identifier",
                      "start": 237,
                      "end": 238,
                      "name": "x"
                    }
                  }
                ]
              }
            },
            "kind": "init"
          }
        ]
      }
    ],
    "optional": false
  }
}