const code =`function test () {
  // var 没有作用域会提升，所以得先解决这个提升问题。

  // 这里的g赋值实际上是下面那个var造成的
g = 34
console.log(hhhh, gggg, ffff, dfsd)
for(var g = 1; g < 6; g++){
  console.log(g, window.g)
  var ffff = 2;
  if (g === 3) {
    continue;
  }
  for(let tt of [1, 2,3]) {
      var dfsd = 1;
     if (tt === 2) {
       continue
     }

      console.log(g, tt, g * tt)
    if (g === 2){
      console.log('本轮只打印一次')
      break;
    }
  }
  if (g === 4) {
    break;
  }
}


if (false) {
  var hhhh = 'fdsfd'
} else {
  var gggg = 'dfsdf'
}

} /* function end */


test ()
`
export const _ast12 = {
  "type": "Program",
  "start": 0,
  "end": 618,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 589,
      "id": {
        "type": "Identifier",
        "start": 9,
        "end": 13,
        "name": "test"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 17,
        "end": 589,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 84,
            "end": 90,
            "expression": {
              "type": "AssignmentExpression",
              "start": 84,
              "end": 90,
              "operator": "=",
              "left": {
                "type": "Identifier",
                "start": 84,
                "end": 85,
                "name": "g"
              },
              "right": {
                "type": "Literal",
                "start": 88,
                "end": 90,
                "value": 34,
                "raw": "34"
              }
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 93,
            "end": 128,
            "expression": {
              "type": "CallExpression",
              "start": 93,
              "end": 128,
              "callee": {
                "type": "MemberExpression",
                "start": 93,
                "end": 104,
                "object": {
                  "type": "Identifier",
                  "start": 93,
                  "end": 100,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 101,
                  "end": 104,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 105,
                  "end": 109,
                  "name": "hhhh"
                },
                {
                  "type": "Identifier",
                  "start": 111,
                  "end": 115,
                  "name": "gggg"
                },
                {
                  "type": "Identifier",
                  "start": 117,
                  "end": 121,
                  "name": "ffff"
                },
                {
                  "type": "Identifier",
                  "start": 123,
                  "end": 127,
                  "name": "dfsd"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ForStatement",
            "start": 131,
            "end": 506,
            "init": {
              "type": "VariableDeclaration",
              "start": 135,
              "end": 144,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 139,
                  "end": 144,
                  "id": {
                    "type": "Identifier",
                    "start": 139,
                    "end": 140,
                    "name": "g"
                  },
                  "init": {
                    "type": "Literal",
                    "start": 143,
                    "end": 144,
                    "value": 1,
                    "raw": "1"
                  }
                }
              ],
              "kind": "var"
            },
            "test": {
              "type": "BinaryExpression",
              "start": 146,
              "end": 151,
              "left": {
                "type": "Identifier",
                "start": 146,
                "end": 147,
                "name": "g"
              },
              "operator": "<",
              "right": {
                "type": "Literal",
                "start": 150,
                "end": 151,
                "value": 6,
                "raw": "6"
              }
            },
            "update": {
              "type": "UpdateExpression",
              "start": 153,
              "end": 156,
              "operator": "++",
              "prefix": false,
              "argument": {
                "type": "Identifier",
                "start": 153,
                "end": 154,
                "name": "g"
              }
            },
            "body": {
              "type": "BlockStatement",
              "start": 157,
              "end": 506,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 163,
                  "end": 187,
                  "expression": {
                    "type": "CallExpression",
                    "start": 163,
                    "end": 187,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 163,
                      "end": 174,
                      "object": {
                        "type": "Identifier",
                        "start": 163,
                        "end": 170,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 171,
                        "end": 174,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 175,
                        "end": 176,
                        "name": "g"
                      },
                      {
                        "type": "MemberExpression",
                        "start": 178,
                        "end": 186,
                        "object": {
                          "type": "Identifier",
                          "start": 178,
                          "end": 184,
                          "name": "window"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 185,
                          "end": 186,
                          "name": "g"
                        },
                        "computed": false,
                        "optional": false
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "VariableDeclaration",
                  "start": 192,
                  "end": 205,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 196,
                      "end": 204,
                      "id": {
                        "type": "Identifier",
                        "start": 196,
                        "end": 200,
                        "name": "ffff"
                      },
                      "init": {
                        "type": "Literal",
                        "start": 203,
                        "end": 204,
                        "value": 2,
                        "raw": "2"
                      }
                    }
                  ],
                  "kind": "var"
                },
                {
                  "type": "IfStatement",
                  "start": 210,
                  "end": 246,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 214,
                    "end": 221,
                    "left": {
                      "type": "Identifier",
                      "start": 214,
                      "end": 215,
                      "name": "g"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 220,
                      "end": 221,
                      "value": 3,
                      "raw": "3"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 223,
                    "end": 246,
                    "body": [
                      {
                        "type": "ContinueStatement",
                        "start": 231,
                        "end": 240,
                        "label": null
                      }
                    ]
                  },
                  "alternate": null
                },
                {
                  "type": "ForOfStatement",
                  "start": 251,
                  "end": 464,
                  "await": false,
                  "left": {
                    "type": "VariableDeclaration",
                    "start": 255,
                    "end": 261,
                    "declarations": [
                      {
                        "type": "VariableDeclarator",
                        "start": 259,
                        "end": 261,
                        "id": {
                          "type": "Identifier",
                          "start": 259,
                          "end": 261,
                          "name": "tt"
                        },
                        "init": null
                      }
                    ],
                    "kind": "let"
                  },
                  "right": {
                    "type": "ArrayExpression",
                    "start": 265,
                    "end": 273,
                    "elements": [
                      {
                        "type": "Literal",
                        "start": 266,
                        "end": 267,
                        "value": 1,
                        "raw": "1"
                      },
                      {
                        "type": "Literal",
                        "start": 269,
                        "end": 270,
                        "value": 2,
                        "raw": "2"
                      },
                      {
                        "type": "Literal",
                        "start": 271,
                        "end": 272,
                        "value": 3,
                        "raw": "3"
                      }
                    ]
                  },
                  "body": {
                    "type": "BlockStatement",
                    "start": 275,
                    "end": 464,
                    "body": [
                      {
                        "type": "VariableDeclaration",
                        "start": 285,
                        "end": 298,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 289,
                            "end": 297,
                            "id": {
                              "type": "Identifier",
                              "start": 289,
                              "end": 293,
                              "name": "dfsd"
                            },
                            "init": {
                              "type": "Literal",
                              "start": 296,
                              "end": 297,
                              "value": 1,
                              "raw": "1"
                            }
                          }
                        ],
                        "kind": "var"
                      },
                      {
                        "type": "IfStatement",
                        "start": 306,
                        "end": 348,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 310,
                          "end": 318,
                          "left": {
                            "type": "Identifier",
                            "start": 310,
                            "end": 312,
                            "name": "tt"
                          },
                          "operator": "===",
                          "right": {
                            "type": "Literal",
                            "start": 317,
                            "end": 318,
                            "value": 2,
                            "raw": "2"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 320,
                          "end": 348,
                          "body": [
                            {
                              "type": "ContinueStatement",
                              "start": 331,
                              "end": 339,
                              "label": null
                            }
                          ]
                        },
                        "alternate": null
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 358,
                        "end": 384,
                        "expression": {
                          "type": "CallExpression",
                          "start": 358,
                          "end": 384,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 358,
                            "end": 369,
                            "object": {
                              "type": "Identifier",
                              "start": 358,
                              "end": 365,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 366,
                              "end": 369,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 370,
                              "end": 371,
                              "name": "g"
                            },
                            {
                              "type": "Identifier",
                              "start": 373,
                              "end": 375,
                              "name": "tt"
                            },
                            {
                              "type": "BinaryExpression",
                              "start": 377,
                              "end": 383,
                              "left": {
                                "type": "Identifier",
                                "start": 377,
                                "end": 378,
                                "name": "g"
                              },
                              "operator": "*",
                              "right": {
                                "type": "Identifier",
                                "start": 381,
                                "end": 383,
                                "name": "tt"
                              }
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "IfStatement",
                        "start": 391,
                        "end": 458,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 395,
                          "end": 402,
                          "left": {
                            "type": "Identifier",
                            "start": 395,
                            "end": 396,
                            "name": "g"
                          },
                          "operator": "===",
                          "right": {
                            "type": "Literal",
                            "start": 401,
                            "end": 402,
                            "value": 2,
                            "raw": "2"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 403,
                          "end": 458,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 413,
                              "end": 435,
                              "expression": {
                                "type": "CallExpression",
                                "start": 413,
                                "end": 435,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 413,
                                  "end": 424,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 413,
                                    "end": 420,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 421,
                                    "end": 424,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 425,
                                    "end": 434,
                                    "value": "本轮只打印一次",
                                    "raw": "'本轮只打印一次'"
                                  }
                                ],
                                "optional": false
                              }
                            },
                            {
                              "type": "BreakStatement",
                              "start": 444,
                              "end": 450,
                              "label": null
                            }
                          ]
                        },
                        "alternate": null
                      }
                    ]
                  }
                },
                {
                  "type": "IfStatement",
                  "start": 469,
                  "end": 502,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 473,
                    "end": 480,
                    "left": {
                      "type": "Identifier",
                      "start": 473,
                      "end": 474,
                      "name": "g"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 479,
                      "end": 480,
                      "value": 4,
                      "raw": "4"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 482,
                    "end": 502,
                    "body": [
                      {
                        "type": "BreakStatement",
                        "start": 490,
                        "end": 496,
                        "label": null
                      }
                    ]
                  },
                  "alternate": null
                }
              ]
            }
          },
          {
            "type": "IfStatement",
            "start": 511,
            "end": 584,
            "test": {
              "type": "Literal",
              "start": 515,
              "end": 520,
              "value": false,
              "raw": "false"
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 522,
              "end": 550,
              "body": [
                {
                  "type": "VariableDeclaration",
                  "start": 528,
                  "end": 546,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 532,
                      "end": 546,
                      "id": {
                        "type": "Identifier",
                        "start": 532,
                        "end": 536,
                        "name": "hhhh"
                      },
                      "init": {
                        "type": "Literal",
                        "start": 539,
                        "end": 546,
                        "value": "fdsfd",
                        "raw": "'fdsfd'"
                      }
                    }
                  ],
                  "kind": "var"
                }
              ]
            },
            "alternate": {
              "type": "BlockStatement",
              "start": 556,
              "end": 584,
              "body": [
                {
                  "type": "VariableDeclaration",
                  "start": 562,
                  "end": 580,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 566,
                      "end": 580,
                      "id": {
                        "type": "Identifier",
                        "start": 566,
                        "end": 570,
                        "name": "gggg"
                      },
                      "init": {
                        "type": "Literal",
                        "start": 573,
                        "end": 580,
                        "value": "dfsdf",
                        "raw": "'dfsdf'"
                      }
                    }
                  ],
                  "kind": "var"
                }
              ]
            }
          }
        ]
      }
    },
    {
      "type": "ExpressionStatement",
      "start": 611,
      "end": 618,
      "expression": {
        "type": "CallExpression",
        "start": 611,
        "end": 618,
        "callee": {
          "type": "Identifier",
          "start": 611,
          "end": 615,
          "name": "test"
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}