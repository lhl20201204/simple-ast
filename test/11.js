const code = `
function test () {
  g = 34
  const test = 'dfsdfsd'
  const {
      [test]: { text } = { text: 'default' }
  } = {dfsdfsd: {text: 'this is tdfjasldfs'}};
  console.log(f);
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
  test()
`

export const _ast11 = {
  "type": "Program",
  "start": 0,
  "end": 1066,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 1036,
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
        "end": 1036,
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
            "end": 56,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 40,
                "end": 56,
                "id": {
                  "type": "Identifier",
                  "start": 40,
                  "end": 44,
                  "name": "test"
                },
                "init": {
                  "type": "Literal",
                  "start": 47,
                  "end": 56,
                  "value": "dfsdfsd",
                  "raw": "'dfsdfsd'"
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 61,
            "end": 164,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 67,
                "end": 163,
                "id": {
                  "type": "ObjectPattern",
                  "start": 67,
                  "end": 121,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 77,
                      "end": 115,
                      "method": false,
                      "shorthand": false,
                      "computed": true,
                      "key": {
                        "type": "Identifier",
                        "start": 78,
                        "end": 82,
                        "name": "test"
                      },
                      "value": {
                        "type": "AssignmentPattern",
                        "start": 85,
                        "end": 115,
                        "left": {
                          "type": "ObjectPattern",
                          "start": 85,
                          "end": 93,
                          "properties": [
                            {
                              "type": "Property",
                              "start": 87,
                              "end": 91,
                              "method": false,
                              "shorthand": true,
                              "computed": false,
                              "key": {
                                "type": "Identifier",
                                "start": 87,
                                "end": 91,
                                "name": "text"
                              },
                              "kind": "init",
                              "value": {
                                "type": "Identifier",
                                "start": 87,
                                "end": 91,
                                "name": "text"
                              }
                            }
                          ]
                        },
                        "right": {
                          "type": "ObjectExpression",
                          "start": 96,
                          "end": 115,
                          "properties": [
                            {
                              "type": "Property",
                              "start": 98,
                              "end": 113,
                              "method": false,
                              "shorthand": false,
                              "computed": false,
                              "key": {
                                "type": "Identifier",
                                "start": 98,
                                "end": 102,
                                "name": "text"
                              },
                              "value": {
                                "type": "Literal",
                                "start": 104,
                                "end": 113,
                                "value": "default",
                                "raw": "'default'"
                              },
                              "kind": "init"
                            }
                          ]
                        }
                      },
                      "kind": "init"
                    }
                  ]
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 124,
                  "end": 163,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 125,
                      "end": 162,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 125,
                        "end": 132,
                        "name": "dfsdfsd"
                      },
                      "value": {
                        "type": "ObjectExpression",
                        "start": 134,
                        "end": 162,
                        "properties": [
                          {
                            "type": "Property",
                            "start": 135,
                            "end": 161,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 135,
                              "end": 139,
                              "name": "text"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 141,
                              "end": 161,
                              "value": "this is tdfjasldfs",
                              "raw": "'this is tdfjasldfs'"
                            },
                            "kind": "init"
                          }
                        ]
                      },
                      "kind": "init"
                    }
                  ]
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 169,
            "end": 184,
            "expression": {
              "type": "CallExpression",
              "start": 169,
              "end": 183,
              "callee": {
                "type": "MemberExpression",
                "start": 169,
                "end": 180,
                "object": {
                  "type": "Identifier",
                  "start": 169,
                  "end": 176,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 177,
                  "end": 180,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 181,
                  "end": 182,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 189,
            "end": 281,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 193,
                "end": 281,
                "id": {
                  "type": "ArrayPattern",
                  "start": 193,
                  "end": 230,
                  "elements": [
                    {
                      "type": "ObjectPattern",
                      "start": 194,
                      "end": 202,
                      "properties": [
                        {
                          "type": "Property",
                          "start": 196,
                          "end": 201,
                          "method": false,
                          "shorthand": true,
                          "computed": false,
                          "key": {
                            "type": "Identifier",
                            "start": 196,
                            "end": 197,
                            "name": "a"
                          },
                          "kind": "init",
                          "value": {
                            "type": "AssignmentPattern",
                            "start": 196,
                            "end": 201,
                            "left": {
                              "type": "Identifier",
                              "start": 196,
                              "end": 197,
                              "name": "a"
                            },
                            "right": {
                              "type": "Literal",
                              "start": 200,
                              "end": 201,
                              "value": 5,
                              "raw": "5"
                            }
                          }
                        }
                      ]
                    },
                    {
                      "type": "ObjectPattern",
                      "start": 204,
                      "end": 220,
                      "properties": [
                        {
                          "type": "Property",
                          "start": 205,
                          "end": 219,
                          "method": false,
                          "shorthand": false,
                          "computed": false,
                          "key": {
                            "type": "Identifier",
                            "start": 205,
                            "end": 206,
                            "name": "g"
                          },
                          "value": {
                            "type": "AssignmentPattern",
                            "start": 207,
                            "end": 219,
                            "left": {
                              "type": "Identifier",
                              "start": 207,
                              "end": 209,
                              "name": "fg"
                            },
                            "right": {
                              "type": "AssignmentExpression",
                              "start": 212,
                              "end": 219,
                              "operator": "=",
                              "left": {
                                "type": "Identifier",
                                "start": 212,
                                "end": 213,
                                "name": "y"
                              },
                              "right": {
                                "type": "Literal",
                                "start": 216,
                                "end": 219,
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
                      "start": 222,
                      "end": 229,
                      "argument": {
                        "type": "Identifier",
                        "start": 225,
                        "end": 229,
                        "name": "rest"
                      }
                    }
                  ]
                },
                "init": {
                  "type": "ArrayExpression",
                  "start": 233,
                  "end": 281,
                  "elements": [
                    {
                      "type": "ObjectExpression",
                      "start": 234,
                      "end": 261,
                      "properties": [
                        {
                          "type": "Property",
                          "start": 235,
                          "end": 260,
                          "method": false,
                          "shorthand": false,
                          "computed": false,
                          "key": {
                            "type": "Identifier",
                            "start": 235,
                            "end": 236,
                            "name": "a"
                          },
                          "value": {
                            "type": "ObjectExpression",
                            "start": 238,
                            "end": 260,
                            "properties": [
                              {
                                "type": "Property",
                                "start": 239,
                                "end": 259,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 239,
                                  "end": 243,
                                  "name": "text"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 245,
                                  "end": 259,
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
                      "start": 262,
                      "end": 264,
                      "properties": []
                    },
                    {
                      "type": "ObjectExpression",
                      "start": 265,
                      "end": 271,
                      "properties": [
                        {
                          "type": "Property",
                          "start": 266,
                          "end": 270,
                          "method": false,
                          "shorthand": false,
                          "computed": false,
                          "key": {
                            "type": "Identifier",
                            "start": 266,
                            "end": 267,
                            "name": "g"
                          },
                          "value": {
                            "type": "Literal",
                            "start": 269,
                            "end": 270,
                            "value": 5,
                            "raw": "5"
                          },
                          "kind": "init"
                        }
                      ]
                    },
                    {
                      "type": "Literal",
                      "start": 273,
                      "end": 280,
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
            "start": 286,
            "end": 327,
            "expression": {
              "type": "CallExpression",
              "start": 286,
              "end": 327,
              "callee": {
                "type": "MemberExpression",
                "start": 286,
                "end": 297,
                "object": {
                  "type": "Identifier",
                  "start": 286,
                  "end": 293,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 294,
                  "end": 297,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 298,
                  "end": 304,
                  "value": "test",
                  "raw": "'test'"
                },
                {
                  "type": "Identifier",
                  "start": 306,
                  "end": 307,
                  "name": "a"
                },
                {
                  "type": "Identifier",
                  "start": 309,
                  "end": 310,
                  "name": "g"
                },
                {
                  "type": "Identifier",
                  "start": 312,
                  "end": 313,
                  "name": "f"
                },
                {
                  "type": "Identifier",
                  "start": 315,
                  "end": 317,
                  "name": "fg"
                },
                {
                  "type": "Identifier",
                  "start": 319,
                  "end": 320,
                  "name": "y"
                },
                {
                  "type": "Identifier",
                  "start": 322,
                  "end": 326,
                  "name": "rest"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 332,
            "end": 343,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 336,
                "end": 342,
                "id": {
                  "type": "Identifier",
                  "start": 336,
                  "end": 337,
                  "name": "t"
                },
                "init": {
                  "type": "Literal",
                  "start": 340,
                  "end": 342,
                  "value": 34,
                  "raw": "34"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "ForOfStatement",
            "start": 348,
            "end": 946,
            "await": false,
            "left": {
              "type": "VariableDeclaration",
              "start": 353,
              "end": 492,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 357,
                  "end": 492,
                  "id": {
                    "type": "ObjectPattern",
                    "start": 357,
                    "end": 492,
                    "properties": [
                      {
                        "type": "Property",
                        "start": 367,
                        "end": 372,
                        "method": false,
                        "shorthand": true,
                        "computed": false,
                        "key": {
                          "type": "Identifier",
                          "start": 367,
                          "end": 368,
                          "name": "c"
                        },
                        "kind": "init",
                        "value": {
                          "type": "AssignmentPattern",
                          "start": 367,
                          "end": 372,
                          "left": {
                            "type": "Identifier",
                            "start": 367,
                            "end": 368,
                            "name": "c"
                          },
                          "right": {
                            "type": "Literal",
                            "start": 371,
                            "end": 372,
                            "value": 5,
                            "raw": "5"
                          }
                        }
                      },
                      {
                        "type": "Property",
                        "start": 382,
                        "end": 420,
                        "method": false,
                        "shorthand": true,
                        "computed": false,
                        "key": {
                          "type": "Identifier",
                          "start": 382,
                          "end": 383,
                          "name": "x"
                        },
                        "kind": "init",
                        "value": {
                          "type": "AssignmentPattern",
                          "start": 382,
                          "end": 420,
                          "left": {
                            "type": "Identifier",
                            "start": 382,
                            "end": 383,
                            "name": "x"
                          },
                          "right": {
                            "type": "AssignmentExpression",
                            "start": 386,
                            "end": 420,
                            "operator": "=",
                            "left": {
                              "type": "Identifier",
                              "start": 386,
                              "end": 387,
                              "name": "g"
                            },
                            "right": {
                              "type": "ObjectExpression",
                              "start": 390,
                              "end": 420,
                              "properties": [
                                {
                                  "type": "Property",
                                  "start": 404,
                                  "end": 410,
                                  "method": false,
                                  "shorthand": false,
                                  "computed": false,
                                  "key": {
                                    "type": "Identifier",
                                    "start": 404,
                                    "end": 406,
                                    "name": "id"
                                  },
                                  "value": {
                                    "type": "Identifier",
                                    "start": 409,
                                    "end": 410,
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
                        "start": 430,
                        "end": 469,
                        "method": false,
                        "shorthand": true,
                        "computed": false,
                        "key": {
                          "type": "Identifier",
                          "start": 430,
                          "end": 431,
                          "name": "y"
                        },
                        "kind": "init",
                        "value": {
                          "type": "AssignmentPattern",
                          "start": 430,
                          "end": 469,
                          "left": {
                            "type": "Identifier",
                            "start": 430,
                            "end": 431,
                            "name": "y"
                          },
                          "right": {
                            "type": "ObjectExpression",
                            "start": 434,
                            "end": 469,
                            "properties": [
                              {
                                "type": "Property",
                                "start": 448,
                                "end": 458,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 448,
                                  "end": 450,
                                  "name": "hh"
                                },
                                "value": {
                                  "type": "AssignmentExpression",
                                  "start": 453,
                                  "end": 458,
                                  "operator": "=",
                                  "left": {
                                    "type": "Identifier",
                                    "start": 453,
                                    "end": 454,
                                    "name": "a"
                                  },
                                  "right": {
                                    "type": "Identifier",
                                    "start": 457,
                                    "end": 458,
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
                        "start": 479,
                        "end": 486,
                        "argument": {
                          "type": "Identifier",
                          "start": 482,
                          "end": 486,
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
              "start": 496,
              "end": 645,
              "elements": [
                {
                  "type": "ObjectExpression",
                  "start": 497,
                  "end": 533,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 507,
                      "end": 512,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 507,
                        "end": 508,
                        "name": "y"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 511,
                        "end": 512,
                        "value": 5,
                        "raw": "5"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 522,
                      "end": 527,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 522,
                        "end": 523,
                        "name": "z"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 526,
                        "end": 527,
                        "value": 8,
                        "raw": "8"
                      },
                      "kind": "init"
                    }
                  ]
                },
                {
                  "type": "ObjectExpression",
                  "start": 535,
                  "end": 571,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 545,
                      "end": 550,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 545,
                        "end": 546,
                        "name": "x"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 549,
                        "end": 550,
                        "value": 2,
                        "raw": "2"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 560,
                      "end": 565,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 560,
                        "end": 561,
                        "name": "y"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 564,
                        "end": 565,
                        "value": 3,
                        "raw": "3"
                      },
                      "kind": "init"
                    }
                  ]
                },
                {
                  "type": "ObjectExpression",
                  "start": 573,
                  "end": 580,
                  "properties": []
                },
                {
                  "type": "ObjectExpression",
                  "start": 582,
                  "end": 621,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 592,
                      "end": 597,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 592,
                        "end": 593,
                        "name": "x"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 596,
                        "end": 597,
                        "value": 5,
                        "raw": "5"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 607,
                      "end": 615,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 607,
                        "end": 608,
                        "name": "h"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 611,
                        "end": 615,
                        "value": "jk",
                        "raw": "'jk'"
                      },
                      "kind": "init"
                    }
                  ]
                },
                {
                  "type": "ObjectExpression",
                  "start": 623,
                  "end": 644,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 633,
                      "end": 638,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 633,
                        "end": 634,
                        "name": "x"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 637,
                        "end": 638,
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
              "start": 648,
              "end": 946,
              "body": [
                {
                  "type": "IfStatement",
                  "start": 658,
                  "end": 773,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 662,
                    "end": 669,
                    "left": {
                      "type": "Identifier",
                      "start": 662,
                      "end": 663,
                      "name": "x"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 668,
                      "end": 669,
                      "value": 2,
                      "raw": "2"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 671,
                    "end": 773,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 685,
                        "end": 705,
                        "expression": {
                          "type": "CallExpression",
                          "start": 685,
                          "end": 705,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 685,
                            "end": 696,
                            "object": {
                              "type": "Identifier",
                              "start": 685,
                              "end": 692,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 693,
                              "end": 696,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 697,
                              "end": 701,
                              "value": "跳过",
                              "raw": "'跳过'"
                            },
                            {
                              "type": "Identifier",
                              "start": 703,
                              "end": 704,
                              "name": "g"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 718,
                        "end": 742,
                        "expression": {
                          "type": "CallExpression",
                          "start": 718,
                          "end": 742,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 718,
                            "end": 729,
                            "object": {
                              "type": "Identifier",
                              "start": 718,
                              "end": 725,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 726,
                              "end": 729,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 730,
                              "end": 731,
                              "name": "g"
                            },
                            {
                              "type": "MemberExpression",
                              "start": 733,
                              "end": 741,
                              "object": {
                                "type": "Identifier",
                                "start": 733,
                                "end": 739,
                                "name": "window"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 740,
                                "end": 741,
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
                        "start": 755,
                        "end": 763,
                        "label": null
                      }
                    ]
                  },
                  "alternate": null
                },
                {
                  "type": "ExpressionStatement",
                  "start": 795,
                  "end": 854,
                  "expression": {
                    "type": "CallExpression",
                    "start": 795,
                    "end": 854,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 795,
                      "end": 806,
                      "object": {
                        "type": "Identifier",
                        "start": 795,
                        "end": 802,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 803,
                        "end": 806,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 807,
                        "end": 808,
                        "name": "x"
                      },
                      {
                        "type": "Identifier",
                        "start": 810,
                        "end": 811,
                        "name": "y"
                      },
                      {
                        "type": "Identifier",
                        "start": 813,
                        "end": 817,
                        "name": "rest"
                      },
                      {
                        "type": "Identifier",
                        "start": 819,
                        "end": 820,
                        "name": "g"
                      },
                      {
                        "type": "MemberExpression",
                        "start": 822,
                        "end": 830,
                        "object": {
                          "type": "Identifier",
                          "start": 822,
                          "end": 828,
                          "name": "window"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 829,
                          "end": 830,
                          "name": "g"
                        },
                        "computed": false,
                        "optional": false
                      },
                      {
                        "type": "Literal",
                        "start": 832,
                        "end": 842,
                        "value": "window.a",
                        "raw": "'window.a'"
                      },
                      {
                        "type": "MemberExpression",
                        "start": 845,
                        "end": 853,
                        "object": {
                          "type": "Identifier",
                          "start": 845,
                          "end": 851,
                          "name": "window"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 852,
                          "end": 853,
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
                  "start": 863,
                  "end": 927,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 867,
                    "end": 874,
                    "left": {
                      "type": "Identifier",
                      "start": 867,
                      "end": 868,
                      "name": "x"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 873,
                      "end": 874,
                      "value": 5,
                      "raw": "5"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 876,
                    "end": 927,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 890,
                        "end": 899,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 890,
                          "end": 899,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 890,
                            "end": 894,
                            "object": {
                              "type": "Identifier",
                              "start": 890,
                              "end": 891,
                              "name": "g"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 892,
                              "end": 894,
                              "name": "id"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Literal",
                            "start": 897,
                            "end": 899,
                            "value": 55,
                            "raw": "55"
                          }
                        }
                      },
                      {
                        "type": "BreakStatement",
                        "start": 912,
                        "end": 917,
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
            "start": 966,
            "end": 1001,
            "expression": {
              "type": "CallExpression",
              "start": 966,
              "end": 1001,
              "callee": {
                "type": "MemberExpression",
                "start": 966,
                "end": 977,
                "object": {
                  "type": "Identifier",
                  "start": 966,
                  "end": 973,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 974,
                  "end": 977,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 978,
                  "end": 985,
                  "value": "outer",
                  "raw": "'outer'"
                },
                {
                  "type": "BinaryExpression",
                  "start": 987,
                  "end": 994,
                  "left": {
                    "type": "Identifier",
                    "start": 987,
                    "end": 988,
                    "name": "t"
                  },
                  "operator": "===",
                  "right": {
                    "type": "Identifier",
                    "start": 993,
                    "end": 994,
                    "name": "g"
                  }
                },
                {
                  "type": "Identifier",
                  "start": 996,
                  "end": 997,
                  "name": "t"
                },
                {
                  "type": "Identifier",
                  "start": 999,
                  "end": 1000,
                  "name": "g"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1006,
            "end": 1015,
            "expression": {
              "type": "AssignmentExpression",
              "start": 1006,
              "end": 1015,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 1006,
                "end": 1010,
                "object": {
                  "type": "Identifier",
                  "start": 1006,
                  "end": 1007,
                  "name": "t"
                },
                "property": {
                  "type": "Identifier",
                  "start": 1008,
                  "end": 1010,
                  "name": "id"
                },
                "computed": false,
                "optional": false
              },
              "right": {
                "type": "Literal",
                "start": 1013,
                "end": 1015,
                "value": 99,
                "raw": "99"
              }
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1020,
            "end": 1034,
            "expression": {
              "type": "CallExpression",
              "start": 1020,
              "end": 1034,
              "callee": {
                "type": "MemberExpression",
                "start": 1020,
                "end": 1031,
                "object": {
                  "type": "Identifier",
                  "start": 1020,
                  "end": 1027,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 1028,
                  "end": 1031,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 1032,
                  "end": 1033,
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
      "start": 1060,
      "end": 1066,
      "expression": {
        "type": "CallExpression",
        "start": 1060,
        "end": 1066,
        "callee": {
          "type": "Identifier",
          "start": 1060,
          "end": 1064,
          "name": "test"
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}