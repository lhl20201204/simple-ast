export const _code = `
function wrap(f) {
  function _runGeneratorInstance(g, v)  {
   const t = g.next(v)
   return t.done ? Promise.resolve(v) : Promise.resolve(t.value).then(r => _runGeneratorInstance.call(this, g, v))
  }
  return function (...args) { 
    return _runGeneratorInstance.call(this, f.call(this,...args))}
}
`

export const _wrapGeneratorFunctionToAsyncFunctionAst = {
  "type": "FunctionExpression",
  "start": 130,
  "end": 432,
  "id": {
    "type": "Identifier",
    "start": 139,
    "end": 143,
    "name": "wrap"
  },
  "expression": false,
  "generator": false,
  "async": false,
  "params": [
    {
      "type": "Identifier",
      "start": 144,
      "end": 145,
      "name": "f"
    }
  ],
  "body": {
    "type": "BlockStatement",
    "start": 147,
    "end": 432,
    "body": [
      {
        "type": "FunctionDeclaration",
        "start": 151,
        "end": 332,
        "id": {
          "type": "Identifier",
          "start": 160,
          "end": 181,
          "name": "_runGeneratorInstance"
        },
        "expression": false,
        "generator": false,
        "async": false,
        "params": [
          {
            "type": "Identifier",
            "start": 182,
            "end": 183,
            "name": "g"
          },
          {
            "type": "Identifier",
            "start": 185,
            "end": 186,
            "name": "v"
          }
        ],
        "body": {
          "type": "BlockStatement",
          "start": 189,
          "end": 332,
          "body": [
            {
              "type": "VariableDeclaration",
              "start": 194,
              "end": 213,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 200,
                  "end": 213,
                  "id": {
                    "type": "Identifier",
                    "start": 200,
                    "end": 201,
                    "name": "t"
                  },
                  "init": {
                    "type": "CallExpression",
                    "start": 204,
                    "end": 213,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 204,
                      "end": 210,
                      "object": {
                        "type": "Identifier",
                        "start": 204,
                        "end": 205,
                        "name": "g"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 206,
                        "end": 210,
                        "name": "next"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 211,
                        "end": 212,
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
              "start": 217,
              "end": 328,
              "argument": {
                "type": "ConditionalExpression",
                "start": 224,
                "end": 328,
                "test": {
                  "type": "MemberExpression",
                  "start": 224,
                  "end": 230,
                  "object": {
                    "type": "Identifier",
                    "start": 224,
                    "end": 225,
                    "name": "t"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 226,
                    "end": 230,
                    "name": "done"
                  },
                  "computed": false,
                  "optional": false
                },
                "consequent": {
                  "type": "CallExpression",
                  "start": 233,
                  "end": 251,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 233,
                    "end": 248,
                    "object": {
                      "type": "Identifier",
                      "start": 233,
                      "end": 240,
                      "name": "Promise"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 241,
                      "end": 248,
                      "name": "resolve"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "Identifier",
                      "start": 249,
                      "end": 250,
                      "name": "v"
                    }
                  ],
                  "optional": false
                },
                "alternate": {
                  "type": "CallExpression",
                  "start": 254,
                  "end": 328,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 254,
                    "end": 283,
                    "object": {
                      "type": "CallExpression",
                      "start": 254,
                      "end": 278,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 254,
                        "end": 269,
                        "object": {
                          "type": "Identifier",
                          "start": 254,
                          "end": 261,
                          "name": "Promise"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 262,
                          "end": 269,
                          "name": "resolve"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "MemberExpression",
                          "start": 270,
                          "end": 277,
                          "object": {
                            "type": "Identifier",
                            "start": 270,
                            "end": 271,
                            "name": "t"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 272,
                            "end": 277,
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
                      "start": 279,
                      "end": 283,
                      "name": "then"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "ArrowFunctionExpression",
                      "start": 284,
                      "end": 327,
                      "id": null,
                      "expression": true,
                      "generator": false,
                      "async": false,
                      "params": [
                        {
                          "type": "Identifier",
                          "start": 284,
                          "end": 285,
                          "name": "r"
                        }
                      ],
                      "body": {
                        "type": "CallExpression",
                        "start": 289,
                        "end": 327,
                        "callee": {
                          "type": "MemberExpression",
                          "start": 289,
                          "end": 315,
                          "object": {
                            "type": "Identifier",
                            "start": 289,
                            "end": 310,
                            "name": "_runGeneratorInstance"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 311,
                            "end": 315,
                            "name": "call"
                          },
                          "computed": false,
                          "optional": false
                        },
                        "arguments": [
                          {
                            "type": "ThisExpression",
                            "start": 316,
                            "end": 320
                          },
                          {
                            "type": "Identifier",
                            "start": 322,
                            "end": 323,
                            "name": "g"
                          },
                          {
                            "type": "Identifier",
                            "start": 325,
                            "end": 326,
                            "name": "v"
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
        "start": 335,
        "end": 430,
        "argument": {
          "type": "FunctionExpression",
          "start": 342,
          "end": 430,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "RestElement",
              "start": 352,
              "end": 359,
              "argument": {
                "type": "Identifier",
                "start": 355,
                "end": 359,
                "name": "args"
              }
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 361,
            "end": 430,
            "body": [
              {
                "type": "ReturnStatement",
                "start": 368,
                "end": 429,
                "argument": {
                  "type": "CallExpression",
                  "start": 375,
                  "end": 429,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 375,
                    "end": 401,
                    "object": {
                      "type": "Identifier",
                      "start": 375,
                      "end": 396,
                      "name": "_runGeneratorInstance"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 397,
                      "end": 401,
                      "name": "call"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "ThisExpression",
                      "start": 402,
                      "end": 406
                    },
                    {
                      "type": "CallExpression",
                      "start": 408,
                      "end": 428,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 408,
                        "end": 414,
                        "object": {
                          "type": "Identifier",
                          "start": 408,
                          "end": 409,
                          "name": "f"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 410,
                          "end": 414,
                          "name": "call"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "ThisExpression",
                          "start": 415,
                          "end": 419
                        },
                        {
                          "type": "SpreadElement",
                          "start": 420,
                          "end": 427,
                          "argument": {
                            "type": "Identifier",
                            "start": 423,
                            "end": 427,
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