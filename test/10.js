const code = `
function test () {
  g = 34
  const f = y = 666
  let [{ a = 5}, {g:fg = y = 666}, ...rest] = [{a: {text: 'this is tezt'}},{},{g: 5}, 'hhhhh']
  console.log('test', a, g, f, fg, y, rest)
  let t = 34;
  for (let {
      c = 5,
      x = g = {
          id : g
      },
      y = {
          hh : a = g,
      },
      ...rest
  } of [{
      y : 5,
      z : 8
  }, {
      x : 2,
      y : 3
  }, {
  }, {
      x : 5,
      h : 'jk'
  }, {
      x : 7
  }] ) {
      if (x === 2) {
          console.log('跳过', g)
          console.log(g, window.g)
          continue
      } /* if end */
      console.log(x, y, rest, g, window.g, 'window.a' , window.a)
      if (x === 5) {
          g.id = 55
          break
      } /* if end */
  }  /* for end */
  console.log('outer', t === g, t, g)
  t.id = 99
  console.log(t)
} /* function end */


test ()
`
export const _ast10 = {
  "type": "Program",
  "start": 0,
  "end": 932,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 903,
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
        "end": 903,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 23,
            "end": 29,
            "expression": {
              "type": "AssignmentExpression",
              "start": 23,
              "end": 29,
              "operator": "=",
              "left": {
                "type": "Identifier",
                "start": 23,
                "end": 24,
                "name": "g"
              },
              "right": {
                "type": "Literal",
                "start": 27,
                "end": 29,
                "value": 34,
                "raw": "34"
              }
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 34,
            "end": 51,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 40,
                "end": 51,
                "id": {
                  "type": "Identifier",
                  "start": 40,
                  "end": 41,
                  "name": "f"
                },
                "init": {
                  "type": "AssignmentExpression",
                  "start": 44,
                  "end": 51,
                  "operator": "=",
                  "left": {
                    "type": "Identifier",
                    "start": 44,
                    "end": 45,
                    "name": "y"
                  },
                  "right": {
                    "type": "Literal",
                    "start": 48,
                    "end": 51,
                    "value": 666,
                    "raw": "666"
                  }
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 56,
            "end": 148,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 60,
                "end": 148,
                "id": {
                  "type": "ArrayPattern",
                  "start": 60,
                  "end": 97,
                  "elements": [
                    {
                      "type": "ObjectPattern",
                      "start": 61,
                      "end": 69,
                      "properties": [
                        {
                          "type": "Property",
                          "start": 63,
                          "end": 68,
                          "method": false,
                          "shorthand": true,
                          "computed": false,
                          "key": {
                            "type": "Identifier",
                            "start": 63,
                            "end": 64,
                            "name": "a"
                          },
                          "kind": "init",
                          "value": {
                            "type": "AssignmentPattern",
                            "start": 63,
                            "end": 68,
                            "left": {
                              "type": "Identifier",
                              "start": 63,
                              "end": 64,
                              "name": "a"
                            },
                            "right": {
                              "type": "Literal",
                              "start": 67,
                              "end": 68,
                              "value": 5,
                              "raw": "5"
                            }
                          }
                        }
                      ]
                    },
                    {
                      "type": "ObjectPattern",
                      "start": 71,
                      "end": 87,
                      "properties": [
                        {
                          "type": "Property",
                          "start": 72,
                          "end": 86,
                          "method": false,
                          "shorthand": false,
                          "computed": false,
                          "key": {
                            "type": "Identifier",
                            "start": 72,
                            "end": 73,
                            "name": "g"
                          },
                          "value": {
                            "type": "AssignmentPattern",
                            "start": 74,
                            "end": 86,
                            "left": {
                              "type": "Identifier",
                              "start": 74,
                              "end": 76,
                              "name": "fg"
                            },
                            "right": {
                              "type": "AssignmentExpression",
                              "start": 79,
                              "end": 86,
                              "operator": "=",
                              "left": {
                                "type": "Identifier",
                                "start": 79,
                                "end": 80,
                                "name": "y"
                              },
                              "right": {
                                "type": "Literal",
                                "start": 83,
                                "end": 86,
                                "value": 666,
                                "raw": "666"
                              }
                            }
                          },
                          "kind": "init"
                        }
                      ]
                    },
                    {
                      "type": "RestElement",
                      "start": 89,
                      "end": 96,
                      "argument": {
                        "type": "Identifier",
                        "start": 92,
                        "end": 96,
                        "name": "rest"
                      }
                    }
                  ]
                },
                "init": {
                  "type": "ArrayExpression",
                  "start": 100,
                  "end": 148,
                  "elements": [
                    {
                      "type": "ObjectExpression",
                      "start": 101,
                      "end": 128,
                      "properties": [
                        {
                          "type": "Property",
                          "start": 102,
                          "end": 127,
                          "method": false,
                          "shorthand": false,
                          "computed": false,
                          "key": {
                            "type": "Identifier",
                            "start": 102,
                            "end": 103,
                            "name": "a"
                          },
                          "value": {
                            "type": "ObjectExpression",
                            "start": 105,
                            "end": 127,
                            "properties": [
                              {
                                "type": "Property",
                                "start": 106,
                                "end": 126,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 106,
                                  "end": 110,
                                  "name": "text"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 112,
                                  "end": 126,
                                  "value": "this is tezt",
                                  "raw": "'this is tezt'"
                                },
                                "kind": "init"
                              }
                            ]
                          },
                          "kind": "init"
                        }
                      ]
                    },
                    {
                      "type": "ObjectExpression",
                      "start": 129,
                      "end": 131,
                      "properties": []
                    },
                    {
                      "type": "ObjectExpression",
                      "start": 132,
                      "end": 138,
                      "properties": [
                        {
                          "type": "Property",
                          "start": 133,
                          "end": 137,
                          "method": false,
                          "shorthand": false,
                          "computed": false,
                          "key": {
                            "type": "Identifier",
                            "start": 133,
                            "end": 134,
                            "name": "g"
                          },
                          "value": {
                            "type": "Literal",
                            "start": 136,
                            "end": 137,
                            "value": 5,
                            "raw": "5"
                          },
                          "kind": "init"
                        }
                      ]
                    },
                    {
                      "type": "Literal",
                      "start": 140,
                      "end": 147,
                      "value": "hhhhh",
                      "raw": "'hhhhh'"
                    }
                  ]
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "ExpressionStatement",
            "start": 153,
            "end": 194,
            "expression": {
              "type": "CallExpression",
              "start": 153,
              "end": 194,
              "callee": {
                "type": "MemberExpression",
                "start": 153,
                "end": 164,
                "object": {
                  "type": "Identifier",
                  "start": 153,
                  "end": 160,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 161,
                  "end": 164,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 165,
                  "end": 171,
                  "value": "test",
                  "raw": "'test'"
                },
                {
                  "type": "Identifier",
                  "start": 173,
                  "end": 174,
                  "name": "a"
                },
                {
                  "type": "Identifier",
                  "start": 176,
                  "end": 177,
                  "name": "g"
                },
                {
                  "type": "Identifier",
                  "start": 179,
                  "end": 180,
                  "name": "f"
                },
                {
                  "type": "Identifier",
                  "start": 182,
                  "end": 184,
                  "name": "fg"
                },
                {
                  "type": "Identifier",
                  "start": 186,
                  "end": 187,
                  "name": "y"
                },
                {
                  "type": "Identifier",
                  "start": 189,
                  "end": 193,
                  "name": "rest"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 199,
            "end": 210,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 203,
                "end": 209,
                "id": {
                  "type": "Identifier",
                  "start": 203,
                  "end": 204,
                  "name": "t"
                },
                "init": {
                  "type": "Literal",
                  "start": 207,
                  "end": 209,
                  "value": 34,
                  "raw": "34"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "ForOfStatement",
            "start": 215,
            "end": 813,
            "await": false,
            "left": {
              "type": "VariableDeclaration",
              "start": 220,
              "end": 359,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 224,
                  "end": 359,
                  "id": {
                    "type": "ObjectPattern",
                    "start": 224,
                    "end": 359,
                    "properties": [
                      {
                        "type": "Property",
                        "start": 234,
                        "end": 239,
                        "method": false,
                        "shorthand": true,
                        "computed": false,
                        "key": {
                          "type": "Identifier",
                          "start": 234,
                          "end": 235,
                          "name": "c"
                        },
                        "kind": "init",
                        "value": {
                          "type": "AssignmentPattern",
                          "start": 234,
                          "end": 239,
                          "left": {
                            "type": "Identifier",
                            "start": 234,
                            "end": 235,
                            "name": "c"
                          },
                          "right": {
                            "type": "Literal",
                            "start": 238,
                            "end": 239,
                            "value": 5,
                            "raw": "5"
                          }
                        }
                      },
                      {
                        "type": "Property",
                        "start": 249,
                        "end": 287,
                        "method": false,
                        "shorthand": true,
                        "computed": false,
                        "key": {
                          "type": "Identifier",
                          "start": 249,
                          "end": 250,
                          "name": "x"
                        },
                        "kind": "init",
                        "value": {
                          "type": "AssignmentPattern",
                          "start": 249,
                          "end": 287,
                          "left": {
                            "type": "Identifier",
                            "start": 249,
                            "end": 250,
                            "name": "x"
                          },
                          "right": {
                            "type": "AssignmentExpression",
                            "start": 253,
                            "end": 287,
                            "operator": "=",
                            "left": {
                              "type": "Identifier",
                              "start": 253,
                              "end": 254,
                              "name": "g"
                            },
                            "right": {
                              "type": "ObjectExpression",
                              "start": 257,
                              "end": 287,
                              "properties": [
                                {
                                  "type": "Property",
                                  "start": 271,
                                  "end": 277,
                                  "method": false,
                                  "shorthand": false,
                                  "computed": false,
                                  "key": {
                                    "type": "Identifier",
                                    "start": 271,
                                    "end": 273,
                                    "name": "id"
                                  },
                                  "value": {
                                    "type": "Identifier",
                                    "start": 276,
                                    "end": 277,
                                    "name": "g"
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
                        "start": 297,
                        "end": 336,
                        "method": false,
                        "shorthand": true,
                        "computed": false,
                        "key": {
                          "type": "Identifier",
                          "start": 297,
                          "end": 298,
                          "name": "y"
                        },
                        "kind": "init",
                        "value": {
                          "type": "AssignmentPattern",
                          "start": 297,
                          "end": 336,
                          "left": {
                            "type": "Identifier",
                            "start": 297,
                            "end": 298,
                            "name": "y"
                          },
                          "right": {
                            "type": "ObjectExpression",
                            "start": 301,
                            "end": 336,
                            "properties": [
                              {
                                "type": "Property",
                                "start": 315,
                                "end": 325,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 315,
                                  "end": 317,
                                  "name": "hh"
                                },
                                "value": {
                                  "type": "AssignmentExpression",
                                  "start": 320,
                                  "end": 325,
                                  "operator": "=",
                                  "left": {
                                    "type": "Identifier",
                                    "start": 320,
                                    "end": 321,
                                    "name": "a"
                                  },
                                  "right": {
                                    "type": "Identifier",
                                    "start": 324,
                                    "end": 325,
                                    "name": "g"
                                  }
                                },
                                "kind": "init"
                              }
                            ]
                          }
                        }
                      },
                      {
                        "type": "RestElement",
                        "start": 346,
                        "end": 353,
                        "argument": {
                          "type": "Identifier",
                          "start": 349,
                          "end": 353,
                          "name": "rest"
                        }
                      }
                    ]
                  },
                  "init": null
                }
              ],
              "kind": "let"
            },
            "right": {
              "type": "ArrayExpression",
              "start": 363,
              "end": 512,
              "elements": [
                {
                  "type": "ObjectExpression",
                  "start": 364,
                  "end": 400,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 374,
                      "end": 379,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 374,
                        "end": 375,
                        "name": "y"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 378,
                        "end": 379,
                        "value": 5,
                        "raw": "5"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 389,
                      "end": 394,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 389,
                        "end": 390,
                        "name": "z"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 393,
                        "end": 394,
                        "value": 8,
                        "raw": "8"
                      },
                      "kind": "init"
                    }
                  ]
                },
                {
                  "type": "ObjectExpression",
                  "start": 402,
                  "end": 438,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 412,
                      "end": 417,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 412,
                        "end": 413,
                        "name": "x"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 416,
                        "end": 417,
                        "value": 2,
                        "raw": "2"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 427,
                      "end": 432,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 427,
                        "end": 428,
                        "name": "y"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 431,
                        "end": 432,
                        "value": 3,
                        "raw": "3"
                      },
                      "kind": "init"
                    }
                  ]
                },
                {
                  "type": "ObjectExpression",
                  "start": 440,
                  "end": 447,
                  "properties": []
                },
                {
                  "type": "ObjectExpression",
                  "start": 449,
                  "end": 488,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 459,
                      "end": 464,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 459,
                        "end": 460,
                        "name": "x"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 463,
                        "end": 464,
                        "value": 5,
                        "raw": "5"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 474,
                      "end": 482,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 474,
                        "end": 475,
                        "name": "h"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 478,
                        "end": 482,
                        "value": "jk",
                        "raw": "'jk'"
                      },
                      "kind": "init"
                    }
                  ]
                },
                {
                  "type": "ObjectExpression",
                  "start": 490,
                  "end": 511,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 500,
                      "end": 505,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 500,
                        "end": 501,
                        "name": "x"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 504,
                        "end": 505,
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
              "start": 515,
              "end": 813,
              "body": [
                {
                  "type": "IfStatement",
                  "start": 525,
                  "end": 640,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 529,
                    "end": 536,
                    "left": {
                      "type": "Identifier",
                      "start": 529,
                      "end": 530,
                      "name": "x"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 535,
                      "end": 536,
                      "value": 2,
                      "raw": "2"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 538,
                    "end": 640,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 552,
                        "end": 572,
                        "expression": {
                          "type": "CallExpression",
                          "start": 552,
                          "end": 572,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 552,
                            "end": 563,
                            "object": {
                              "type": "Identifier",
                              "start": 552,
                              "end": 559,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 560,
                              "end": 563,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 564,
                              "end": 568,
                              "value": "跳过",
                              "raw": "'跳过'"
                            },
                            {
                              "type": "Identifier",
                              "start": 570,
                              "end": 571,
                              "name": "g"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 585,
                        "end": 609,
                        "expression": {
                          "type": "CallExpression",
                          "start": 585,
                          "end": 609,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 585,
                            "end": 596,
                            "object": {
                              "type": "Identifier",
                              "start": 585,
                              "end": 592,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 593,
                              "end": 596,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 597,
                              "end": 598,
                              "name": "g"
                            },
                            {
                              "type": "MemberExpression",
                              "start": 600,
                              "end": 608,
                              "object": {
                                "type": "Identifier",
                                "start": 600,
                                "end": 606,
                                "name": "window"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 607,
                                "end": 608,
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
                        "start": 622,
                        "end": 630,
                        "label": null
                      }
                    ]
                  },
                  "alternate": null
                },
                {
                  "type": "ExpressionStatement",
                  "start": 662,
                  "end": 721,
                  "expression": {
                    "type": "CallExpression",
                    "start": 662,
                    "end": 721,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 662,
                      "end": 673,
                      "object": {
                        "type": "Identifier",
                        "start": 662,
                        "end": 669,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 670,
                        "end": 673,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 674,
                        "end": 675,
                        "name": "x"
                      },
                      {
                        "type": "Identifier",
                        "start": 677,
                        "end": 678,
                        "name": "y"
                      },
                      {
                        "type": "Identifier",
                        "start": 680,
                        "end": 684,
                        "name": "rest"
                      },
                      {
                        "type": "Identifier",
                        "start": 686,
                        "end": 687,
                        "name": "g"
                      },
                      {
                        "type": "MemberExpression",
                        "start": 689,
                        "end": 697,
                        "object": {
                          "type": "Identifier",
                          "start": 689,
                          "end": 695,
                          "name": "window"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 696,
                          "end": 697,
                          "name": "g"
                        },
                        "computed": false,
                        "optional": false
                      },
                      {
                        "type": "Literal",
                        "start": 699,
                        "end": 709,
                        "value": "window.a",
                        "raw": "'window.a'"
                      },
                      {
                        "type": "MemberExpression",
                        "start": 712,
                        "end": 720,
                        "object": {
                          "type": "Identifier",
                          "start": 712,
                          "end": 718,
                          "name": "window"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 719,
                          "end": 720,
                          "name": "a"
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
                  "start": 730,
                  "end": 794,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 734,
                    "end": 741,
                    "left": {
                      "type": "Identifier",
                      "start": 734,
                      "end": 735,
                      "name": "x"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 740,
                      "end": 741,
                      "value": 5,
                      "raw": "5"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 743,
                    "end": 794,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 757,
                        "end": 766,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 757,
                          "end": 766,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 757,
                            "end": 761,
                            "object": {
                              "type": "Identifier",
                              "start": 757,
                              "end": 758,
                              "name": "g"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 759,
                              "end": 761,
                              "name": "id"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Literal",
                            "start": 764,
                            "end": 766,
                            "value": 55,
                            "raw": "55"
                          }
                        }
                      },
                      {
                        "type": "BreakStatement",
                        "start": 779,
                        "end": 784,
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
            "type": "ExpressionStatement",
            "start": 833,
            "end": 868,
            "expression": {
              "type": "CallExpression",
              "start": 833,
              "end": 868,
              "callee": {
                "type": "MemberExpression",
                "start": 833,
                "end": 844,
                "object": {
                  "type": "Identifier",
                  "start": 833,
                  "end": 840,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 841,
                  "end": 844,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 845,
                  "end": 852,
                  "value": "outer",
                  "raw": "'outer'"
                },
                {
                  "type": "BinaryExpression",
                  "start": 854,
                  "end": 861,
                  "left": {
                    "type": "Identifier",
                    "start": 854,
                    "end": 855,
                    "name": "t"
                  },
                  "operator": "===",
                  "right": {
                    "type": "Identifier",
                    "start": 860,
                    "end": 861,
                    "name": "g"
                  }
                },
                {
                  "type": "Identifier",
                  "start": 863,
                  "end": 864,
                  "name": "t"
                },
                {
                  "type": "Identifier",
                  "start": 866,
                  "end": 867,
                  "name": "g"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 873,
            "end": 882,
            "expression": {
              "type": "AssignmentExpression",
              "start": 873,
              "end": 882,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 873,
                "end": 877,
                "object": {
                  "type": "Identifier",
                  "start": 873,
                  "end": 874,
                  "name": "t"
                },
                "property": {
                  "type": "Identifier",
                  "start": 875,
                  "end": 877,
                  "name": "id"
                },
                "computed": false,
                "optional": false
              },
              "right": {
                "type": "Literal",
                "start": 880,
                "end": 882,
                "value": 99,
                "raw": "99"
              }
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 887,
            "end": 901,
            "expression": {
              "type": "CallExpression",
              "start": 887,
              "end": 901,
              "callee": {
                "type": "MemberExpression",
                "start": 887,
                "end": 898,
                "object": {
                  "type": "Identifier",
                  "start": 887,
                  "end": 894,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 895,
                  "end": 898,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 899,
                  "end": 900,
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
      "start": 925,
      "end": 932,
      "expression": {
        "type": "CallExpression",
        "start": 925,
        "end": 932,
        "callee": {
          "type": "Identifier",
          "start": 925,
          "end": 929,
          "name": "test"
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
};