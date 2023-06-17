const code = `
function test2() {
  // let x
  let g = 34;
  let t = g;
  console.log(ggg, 'ggg')
  if (true) {
    for (var { x = g = { id: 0 }, y = { hh: 'hello', }, ...rest } of [{ y: 5, z: 8 }, { x: 2, y: 3 }, {}, { x: 5, h: 'jk' }, { x: 7 }]) {
    if (x === 2) {
      console.log('跳过', g)
      // g = 66;
      console.log(g, window.g);
      continue;
    }

    console.log(x, y, rest, g, window.g)

    if (x === 5) {
      g.id = 55;
      break;
    }
  }
 
  }else {
    var ggg = 'djflsd';
    for(let {x} = 555; x < 555; x++) {
    }
  }
 console.log('outer',t === g)
  t.id = 99
  console.log(t)
}

test2()
console.log('window.g', window.g)
`

export const _ast8 = {
  "type": "Program",
  "start": 0,
  "end": 762,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 711,
      "id": {
        "type": "Identifier",
        "start": 9,
        "end": 14,
        "name": "test2"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 17,
        "end": 711,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 40,
            "end": 51,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 44,
                "end": 50,
                "id": {
                  "type": "Identifier",
                  "start": 44,
                  "end": 45,
                  "name": "g"
                },
                "init": {
                  "type": "Literal",
                  "start": 48,
                  "end": 50,
                  "value": 34,
                  "raw": "34"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "VariableDeclaration",
            "start": 58,
            "end": 68,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 62,
                "end": 67,
                "id": {
                  "type": "Identifier",
                  "start": 62,
                  "end": 63,
                  "name": "t"
                },
                "init": {
                  "type": "Identifier",
                  "start": 66,
                  "end": 67,
                  "name": "g"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "ExpressionStatement",
            "start": 75,
            "end": 98,
            "expression": {
              "type": "CallExpression",
              "start": 75,
              "end": 98,
              "callee": {
                "type": "MemberExpression",
                "start": 75,
                "end": 86,
                "object": {
                  "type": "Identifier",
                  "start": 75,
                  "end": 82,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 83,
                  "end": 86,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 87,
                  "end": 90,
                  "name": "ggg"
                },
                {
                  "type": "Literal",
                  "start": 92,
                  "end": 97,
                  "value": "ggg",
                  "raw": "'ggg'"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "IfStatement",
            "start": 105,
            "end": 634,
            "test": {
              "type": "Literal",
              "start": 109,
              "end": 113,
              "value": true,
              "raw": "true"
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 115,
              "end": 539,
              "body": [
                {
                  "type": "ForOfStatement",
                  "start": 125,
                  "end": 525,
                  "await": false,
                  "left": {
                    "type": "VariableDeclaration",
                    "start": 130,
                    "end": 186,
                    "declarations": [
                      {
                        "type": "VariableDeclarator",
                        "start": 134,
                        "end": 186,
                        "id": {
                          "type": "ObjectPattern",
                          "start": 134,
                          "end": 186,
                          "properties": [
                            {
                              "type": "Property",
                              "start": 136,
                              "end": 153,
                              "method": false,
                              "shorthand": true,
                              "computed": false,
                              "key": {
                                "type": "Identifier",
                                "start": 136,
                                "end": 137,
                                "name": "x"
                              },
                              "kind": "init",
                              "value": {
                                "type": "AssignmentPattern",
                                "start": 136,
                                "end": 153,
                                "left": {
                                  "type": "Identifier",
                                  "start": 136,
                                  "end": 137,
                                  "name": "x"
                                },
                                "right": {
                                  "type": "AssignmentExpression",
                                  "start": 140,
                                  "end": 153,
                                  "operator": "=",
                                  "left": {
                                    "type": "Identifier",
                                    "start": 140,
                                    "end": 141,
                                    "name": "g"
                                  },
                                  "right": {
                                    "type": "ObjectExpression",
                                    "start": 144,
                                    "end": 153,
                                    "properties": [
                                      {
                                        "type": "Property",
                                        "start": 146,
                                        "end": 151,
                                        "method": false,
                                        "shorthand": false,
                                        "computed": false,
                                        "key": {
                                          "type": "Identifier",
                                          "start": 146,
                                          "end": 148,
                                          "name": "id"
                                        },
                                        "value": {
                                          "type": "Literal",
                                          "start": 150,
                                          "end": 151,
                                          "value": 0,
                                          "raw": "0"
                                        },
                                        "kind": "init"
                                      }
                                    ]
                                  }
                                }
                              }
                            },
                            {
                              "type": "Property",
                              "start": 155,
                              "end": 175,
                              "method": false,
                              "shorthand": true,
                              "computed": false,
                              "key": {
                                "type": "Identifier",
                                "start": 155,
                                "end": 156,
                                "name": "y"
                              },
                              "kind": "init",
                              "value": {
                                "type": "AssignmentPattern",
                                "start": 155,
                                "end": 175,
                                "left": {
                                  "type": "Identifier",
                                  "start": 155,
                                  "end": 156,
                                  "name": "y"
                                },
                                "right": {
                                  "type": "ObjectExpression",
                                  "start": 159,
                                  "end": 175,
                                  "properties": [
                                    {
                                      "type": "Property",
                                      "start": 161,
                                      "end": 172,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 161,
                                        "end": 163,
                                        "name": "hh"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 165,
                                        "end": 172,
                                        "value": "hello",
                                        "raw": "'hello'"
                                      },
                                      "kind": "init"
                                    }
                                  ]
                                }
                              }
                            },
                            {
                              "type": "RestElement",
                              "start": 177,
                              "end": 184,
                              "argument": {
                                "type": "Identifier",
                                "start": 180,
                                "end": 184,
                                "name": "rest"
                              }
                            }
                          ]
                        },
                        "init": null
                      }
                    ],
                    "kind": "var"
                  },
                  "right": {
                    "type": "ArrayExpression",
                    "start": 190,
                    "end": 255,
                    "elements": [
                      {
                        "type": "ObjectExpression",
                        "start": 191,
                        "end": 205,
                        "properties": [
                          {
                            "type": "Property",
                            "start": 193,
                            "end": 197,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 193,
                              "end": 194,
                              "name": "y"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 196,
                              "end": 197,
                              "value": 5,
                              "raw": "5"
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 199,
                            "end": 203,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 199,
                              "end": 200,
                              "name": "z"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 202,
                              "end": 203,
                              "value": 8,
                              "raw": "8"
                            },
                            "kind": "init"
                          }
                        ]
                      },
                      {
                        "type": "ObjectExpression",
                        "start": 207,
                        "end": 221,
                        "properties": [
                          {
                            "type": "Property",
                            "start": 209,
                            "end": 213,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 209,
                              "end": 210,
                              "name": "x"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 212,
                              "end": 213,
                              "value": 2,
                              "raw": "2"
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 215,
                            "end": 219,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 215,
                              "end": 216,
                              "name": "y"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 218,
                              "end": 219,
                              "value": 3,
                              "raw": "3"
                            },
                            "kind": "init"
                          }
                        ]
                      },
                      {
                        "type": "ObjectExpression",
                        "start": 223,
                        "end": 225,
                        "properties": []
                      },
                      {
                        "type": "ObjectExpression",
                        "start": 227,
                        "end": 244,
                        "properties": [
                          {
                            "type": "Property",
                            "start": 229,
                            "end": 233,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 229,
                              "end": 230,
                              "name": "x"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 232,
                              "end": 233,
                              "value": 5,
                              "raw": "5"
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 235,
                            "end": 242,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 235,
                              "end": 236,
                              "name": "h"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 238,
                              "end": 242,
                              "value": "jk",
                              "raw": "'jk'"
                            },
                            "kind": "init"
                          }
                        ]
                      },
                      {
                        "type": "ObjectExpression",
                        "start": 246,
                        "end": 254,
                        "properties": [
                          {
                            "type": "Property",
                            "start": 248,
                            "end": 252,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 248,
                              "end": 249,
                              "name": "x"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 251,
                              "end": 252,
                              "value": 7,
                              "raw": "7"
                            },
                            "kind": "init"
                          }
                        ]
                      }
                    ]
                  },
                  "body": {
                    "type": "BlockStatement",
                    "start": 257,
                    "end": 525,
                    "body": [
                      {
                        "type": "IfStatement",
                        "start": 267,
                        "end": 399,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 271,
                          "end": 278,
                          "left": {
                            "type": "Identifier",
                            "start": 271,
                            "end": 272,
                            "name": "x"
                          },
                          "operator": "===",
                          "right": {
                            "type": "Literal",
                            "start": 277,
                            "end": 278,
                            "value": 2,
                            "raw": "2"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 280,
                          "end": 399,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 292,
                              "end": 312,
                              "expression": {
                                "type": "CallExpression",
                                "start": 292,
                                "end": 312,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 292,
                                  "end": 303,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 292,
                                    "end": 299,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 300,
                                    "end": 303,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 304,
                                    "end": 308,
                                    "value": "跳过",
                                    "raw": "'跳过'"
                                  },
                                  {
                                    "type": "Identifier",
                                    "start": 310,
                                    "end": 311,
                                    "name": "g"
                                  }
                                ],
                                "optional": false
                              }
                            },
                            {
                              "type": "ExpressionStatement",
                              "start": 344,
                              "end": 369,
                              "expression": {
                                "type": "CallExpression",
                                "start": 344,
                                "end": 368,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 344,
                                  "end": 355,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 344,
                                    "end": 351,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 352,
                                    "end": 355,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Identifier",
                                    "start": 356,
                                    "end": 357,
                                    "name": "g"
                                  },
                                  {
                                    "type": "MemberExpression",
                                    "start": 359,
                                    "end": 367,
                                    "object": {
                                      "type": "Identifier",
                                      "start": 359,
                                      "end": 365,
                                      "name": "window"
                                    },
                                    "property": {
                                      "type": "Identifier",
                                      "start": 366,
                                      "end": 367,
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
                              "type": "ContinueStatement",
                              "start": 380,
                              "end": 389,
                              "label": null
                            }
                          ]
                        },
                        "alternate": null
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 409,
                        "end": 445,
                        "expression": {
                          "type": "CallExpression",
                          "start": 409,
                          "end": 445,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 409,
                            "end": 420,
                            "object": {
                              "type": "Identifier",
                              "start": 409,
                              "end": 416,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 417,
                              "end": 420,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 421,
                              "end": 422,
                              "name": "x"
                            },
                            {
                              "type": "Identifier",
                              "start": 424,
                              "end": 425,
                              "name": "y"
                            },
                            {
                              "type": "Identifier",
                              "start": 427,
                              "end": 431,
                              "name": "rest"
                            },
                            {
                              "type": "Identifier",
                              "start": 433,
                              "end": 434,
                              "name": "g"
                            },
                            {
                              "type": "MemberExpression",
                              "start": 436,
                              "end": 444,
                              "object": {
                                "type": "Identifier",
                                "start": 436,
                                "end": 442,
                                "name": "window"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 443,
                                "end": 444,
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
                        "type": "IfStatement",
                        "start": 455,
                        "end": 517,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 459,
                          "end": 466,
                          "left": {
                            "type": "Identifier",
                            "start": 459,
                            "end": 460,
                            "name": "x"
                          },
                          "operator": "===",
                          "right": {
                            "type": "Literal",
                            "start": 465,
                            "end": 466,
                            "value": 5,
                            "raw": "5"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 468,
                          "end": 517,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 480,
                              "end": 490,
                              "expression": {
                                "type": "AssignmentExpression",
                                "start": 480,
                                "end": 489,
                                "operator": "=",
                                "left": {
                                  "type": "MemberExpression",
                                  "start": 480,
                                  "end": 484,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 480,
                                    "end": 481,
                                    "name": "g"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 482,
                                    "end": 484,
                                    "name": "id"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "right": {
                                  "type": "Literal",
                                  "start": 487,
                                  "end": 489,
                                  "value": 55,
                                  "raw": "55"
                                }
                              }
                            },
                            {
                              "type": "BreakStatement",
                              "start": 501,
                              "end": 507,
                              "label": null
                            }
                          ]
                        },
                        "alternate": null
                      }
                    ]
                  }
                }
              ]
            },
            "alternate": {
              "type": "BlockStatement",
              "start": 544,
              "end": 634,
              "body": [
                {
                  "type": "VariableDeclaration",
                  "start": 554,
                  "end": 573,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 558,
                      "end": 572,
                      "id": {
                        "type": "Identifier",
                        "start": 558,
                        "end": 561,
                        "name": "ggg"
                      },
                      "init": {
                        "type": "Literal",
                        "start": 564,
                        "end": 572,
                        "value": "djflsd",
                        "raw": "'djflsd'"
                      }
                    }
                  ],
                  "kind": "var"
                },
                {
                  "type": "ForStatement",
                  "start": 582,
                  "end": 626,
                  "init": {
                    "type": "VariableDeclaration",
                    "start": 586,
                    "end": 599,
                    "declarations": [
                      {
                        "type": "VariableDeclarator",
                        "start": 590,
                        "end": 599,
                        "id": {
                          "type": "ObjectPattern",
                          "start": 590,
                          "end": 593,
                          "properties": [
                            {
                              "type": "Property",
                              "start": 591,
                              "end": 592,
                              "method": false,
                              "shorthand": true,
                              "computed": false,
                              "key": {
                                "type": "Identifier",
                                "start": 591,
                                "end": 592,
                                "name": "x"
                              },
                              "kind": "init",
                              "value": {
                                "type": "Identifier",
                                "start": 591,
                                "end": 592,
                                "name": "x"
                              }
                            }
                          ]
                        },
                        "init": {
                          "type": "Literal",
                          "start": 596,
                          "end": 599,
                          "value": 555,
                          "raw": "555"
                        }
                      }
                    ],
                    "kind": "let"
                  },
                  "test": {
                    "type": "BinaryExpression",
                    "start": 601,
                    "end": 608,
                    "left": {
                      "type": "Identifier",
                      "start": 601,
                      "end": 602,
                      "name": "x"
                    },
                    "operator": "<",
                    "right": {
                      "type": "Literal",
                      "start": 605,
                      "end": 608,
                      "value": 555,
                      "raw": "555"
                    }
                  },
                  "update": {
                    "type": "UpdateExpression",
                    "start": 610,
                    "end": 613,
                    "operator": "++",
                    "prefix": false,
                    "argument": {
                      "type": "Identifier",
                      "start": 610,
                      "end": 611,
                      "name": "x"
                    }
                  },
                  "body": {
                    "type": "BlockStatement",
                    "start": 615,
                    "end": 626,
                    "body": []
                  }
                }
              ]
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 640,
            "end": 668,
            "expression": {
              "type": "CallExpression",
              "start": 640,
              "end": 668,
              "callee": {
                "type": "MemberExpression",
                "start": 640,
                "end": 651,
                "object": {
                  "type": "Identifier",
                  "start": 640,
                  "end": 647,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 648,
                  "end": 651,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 652,
                  "end": 659,
                  "value": "outer",
                  "raw": "'outer'"
                },
                {
                  "type": "BinaryExpression",
                  "start": 660,
                  "end": 667,
                  "left": {
                    "type": "Identifier",
                    "start": 660,
                    "end": 661,
                    "name": "t"
                  },
                  "operator": "===",
                  "right": {
                    "type": "Identifier",
                    "start": 666,
                    "end": 667,
                    "name": "g"
                  }
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 675,
            "end": 684,
            "expression": {
              "type": "AssignmentExpression",
              "start": 675,
              "end": 684,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 675,
                "end": 679,
                "object": {
                  "type": "Identifier",
                  "start": 675,
                  "end": 676,
                  "name": "t"
                },
                "property": {
                  "type": "Identifier",
                  "start": 677,
                  "end": 679,
                  "name": "id"
                },
                "computed": false,
                "optional": false
              },
              "right": {
                "type": "Literal",
                "start": 682,
                "end": 684,
                "value": 99,
                "raw": "99"
              }
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 691,
            "end": 705,
            "expression": {
              "type": "CallExpression",
              "start": 691,
              "end": 705,
              "callee": {
                "type": "MemberExpression",
                "start": 691,
                "end": 702,
                "object": {
                  "type": "Identifier",
                  "start": 691,
                  "end": 698,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 699,
                  "end": 702,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 703,
                  "end": 704,
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
      "type": "ExpressionStatement",
      "start": 717,
      "end": 724,
      "expression": {
        "type": "CallExpression",
        "start": 717,
        "end": 724,
        "callee": {
          "type": "Identifier",
          "start": 717,
          "end": 722,
          "name": "test2"
        },
        "arguments": [],
        "optional": false
      }
    },
    {
      "type": "ExpressionStatement",
      "start": 729,
      "end": 762,
      "expression": {
        "type": "CallExpression",
        "start": 729,
        "end": 762,
        "callee": {
          "type": "MemberExpression",
          "start": 729,
          "end": 740,
          "object": {
            "type": "Identifier",
            "start": 729,
            "end": 736,
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "start": 737,
            "end": 740,
            "name": "log"
          },
          "computed": false,
          "optional": false
        },
        "arguments": [
          {
            "type": "Literal",
            "start": 741,
            "end": 751,
            "value": "window.g",
            "raw": "'window.g'"
          },
          {
            "type": "MemberExpression",
            "start": 753,
            "end": 761,
            "object": {
              "type": "Identifier",
              "start": 753,
              "end": 759,
              "name": "window"
            },
            "property": {
              "type": "Identifier",
              "start": 760,
              "end": 761,
              "name": "g"
            },
            "computed": false,
            "optional": false
          }
        ],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}