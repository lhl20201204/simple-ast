let code = `
(()=> {
  let promiseResolve = null;
  let promise =new Promise(r => {
    promiseResolve = r
  })
  return {
    promise,
    promiseResolve
  }
})();
`

export const _codePromiseResolveAst =  {
  "type": "CallExpression",
  "start": 0,
  "end": 150,
  "callee": {
    "type": "ArrowFunctionExpression",
    "start": 1,
    "end": 147,
    "id": null,
    "expression": false,
    "generator": false,
    "async": false,
    "params": [],
    "body": {
      "type": "BlockStatement",
      "start": 6,
      "end": 147,
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
          "end": 98,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 43,
              "end": 98,
              "id": {
                "type": "Identifier",
                "start": 43,
                "end": 50,
                "name": "promise"
              },
              "init": {
                "type": "NewExpression",
                "start": 52,
                "end": 98,
                "callee": {
                  "type": "Identifier",
                  "start": 56,
                  "end": 63,
                  "name": "Promise"
                },
                "arguments": [
                  {
                    "type": "ArrowFunctionExpression",
                    "start": 64,
                    "end": 97,
                    "id": null,
                    "expression": false,
                    "generator": false,
                    "async": false,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 64,
                        "end": 65,
                        "name": "r"
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 69,
                      "end": 97,
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "start": 75,
                          "end": 93,
                          "expression": {
                            "type": "AssignmentExpression",
                            "start": 75,
                            "end": 93,
                            "operator": "=",
                            "left": {
                              "type": "Identifier",
                              "start": 75,
                              "end": 89,
                              "name": "promiseResolve"
                            },
                            "right": {
                              "type": "Identifier",
                              "start": 92,
                              "end": 93,
                              "name": "r"
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
          "start": 101,
          "end": 145,
          "argument": {
            "type": "ObjectExpression",
            "start": 108,
            "end": 145,
            "properties": [
              {
                "type": "Property",
                "start": 114,
                "end": 121,
                "method": false,
                "shorthand": true,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 114,
                  "end": 121,
                  "name": "promise"
                },
                "kind": "init",
                "value": {
                  "type": "Identifier",
                  "start": 114,
                  "end": 121,
                  "name": "promise"
                }
              },
              {
                "type": "Property",
                "start": 127,
                "end": 141,
                "method": false,
                "shorthand": true,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 127,
                  "end": 141,
                  "name": "promiseResolve"
                },
                "kind": "init",
                "value": {
                  "type": "Identifier",
                  "start": 127,
                  "end": 141,
                  "name": "promiseResolve"
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