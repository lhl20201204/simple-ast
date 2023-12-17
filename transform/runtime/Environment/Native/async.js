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
    return f.call(this,...args).next()
  }
}
`

export const _wrapGeneratorFunctionToAsyncFunctionAst ={
  "type": "FunctionExpression",
  "start": 0,
  "end": 94,
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
    "end": 94,
    "body": [
      {
        "type": "ReturnStatement",
        "start": 21,
        "end": 92,
        "argument": {
          "type": "FunctionExpression",
          "start": 28,
          "end": 92,
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
            "end": 92,
            "body": [
              {
                "type": "ReturnStatement",
                "start": 54,
                "end": 88,
                "argument": {
                  "type": "CallExpression",
                  "start": 61,
                  "end": 88,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 61,
                    "end": 86,
                    "object": {
                      "type": "CallExpression",
                      "start": 61,
                      "end": 81,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 61,
                        "end": 67,
                        "object": {
                          "type": "Identifier",
                          "start": 61,
                          "end": 62,
                          "name": "f"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 63,
                          "end": 67,
                          "name": "call"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "ThisExpression",
                          "start": 68,
                          "end": 72
                        },
                        {
                          "type": "SpreadElement",
                          "start": 73,
                          "end": 80,
                          "argument": {
                            "type": "Identifier",
                            "start": 76,
                            "end": 80,
                            "name": "args"
                          }
                        }
                      ],
                      "optional": false
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 82,
                      "end": 86,
                      "name": "next"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [],
                  "optional": false
                }
              }
            ]
          }
        }
      }
    ]
  }
} || {
  "type": "FunctionExpression",
  "start": 0,
  "end": 308,
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
    "end": 308,
    "body": [
      {
        "type": "FunctionDeclaration",
        "start": 21,
        "end": 208,
        "id": {
          "type": "Identifier",
          "start": 30,
          "end": 51,
          "name": "_runGeneratorInstance"
        },
        "expression": false,
        "generator": false,
        "async": false,
        "params": [
          {
            "type": "Identifier",
            "start": 52,
            "end": 53,
            "name": "g"
          },
          {
            "type": "Identifier",
            "start": 55,
            "end": 56,
            "name": "v"
          }
        ],
        "body": {
          "type": "BlockStatement",
          "start": 59,
          "end": 208,
          "body": [
            {
              "type": "VariableDeclaration",
              "start": 64,
              "end": 83,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 70,
                  "end": 83,
                  "id": {
                    "type": "Identifier",
                    "start": 70,
                    "end": 71,
                    "name": "t"
                  },
                  "init": {
                    "type": "CallExpression",
                    "start": 74,
                    "end": 83,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 74,
                      "end": 80,
                      "object": {
                        "type": "Identifier",
                        "start": 74,
                        "end": 75,
                        "name": "g"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 76,
                        "end": 80,
                        "name": "next"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 81,
                        "end": 82,
                        "name": "v"
                      }
                    ],
                    "optional": false
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "ReturnStatement",
              "start": 87,
              "end": 204,
              "argument": {
                "type": "ConditionalExpression",
                "start": 94,
                "end": 204,
                "test": {
                  "type": "MemberExpression",
                  "start": 94,
                  "end": 100,
                  "object": {
                    "type": "Identifier",
                    "start": 94,
                    "end": 95,
                    "name": "t"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 96,
                    "end": 100,
                    "name": "done"
                  },
                  "computed": false,
                  "optional": false
                },
                "consequent": {
                  "type": "CallExpression",
                  "start": 103,
                  "end": 121,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 103,
                    "end": 118,
                    "object": {
                      "type": "Identifier",
                      "start": 103,
                      "end": 110,
                      "name": "Promise"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 111,
                      "end": 118,
                      "name": "resolve"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "Identifier",
                      "start": 119,
                      "end": 120,
                      "name": "v"
                    }
                  ],
                  "optional": false
                },
                "alternate": {
                  "type": "CallExpression",
                  "start": 124,
                  "end": 204,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 124,
                    "end": 153,
                    "object": {
                      "type": "CallExpression",
                      "start": 124,
                      "end": 148,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 124,
                        "end": 139,
                        "object": {
                          "type": "Identifier",
                          "start": 124,
                          "end": 131,
                          "name": "Promise"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 132,
                          "end": 139,
                          "name": "resolve"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "MemberExpression",
                          "start": 140,
                          "end": 147,
                          "object": {
                            "type": "Identifier",
                            "start": 140,
                            "end": 141,
                            "name": "t"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 142,
                            "end": 147,
                            "name": "value"
                          },
                          "computed": false,
                          "optional": false
                        }
                      ],
                      "optional": false
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 149,
                      "end": 153,
                      "name": "then"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "ArrowFunctionExpression",
                      "start": 154,
                      "end": 203,
                      "id": null,
                      "expression": true,
                      "generator": false,
                      "async": false,
                      "params": [
                        {
                          "type": "Identifier",
                          "start": 154,
                          "end": 155,
                          "name": "r"
                        }
                      ],
                      "body": {
                        "type": "CallExpression",
                        "start": 159,
                        "end": 203,
                        "callee": {
                          "type": "MemberExpression",
                          "start": 159,
                          "end": 185,
                          "object": {
                            "type": "Identifier",
                            "start": 159,
                            "end": 180,
                            "name": "_runGeneratorInstance"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 181,
                            "end": 185,
                            "name": "call"
                          },
                          "computed": false,
                          "optional": false
                        },
                        "arguments": [
                          {
                            "type": "ThisExpression",
                            "start": 186,
                            "end": 190
                          },
                          {
                            "type": "Identifier",
                            "start": 192,
                            "end": 193,
                            "name": "g"
                          },
                          {
                            "type": "MemberExpression",
                            "start": 195,
                            "end": 202,
                            "object": {
                              "type": "Identifier",
                              "start": 195,
                              "end": 196,
                              "name": "t"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 197,
                              "end": 202,
                              "name": "value"
                            },
                            "computed": false,
                            "optional": false
                          }
                        ],
                        "optional": false
                      }
                    }
                  ],
                  "optional": false
                }
              }
            }
          ]
        }
      },
      {
        "type": "ReturnStatement",
        "start": 211,
        "end": 306,
        "argument": {
          "type": "FunctionExpression",
          "start": 218,
          "end": 306,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "RestElement",
              "start": 228,
              "end": 235,
              "argument": {
                "type": "Identifier",
                "start": 231,
                "end": 235,
                "name": "args"
              }
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 237,
            "end": 306,
            "body": [
              {
                "type": "ReturnStatement",
                "start": 244,
                "end": 305,
                "argument": {
                  "type": "CallExpression",
                  "start": 251,
                  "end": 305,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 251,
                    "end": 277,
                    "object": {
                      "type": "Identifier",
                      "start": 251,
                      "end": 272,
                      "name": "_runGeneratorInstance"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 273,
                      "end": 277,
                      "name": "call"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "ThisExpression",
                      "start": 278,
                      "end": 282
                    },
                    {
                      "type": "CallExpression",
                      "start": 284,
                      "end": 304,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 284,
                        "end": 290,
                        "object": {
                          "type": "Identifier",
                          "start": 284,
                          "end": 285,
                          "name": "f"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 286,
                          "end": 290,
                          "name": "call"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "ThisExpression",
                          "start": 291,
                          "end": 295
                        },
                        {
                          "type": "SpreadElement",
                          "start": 296,
                          "end": 303,
                          "argument": {
                            "type": "Identifier",
                            "start": 299,
                            "end": 303,
                            "name": "args"
                          }
                        }
                      ],
                      "optional": false
                    }
                  ],
                  "optional": false
                }
              }
            ]
          }
        }
      }
    ]
  }
}