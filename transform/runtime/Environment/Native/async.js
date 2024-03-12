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
// f 是async 函数包了generator。
// async function gg() { // your code } === wrap(async function * gg() { // your code })
function wrap(f) {
  return function (...args) { 
    return new Promise((res, rej)=> {
        f.call(this,...args).next()
        .then(({value}) => res(value),(e) => rej(e)) 
     }) 
  }
}
`

export const _wrapGeneratorFunctionToAsyncFunctionAst = {
  "type": "FunctionExpression",
  "start": 10,
  "end": 202,
  "id": {
    "type": "Identifier",
    "start": 19,
    "end": 23,
    "name": "wrap"
  },
  "expression": false,
  "generator": false,
  "async": false,
  "params": [
    {
      "type": "Identifier",
      "start": 24,
      "end": 25,
      "name": "f"
    }
  ],
  "body": {
    "type": "BlockStatement",
    "start": 27,
    "end": 202,
    "body": [
      {
        "type": "ReturnStatement",
        "start": 31,
        "end": 200,
        "argument": {
          "type": "FunctionExpression",
          "start": 38,
          "end": 200,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "RestElement",
              "start": 48,
              "end": 55,
              "argument": {
                "type": "Identifier",
                "start": 51,
                "end": 55,
                "name": "args"
              }
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 57,
            "end": 200,
            "body": [
              {
                "type": "ReturnStatement",
                "start": 64,
                "end": 195,
                "argument": {
                  "type": "NewExpression",
                  "start": 71,
                  "end": 195,
                  "callee": {
                    "type": "Identifier",
                    "start": 75,
                    "end": 82,
                    "name": "Promise"
                  },
                  "arguments": [
                    {
                      "type": "ArrowFunctionExpression",
                      "start": 83,
                      "end": 194,
                      "id": null,
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [
                        {
                          "type": "Identifier",
                          "start": 84,
                          "end": 87,
                          "name": "res"
                        },
                        {
                          "type": "Identifier",
                          "start": 89,
                          "end": 92,
                          "name": "rej"
                        }
                      ],
                      "body": {
                        "type": "BlockStatement",
                        "start": 96,
                        "end": 194,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 106,
                            "end": 186,
                            "expression": {
                              "type": "CallExpression",
                              "start": 106,
                              "end": 186,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 106,
                                "end": 147,
                                "object": {
                                  "type": "CallExpression",
                                  "start": 106,
                                  "end": 133,
                                  "callee": {
                                    "type": "MemberExpression",
                                    "start": 106,
                                    "end": 131,
                                    "object": {
                                      "type": "CallExpression",
                                      "start": 106,
                                      "end": 126,
                                      "callee": {
                                        "type": "MemberExpression",
                                        "start": 106,
                                        "end": 112,
                                        "object": {
                                          "type": "Identifier",
                                          "start": 106,
                                          "end": 107,
                                          "name": "f"
                                        },
                                        "property": {
                                          "type": "Identifier",
                                          "start": 108,
                                          "end": 112,
                                          "name": "call"
                                        },
                                        "computed": false,
                                        "optional": false
                                      },
                                      "arguments": [
                                        {
                                          "type": "ThisExpression",
                                          "start": 113,
                                          "end": 117
                                        },
                                        {
                                          "type": "SpreadElement",
                                          "start": 118,
                                          "end": 125,
                                          "argument": {
                                            "type": "Identifier",
                                            "start": 121,
                                            "end": 125,
                                            "name": "args"
                                          }
                                        }
                                      ],
                                      "optional": false
                                    },
                                    "property": {
                                      "type": "Identifier",
                                      "start": 127,
                                      "end": 131,
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
                                  "start": 143,
                                  "end": 147,
                                  "name": "then"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "ArrowFunctionExpression",
                                  "start": 148,
                                  "end": 171,
                                  "id": null,
                                  "expression": true,
                                  "generator": false,
                                  "async": false,
                                  "params": [
                                    {
                                      "type": "ObjectPattern",
                                      "start": 149,
                                      "end": 156,
                                      "properties": [
                                        {
                                          "type": "Property",
                                          "start": 150,
                                          "end": 155,
                                          "method": false,
                                          "shorthand": true,
                                          "computed": false,
                                          "key": {
                                            "type": "Identifier",
                                            "start": 150,
                                            "end": 155,
                                            "name": "value"
                                          },
                                          "kind": "init",
                                          "value": {
                                            "type": "Identifier",
                                            "start": 150,
                                            "end": 155,
                                            "name": "value"
                                          }
                                        }
                                      ]
                                    }
                                  ],
                                  "body": {
                                    "type": "CallExpression",
                                    "start": 161,
                                    "end": 171,
                                    "callee": {
                                      "type": "Identifier",
                                      "start": 161,
                                      "end": 164,
                                      "name": "res"
                                    },
                                    "arguments": [
                                      {
                                        "type": "Identifier",
                                        "start": 165,
                                        "end": 170,
                                        "name": "value"
                                      }
                                    ],
                                    "optional": false
                                  }
                                },
                                {
                                  "type": "ArrowFunctionExpression",
                                  "start": 172,
                                  "end": 185,
                                  "id": null,
                                  "expression": true,
                                  "generator": false,
                                  "async": false,
                                  "params": [
                                    {
                                      "type": "Identifier",
                                      "start": 173,
                                      "end": 174,
                                      "name": "e"
                                    }
                                  ],
                                  "body": {
                                    "type": "CallExpression",
                                    "start": 179,
                                    "end": 185,
                                    "callee": {
                                      "type": "Identifier",
                                      "start": 179,
                                      "end": 182,
                                      "name": "rej"
                                    },
                                    "arguments": [
                                      {
                                        "type": "Identifier",
                                        "start": 183,
                                        "end": 184,
                                        "name": "e"
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