export const _code = `
function wrap(f) {
  function _runGeneratorInstance(g, v)  {
   const t = g.next(v)
   return t.done ? Promise.resolve(v) : Promise.resolve(t.value).then(r => _runGeneratorInstance.call(this, g, t.value))
  }
  return function (...args) { 
    return _runGeneratorInstance.call(this, f.call(this,...args))}
}
`

export const _code2 = `
function wrap(f) {
  return function (...args) { 
    return new Promise(r => {
      f.call(this,...args).next().then(({value}) => r(value))
    }) 
  }
}
`

export const _wrapGeneratorFunctionToAsyncFunctionAst = {
  "type": "FunctionExpression",
  "start": 0,
  "end": 155,
  "id": {
    "type": "Identifier",
    "start": 9,
    "end": 13,
    "name": "wrap"
  },
  "expression": false,
  "generator": false,
  "async": false,
  "params": [
    {
      "type": "Identifier",
      "start": 14,
      "end": 15,
      "name": "f"
    }
  ],
  "body": {
    "type": "BlockStatement",
    "start": 17,
    "end": 155,
    "body": [
      {
        "type": "ReturnStatement",
        "start": 21,
        "end": 153,
        "argument": {
          "type": "FunctionExpression",
          "start": 28,
          "end": 153,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "RestElement",
              "start": 38,
              "end": 45,
              "argument": {
                "type": "Identifier",
                "start": 41,
                "end": 45,
                "name": "args"
              }
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 47,
            "end": 153,
            "body": [
              {
                "type": "ReturnStatement",
                "start": 54,
                "end": 148,
                "argument": {
                  "type": "NewExpression",
                  "start": 61,
                  "end": 148,
                  "callee": {
                    "type": "Identifier",
                    "start": 65,
                    "end": 72,
                    "name": "Promise"
                  },
                  "arguments": [
                    {
                      "type": "ArrowFunctionExpression",
                      "start": 73,
                      "end": 147,
                      "id": null,
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [
                        {
                          "type": "Identifier",
                          "start": 73,
                          "end": 74,
                          "name": "r"
                        }
                      ],
                      "body": {
                        "type": "BlockStatement",
                        "start": 78,
                        "end": 147,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 86,
                            "end": 141,
                            "expression": {
                              "type": "CallExpression",
                              "start": 86,
                              "end": 141,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 86,
                                "end": 118,
                                "object": {
                                  "type": "CallExpression",
                                  "start": 86,
                                  "end": 113,
                                  "callee": {
                                    "type": "MemberExpression",
                                    "start": 86,
                                    "end": 111,
                                    "object": {
                                      "type": "CallExpression",
                                      "start": 86,
                                      "end": 106,
                                      "callee": {
                                        "type": "MemberExpression",
                                        "start": 86,
                                        "end": 92,
                                        "object": {
                                          "type": "Identifier",
                                          "start": 86,
                                          "end": 87,
                                          "name": "f"
                                        },
                                        "property": {
                                          "type": "Identifier",
                                          "start": 88,
                                          "end": 92,
                                          "name": "call"
                                        },
                                        "computed": false,
                                        "optional": false
                                      },
                                      "arguments": [
                                        {
                                          "type": "ThisExpression",
                                          "start": 93,
                                          "end": 97
                                        },
                                        {
                                          "type": "SpreadElement",
                                          "start": 98,
                                          "end": 105,
                                          "argument": {
                                            "type": "Identifier",
                                            "start": 101,
                                            "end": 105,
                                            "name": "args"
                                          }
                                        }
                                      ],
                                      "optional": false
                                    },
                                    "property": {
                                      "type": "Identifier",
                                      "start": 107,
                                      "end": 111,
                                      "name": "next"
                                    },
                                    "computed": false,
                                    "optional": false
                                  },
                                  "arguments": [],
                                  "optional": false
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 114,
                                  "end": 118,
                                  "name": "then"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "ArrowFunctionExpression",
                                  "start": 119,
                                  "end": 140,
                                  "id": null,
                                  "expression": true,
                                  "generator": false,
                                  "async": false,
                                  "params": [
                                    {
                                      "type": "ObjectPattern",
                                      "start": 120,
                                      "end": 127,
                                      "properties": [
                                        {
                                          "type": "Property",
                                          "start": 121,
                                          "end": 126,
                                          "method": false,
                                          "shorthand": true,
                                          "computed": false,
                                          "key": {
                                            "type": "Identifier",
                                            "start": 121,
                                            "end": 126,
                                            "name": "value"
                                          },
                                          "kind": "init",
                                          "value": {
                                            "type": "Identifier",
                                            "start": 121,
                                            "end": 126,
                                            "name": "value"
                                          }
                                        }
                                      ]
                                    }
                                  ],
                                  "body": {
                                    "type": "CallExpression",
                                    "start": 132,
                                    "end": 140,
                                    "callee": {
                                      "type": "Identifier",
                                      "start": 132,
                                      "end": 133,
                                      "name": "r"
                                    },
                                    "arguments": [
                                      {
                                        "type": "Identifier",
                                        "start": 134,
                                        "end": 139,
                                        "name": "value"
                                      }
                                    ],
                                    "optional": false
                                  }
                                }
                              ],
                              "optional": false
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    ]
  }
}