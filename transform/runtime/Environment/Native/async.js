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
    return f.call(this,...args).next()
  }
}
`

export const _wrapGeneratorFunctionToAsyncFunctionAst = {
  "type": "FunctionExpression",
  "start": 13,
  "end": 107,
  "id": {
    "type": "Identifier",
    "start": 22,
    "end": 26,
    "name": "wrap"
  },
  "expression": false,
  "generator": false,
  "async": false,
  "params": [
    {
      "type": "Identifier",
      "start": 27,
      "end": 28,
      "name": "f"
    }
  ],
  "body": {
    "type": "BlockStatement",
    "start": 30,
    "end": 107,
    "body": [
      {
        "type": "ReturnStatement",
        "start": 34,
        "end": 105,
        "argument": {
          "type": "FunctionExpression",
          "start": 41,
          "end": 105,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "RestElement",
              "start": 51,
              "end": 58,
              "argument": {
                "type": "Identifier",
                "start": 54,
                "end": 58,
                "name": "args"
              }
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 60,
            "end": 105,
            "body": [
              {
                "type": "ReturnStatement",
                "start": 67,
                "end": 101,
                "argument": {
                  "type": "CallExpression",
                  "start": 74,
                  "end": 101,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 74,
                    "end": 99,
                    "object": {
                      "type": "CallExpression",
                      "start": 74,
                      "end": 94,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 74,
                        "end": 80,
                        "object": {
                          "type": "Identifier",
                          "start": 74,
                          "end": 75,
                          "name": "f"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 76,
                          "end": 80,
                          "name": "call"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "ThisExpression",
                          "start": 81,
                          "end": 85
                        },
                        {
                          "type": "SpreadElement",
                          "start": 86,
                          "end": 93,
                          "argument": {
                            "type": "Identifier",
                            "start": 89,
                            "end": 93,
                            "name": "args"
                          }
                        }
                      ],
                      "optional": false
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 95,
                      "end": 99,
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
}