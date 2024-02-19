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
    return Promise.resolve(f.call(this,...args).next().then(({ value }) => value))
  }
}
`

export const _wrapGeneratorFunctionToAsyncFunctionAst =  {
  "type": "FunctionExpression",
  "start": 0,
  "end": 138,
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
    "end": 138,
    "body": [
      {
        "type": "ReturnStatement",
        "start": 21,
        "end": 136,
        "argument": {
          "type": "FunctionExpression",
          "start": 28,
          "end": 136,
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
            "end": 136,
            "body": [
              {
                "type": "ReturnStatement",
                "start": 54,
                "end": 132,
                "argument": {
                  "type": "CallExpression",
                  "start": 61,
                  "end": 132,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 61,
                    "end": 76,
                    "object": {
                      "type": "Identifier",
                      "start": 61,
                      "end": 68,
                      "name": "Promise"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 69,
                      "end": 76,
                      "name": "resolve"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "CallExpression",
                      "start": 77,
                      "end": 131,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 77,
                        "end": 109,
                        "object": {
                          "type": "CallExpression",
                          "start": 77,
                          "end": 104,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 77,
                            "end": 102,
                            "object": {
                              "type": "CallExpression",
                              "start": 77,
                              "end": 97,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 77,
                                "end": 83,
                                "object": {
                                  "type": "Identifier",
                                  "start": 77,
                                  "end": 78,
                                  "name": "f"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 79,
                                  "end": 83,
                                  "name": "call"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "ThisExpression",
                                  "start": 84,
                                  "end": 88
                                },
                                {
                                  "type": "SpreadElement",
                                  "start": 89,
                                  "end": 96,
                                  "argument": {
                                    "type": "Identifier",
                                    "start": 92,
                                    "end": 96,
                                    "name": "args"
                                  }
                                }
                              ],
                              "optional": false
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 98,
                              "end": 102,
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
                          "start": 105,
                          "end": 109,
                          "name": "then"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "ArrowFunctionExpression",
                          "start": 110,
                          "end": 130,
                          "id": null,
                          "expression": true,
                          "generator": false,
                          "async": false,
                          "params": [
                            {
                              "type": "ObjectPattern",
                              "start": 111,
                              "end": 120,
                              "properties": [
                                {
                                  "type": "Property",
                                  "start": 113,
                                  "end": 118,
                                  "method": false,
                                  "shorthand": true,
                                  "computed": false,
                                  "key": {
                                    "type": "Identifier",
                                    "start": 113,
                                    "end": 118,
                                    "name": "value"
                                  },
                                  "kind": "init",
                                  "value": {
                                    "type": "Identifier",
                                    "start": 113,
                                    "end": 118,
                                    "name": "value"
                                  }
                                }
                              ]
                            }
                          ],
                          "body": {
                            "type": "Identifier",
                            "start": 125,
                            "end": 130,
                            "name": "value"
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