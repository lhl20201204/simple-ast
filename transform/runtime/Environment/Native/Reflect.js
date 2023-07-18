// 后续优化生成ast性能后，直接仿照原生js的eval函数，不用写ast，现在暂时用ast替代
const code = `
class Reflect extends Object{
  static set (target, propertyKey, value, receiver) {
           const obj = receiver || target;
           obj[propertyKey]  =  value
           return true
   }
   
  static get (target, propertyKey, receiver) {
           const obj = receiver || target;
           return obj[propertyKey]
  }
   
  static deleteProperty (target, propertyKey) {
       delete target[propertyKey]
  }
 }`

export const _reflectAst =  {
  "type": "ClassDeclaration",
  "start": 0,
  "end": 403,
  "id": {
    "type": "Identifier",
    "start": 6,
    "end": 13,
    "name": "Reflect"
  },
  "superClass": {
    "type": "Identifier",
    "start": 22,
    "end": 28,
    "name": "Object"
  },
  "body": {
    "type": "ClassBody",
    "start": 28,
    "end": 403,
    "body": [
      {
        "type": "MethodDefinition",
        "start": 31,
        "end": 187,
        "static": true,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 38,
          "end": 41,
          "name": "set"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 42,
          "end": 187,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "Identifier",
              "start": 43,
              "end": 49,
              "name": "target"
            },
            {
              "type": "Identifier",
              "start": 51,
              "end": 62,
              "name": "propertyKey"
            },
            {
              "type": "Identifier",
              "start": 64,
              "end": 69,
              "name": "value"
            },
            {
              "type": "Identifier",
              "start": 71,
              "end": 79,
              "name": "receiver"
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 81,
            "end": 187,
            "body": [
              {
                "type": "VariableDeclaration",
                "start": 93,
                "end": 124,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 99,
                    "end": 123,
                    "id": {
                      "type": "Identifier",
                      "start": 99,
                      "end": 102,
                      "name": "obj"
                    },
                    "init": {
                      "type": "LogicalExpression",
                      "start": 105,
                      "end": 123,
                      "left": {
                        "type": "Identifier",
                        "start": 105,
                        "end": 113,
                        "name": "receiver"
                      },
                      "operator": "||",
                      "right": {
                        "type": "Identifier",
                        "start": 117,
                        "end": 123,
                        "name": "target"
                      }
                    }
                  }
                ],
                "kind": "const"
              },
              {
                "type": "ExpressionStatement",
                "start": 135,
                "end": 161,
                "expression": {
                  "type": "AssignmentExpression",
                  "start": 135,
                  "end": 161,
                  "operator": "=",
                  "left": {
                    "type": "MemberExpression",
                    "start": 135,
                    "end": 151,
                    "object": {
                      "type": "Identifier",
                      "start": 135,
                      "end": 138,
                      "name": "obj"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 139,
                      "end": 150,
                      "name": "propertyKey"
                    },
                    "computed": true,
                    "optional": false
                  },
                  "right": {
                    "type": "Identifier",
                    "start": 156,
                    "end": 161,
                    "name": "value"
                  }
                }
              },
              {
                "type": "ReturnStatement",
                "start": 172,
                "end": 183,
                "argument": {
                  "type": "Literal",
                  "start": 179,
                  "end": 183,
                  "value": true,
                  "raw": "true"
                }
              }
            ]
          }
        }
      },
      {
        "type": "MethodDefinition",
        "start": 192,
        "end": 315,
        "static": true,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 199,
          "end": 202,
          "name": "get"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 203,
          "end": 315,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "Identifier",
              "start": 204,
              "end": 210,
              "name": "target"
            },
            {
              "type": "Identifier",
              "start": 212,
              "end": 223,
              "name": "propertyKey"
            },
            {
              "type": "Identifier",
              "start": 225,
              "end": 233,
              "name": "receiver"
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 235,
            "end": 315,
            "body": [
              {
                "type": "VariableDeclaration",
                "start": 247,
                "end": 278,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 253,
                    "end": 277,
                    "id": {
                      "type": "Identifier",
                      "start": 253,
                      "end": 256,
                      "name": "obj"
                    },
                    "init": {
                      "type": "LogicalExpression",
                      "start": 259,
                      "end": 277,
                      "left": {
                        "type": "Identifier",
                        "start": 259,
                        "end": 267,
                        "name": "receiver"
                      },
                      "operator": "||",
                      "right": {
                        "type": "Identifier",
                        "start": 271,
                        "end": 277,
                        "name": "target"
                      }
                    }
                  }
                ],
                "kind": "const"
              },
              {
                "type": "ReturnStatement",
                "start": 289,
                "end": 312,
                "argument": {
                  "type": "MemberExpression",
                  "start": 296,
                  "end": 312,
                  "object": {
                    "type": "Identifier",
                    "start": 296,
                    "end": 299,
                    "name": "obj"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 300,
                    "end": 311,
                    "name": "propertyKey"
                  },
                  "computed": true,
                  "optional": false
                }
              }
            ]
          }
        }
      },
      {
        "type": "MethodDefinition",
        "start": 320,
        "end": 401,
        "static": true,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 327,
          "end": 341,
          "name": "deleteProperty"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 342,
          "end": 401,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "Identifier",
              "start": 343,
              "end": 349,
              "name": "target"
            },
            {
              "type": "Identifier",
              "start": 351,
              "end": 362,
              "name": "propertyKey"
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 364,
            "end": 401,
            "body": [
              {
                "type": "ExpressionStatement",
                "start": 372,
                "end": 398,
                "expression": {
                  "type": "UnaryExpression",
                  "start": 372,
                  "end": 398,
                  "operator": "delete",
                  "prefix": true,
                  "argument": {
                    "type": "MemberExpression",
                    "start": 379,
                    "end": 398,
                    "object": {
                      "type": "Identifier",
                      "start": 379,
                      "end": 385,
                      "name": "target"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 386,
                      "end": 397,
                      "name": "propertyKey"
                    },
                    "computed": true,
                    "optional": false
                  }
                }
              }
            ]
          }
        }
      }
    ]
  }
}