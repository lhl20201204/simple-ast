const code = `
function test () {
  // var 没有作用域会提升，所以得先解决这个提升问题。
  // 这里的g赋值实际上是下面那个var造成的
  console.log(g) // undefined
  // 这个g是下面for循环里的g提升
   const f = 2
for( g  of [{ a: 1, [f]: 'hhh' }]){
   const t = (1 + 5 * (5 + 6) )* (f + f)
   console.log('for -of',g, t) // 13, a | 13, 2
}

for(g in [1, 2, 3]) {
  if (g === '2' && false) {
      console.log('enter in break')
     break;
  }
  if (g === 1) {
    // g === '1'
      console.log('enter in continue')
     continue;
  }
  console.log('for - in',g);
  
}
console.log('final', g) // 2

g === '2' && console.log('短路成功')

if (false) {
  //var g;
}
}

g = 'window of g'
test();
`

export const _ast14 = `{
  "type": "Program",
  "start": 0,
  "end": 678,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 651,
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
        "end": 651,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 85,
            "end": 99,
            "expression": {
              "type": "CallExpression",
              "start": 85,
              "end": 99,
              "callee": {
                "type": "MemberExpression",
                "start": 85,
                "end": 96,
                "object": {
                  "type": "Identifier",
                  "start": 85,
                  "end": 92,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 93,
                  "end": 96,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 97,
                  "end": 98,
                  "name": "g"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 142,
            "end": 153,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 148,
                "end": 153,
                "id": {
                  "type": "Identifier",
                  "start": 148,
                  "end": 149,
                  "name": "f"
                },
                "init": {
                  "type": "Literal",
                  "start": 152,
                  "end": 153,
                  "value": 2,
                  "raw": "2"
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ForOfStatement",
            "start": 156,
            "end": 288,
            "await": false,
            "left": {
              "type": "Identifier",
              "start": 161,
              "end": 162,
              "name": "g"
            },
            "right": {
              "type": "ArrayExpression",
              "start": 167,
              "end": 189,
              "elements": [
                {
                  "type": "ObjectExpression",
                  "start": 168,
                  "end": 188,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 170,
                      "end": 174,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 170,
                        "end": 171,
                        "name": "a"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 173,
                        "end": 174,
                        "value": 1,
                        "raw": "1"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 176,
                      "end": 186,
                      "method": false,
                      "shorthand": false,
                      "computed": true,
                      "key": {
                        "type": "Identifier",
                        "start": 177,
                        "end": 178,
                        "name": "f"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 181,
                        "end": 186,
                        "value": "hhh",
                        "raw": "'hhh'"
                      },
                      "kind": "init"
                    }
                  ]
                }
              ]
            },
            "body": {
              "type": "BlockStatement",
              "start": 190,
              "end": 288,
              "body": [
                {
                  "type": "VariableDeclaration",
                  "start": 197,
                  "end": 234,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 203,
                      "end": 234,
                      "id": {
                        "type": "Identifier",
                        "start": 203,
                        "end": 204,
                        "name": "t"
                      },
                      "init": {
                        "type": "BinaryExpression",
                        "start": 207,
                        "end": 234,
                        "left": {
                          "type": "BinaryExpression",
                          "start": 208,
                          "end": 223,
                          "left": {
                            "type": "Literal",
                            "start": 208,
                            "end": 209,
                            "value": 1,
                            "raw": "1"
                          },
                          "operator": "+",
                          "right": {
                            "type": "BinaryExpression",
                            "start": 212,
                            "end": 223,
                            "left": {
                              "type": "Literal",
                              "start": 212,
                              "end": 213,
                              "value": 5,
                              "raw": "5"
                            },
                            "operator": "*",
                            "right": {
                              "type": "BinaryExpression",
                              "start": 217,
                              "end": 222,
                              "left": {
                                "type": "Literal",
                                "start": 217,
                                "end": 218,
                                "value": 5,
                                "raw": "5"
                              },
                              "operator": "+",
                              "right": {
                                "type": "Literal",
                                "start": 221,
                                "end": 222,
                                "value": 6,
                                "raw": "6"
                              }
                            }
                          }
                        },
                        "operator": "*",
                        "right": {
                          "type": "BinaryExpression",
                          "start": 228,
                          "end": 233,
                          "left": {
                            "type": "Identifier",
                            "start": 228,
                            "end": 229,
                            "name": "f"
                          },
                          "operator": "+",
                          "right": {
                            "type": "Identifier",
                            "start": 232,
                            "end": 233,
                            "name": "f"
                          }
                        }
                      }
                    }
                  ],
                  "kind": "const"
                },
                {
                  "type": "ExpressionStatement",
                  "start": 240,
                  "end": 267,
                  "expression": {
                    "type": "CallExpression",
                    "start": 240,
                    "end": 267,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 240,
                      "end": 251,
                      "object": {
                        "type": "Identifier",
                        "start": 240,
                        "end": 247,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 248,
                        "end": 251,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 252,
                        "end": 261,
                        "value": "for -of",
                        "raw": "'for -of'"
                      },
                      {
                        "type": "Identifier",
                        "start": 262,
                        "end": 263,
                        "name": "g"
                      },
                      {
                        "type": "Identifier",
                        "start": 265,
                        "end": 266,
                        "name": "t"
                      }
                    ],
                    "optional": false
                  }
                }
              ]
            }
          },
          {
            "type": "ForInStatement",
            "start": 294,
            "end": 545,
            "left": {
              "type": "Identifier",
              "start": 298,
              "end": 299,
              "name": "g"
            },
            "right": {
              "type": "ArrayExpression",
              "start": 303,
              "end": 312,
              "elements": [
                {
                  "type": "Literal",
                  "start": 304,
                  "end": 305,
                  "value": 1,
                  "raw": "1"
                },
                {
                  "type": "Literal",
                  "start": 307,
                  "end": 308,
                  "value": 2,
                  "raw": "2"
                },
                {
                  "type": "Literal",
                  "start": 310,
                  "end": 311,
                  "value": 3,
                  "raw": "3"
                }
              ]
            },
            "body": {
              "type": "BlockStatement",
              "start": 314,
              "end": 545,
              "body": [
                {
                  "type": "IfStatement",
                  "start": 320,
                  "end": 403,
                  "test": {
                    "type": "LogicalExpression",
                    "start": 324,
                    "end": 342,
                    "left": {
                      "type": "BinaryExpression",
                      "start": 324,
                      "end": 333,
                      "left": {
                        "type": "Identifier",
                        "start": 324,
                        "end": 325,
                        "name": "g"
                      },
                      "operator": "===",
                      "right": {
                        "type": "Literal",
                        "start": 330,
                        "end": 333,
                        "value": "2",
                        "raw": "'2'"
                      }
                    },
                    "operator": "&&",
                    "right": {
                      "type": "Literal",
                      "start": 337,
                      "end": 342,
                      "value": false,
                      "raw": "false"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 344,
                    "end": 403,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 354,
                        "end": 383,
                        "expression": {
                          "type": "CallExpression",
                          "start": 354,
                          "end": 383,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 354,
                            "end": 365,
                            "object": {
                              "type": "Identifier",
                              "start": 354,
                              "end": 361,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 362,
                              "end": 365,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 366,
                              "end": 382,
                              "value": "enter in break",
                              "raw": "'enter in break'"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "BreakStatement",
                        "start": 391,
                        "end": 397,
                        "label": null
                      }
                    ]
                  },
                  "alternate": null
                },
                {
                  "type": "IfStatement",
                  "start": 408,
                  "end": 505,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 412,
                    "end": 419,
                    "left": {
                      "type": "Identifier",
                      "start": 412,
                      "end": 413,
                      "name": "g"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 418,
                      "end": 419,
                      "value": 1,
                      "raw": "1"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 421,
                    "end": 505,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 450,
                        "end": 482,
                        "expression": {
                          "type": "CallExpression",
                          "start": 450,
                          "end": 482,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 450,
                            "end": 461,
                            "object": {
                              "type": "Identifier",
                              "start": 450,
                              "end": 457,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 458,
                              "end": 461,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 462,
                              "end": 481,
                              "value": "enter in continue",
                              "raw": "'enter in continue'"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ContinueStatement",
                        "start": 490,
                        "end": 499,
                        "label": null
                      }
                    ]
                  },
                  "alternate": null
                },
                {
                  "type": "ExpressionStatement",
                  "start": 510,
                  "end": 536,
                  "expression": {
                    "type": "CallExpression",
                    "start": 510,
                    "end": 535,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 510,
                      "end": 521,
                      "object": {
                        "type": "Identifier",
                        "start": 510,
                        "end": 517,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 518,
                        "end": 521,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 522,
                        "end": 532,
                        "value": "for - in",
                        "raw": "'for - in'"
                      },
                      {
                        "type": "Identifier",
                        "start": 533,
                        "end": 534,
                        "name": "g"
                      }
                    ],
                    "optional": false
                  }
                }
              ]
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 548,
            "end": 571,
            "expression": {
              "type": "CallExpression",
              "start": 548,
              "end": 571,
              "callee": {
                "type": "MemberExpression",
                "start": 548,
                "end": 559,
                "object": {
                  "type": "Identifier",
                  "start": 548,
                  "end": 555,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 556,
                  "end": 559,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 560,
                  "end": 567,
                  "value": "final",
                  "raw": "'final'"
                },
                {
                  "type": "Identifier",
                  "start": 569,
                  "end": 570,
                  "name": "g"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 582,
            "end": 614,
            "expression": {
              "type": "LogicalExpression",
              "start": 582,
              "end": 614,
              "left": {
                "type": "BinaryExpression",
                "start": 582,
                "end": 591,
                "left": {
                  "type": "Identifier",
                  "start": 582,
                  "end": 583,
                  "name": "g"
                },
                "operator": "===",
                "right": {
                  "type": "Literal",
                  "start": 588,
                  "end": 591,
                  "value": "2",
                  "raw": "'2'"
                }
              },
              "operator": "&&",
              "right": {
                "type": "CallExpression",
                "start": 595,
                "end": 614,
                "callee": {
                  "type": "MemberExpression",
                  "start": 595,
                  "end": 606,
                  "object": {
                    "type": "Identifier",
                    "start": 595,
                    "end": 602,
                    "name": "console"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 603,
                    "end": 606,
                    "name": "log"
                  },
                  "computed": false,
                  "optional": false
                },
                "arguments": [
                  {
                    "type": "Literal",
                    "start": 607,
                    "end": 613,
                    "value": "短路成功",
                    "raw": "'短路成功'"
                  }
                ],
                "optional": false
              }
            }
          },
          {
            "type": "IfStatement",
            "start": 620,
            "end": 649,
            "test": {
              "type": "Literal",
              "start": 624,
              "end": 629,
              "value": false,
              "raw": "false"
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 631,
              "end": 649,
              "body": []
            },
            "alternate": null
          }
        ]
      }
    },
    {
      "type": "ExpressionStatement",
      "start": 653,
      "end": 670,
      "expression": {
        "type": "AssignmentExpression",
        "start": 653,
        "end": 670,
        "operator": "=",
        "left": {
          "type": "Identifier",
          "start": 653,
          "end": 654,
          "name": "g"
        },
        "right": {
          "type": "Literal",
          "start": 657,
          "end": 670,
          "value": "window of g",
          "raw": "'window of g'"
        }
      }
    },
    {
      "type": "ExpressionStatement",
      "start": 671,
      "end": 678,
      "expression": {
        "type": "CallExpression",
        "start": 671,
        "end": 677,
        "callee": {
          "type": "Identifier",
          "start": 671,
          "end": 675,
          "name": "test"
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}`