let code = `
(()=> {
  let promiseResolve = null;
  let promiseReject = null;
  let promise =new Promise((res, rej) => {
    promiseResolve = res
    promiseReject = rej
  })
  return {
    promise,
    promiseResolve,
    promiseReject
  }
})();
`

export const _codePromiseResolveAst =  {
  "type": "CallExpression",
  "start": 0,
  "end": 232,
  "callee": {
    "type": "ArrowFunctionExpression",
    "start": 1,
    "end": 229,
    "id": null,
    "expression": false,
    "generator": false,
    "async": false,
    "params": [],
    "body": {
      "type": "BlockStatement",
      "start": 6,
      "end": 229,
      "body": [
        {
          "type": "VariableDeclaration",
          "start": 10,
          "end": 36,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 14,
              "end": 35,
              "id": {
                "type": "Identifier",
                "start": 14,
                "end": 28,
                "name": "promiseResolve"
              },
              "init": {
                "type": "Literal",
                "start": 31,
                "end": 35,
                "value": null,
                "raw": "null"
              }
            }
          ],
          "kind": "let"
        },
        {
          "type": "VariableDeclaration",
          "start": 39,
          "end": 64,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 43,
              "end": 63,
              "id": {
                "type": "Identifier",
                "start": 43,
                "end": 56,
                "name": "promiseReject"
              },
              "init": {
                "type": "Literal",
                "start": 59,
                "end": 63,
                "value": null,
                "raw": "null"
              }
            }
          ],
          "kind": "let"
        },
        {
          "type": "VariableDeclaration",
          "start": 67,
          "end": 161,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 71,
              "end": 161,
              "id": {
                "type": "Identifier",
                "start": 71,
                "end": 78,
                "name": "promise"
              },
              "init": {
                "type": "NewExpression",
                "start": 80,
                "end": 161,
                "callee": {
                  "type": "Identifier",
                  "start": 84,
                  "end": 91,
                  "name": "Promise"
                },
                "arguments": [
                  {
                    "type": "ArrowFunctionExpression",
                    "start": 92,
                    "end": 160,
                    "id": null,
                    "expression": false,
                    "generator": false,
                    "async": false,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 93,
                        "end": 96,
                        "name": "res"
                      },
                      {
                        "type": "Identifier",
                        "start": 98,
                        "end": 101,
                        "name": "rej"
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 106,
                      "end": 160,
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "start": 112,
                          "end": 132,
                          "expression": {
                            "type": "AssignmentExpression",
                            "start": 112,
                            "end": 132,
                            "operator": "=",
                            "left": {
                              "type": "Identifier",
                              "start": 112,
                              "end": 126,
                              "name": "promiseResolve"
                            },
                            "right": {
                              "type": "Identifier",
                              "start": 129,
                              "end": 132,
                              "name": "res"
                            }
                          }
                        },
                        {
                          "type": "ExpressionStatement",
                          "start": 137,
                          "end": 156,
                          "expression": {
                            "type": "AssignmentExpression",
                            "start": 137,
                            "end": 156,
                            "operator": "=",
                            "left": {
                              "type": "Identifier",
                              "start": 137,
                              "end": 150,
                              "name": "promiseReject"
                            },
                            "right": {
                              "type": "Identifier",
                              "start": 153,
                              "end": 156,
                              "name": "rej"
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "kind": "let"
        },
        {
          "type": "ReturnStatement",
          "start": 164,
          "end": 227,
          "argument": {
            "type": "ObjectExpression",
            "start": 171,
            "end": 227,
            "properties": [
              {
                "type": "Property",
                "start": 177,
                "end": 184,
                "method": false,
                "shorthand": true,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 177,
                  "end": 184,
                  "name": "promise"
                },
                "kind": "init",
                "value": {
                  "type": "Identifier",
                  "start": 177,
                  "end": 184,
                  "name": "promise"
                }
              },
              {
                "type": "Property",
                "start": 190,
                "end": 204,
                "method": false,
                "shorthand": true,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 190,
                  "end": 204,
                  "name": "promiseResolve"
                },
                "kind": "init",
                "value": {
                  "type": "Identifier",
                  "start": 190,
                  "end": 204,
                  "name": "promiseResolve"
                }
              },
              {
                "type": "Property",
                "start": 210,
                "end": 223,
                "method": false,
                "shorthand": true,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 210,
                  "end": 223,
                  "name": "promiseReject"
                },
                "kind": "init",
                "value": {
                  "type": "Identifier",
                  "start": 210,
                  "end": 223,
                  "name": "promiseReject"
                }
              }
            ]
          }
        }
      ]
    }
  },
  "arguments": [],
  "optional": false
};