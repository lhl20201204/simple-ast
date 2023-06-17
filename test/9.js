export const code = `function test2 () {
  // let ggg = {x: 4, y: 5, z: 6}
  // let { x, ...rest }= ggg;
  // rest.z = 8
  // console.log(ggg, rest);
  g = 34
  let [{ a}, {g}, ...rest] = [{a: {g: 4}},{g: 5}, 'hhhhh']
  console.log(a, g, rest)
  let t = 34;
  for (let {
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


  test2()
  console.log('window.g', window.g)`
export const _ast9 = {
  "type": "Program",
  "start": 0,
  "end": 1003,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 2,
      "end": 932,
      "id": {
        "type": "Identifier",
        "start": 11,
        "end": 16,
        "name": "test2"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 20,
        "end": 932,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 143,
            "end": 149,
            "expression": {
              "type": "AssignmentExpression",
              "start": 143,
              "end": 149,
              "operator": "=",
              "left": {
                "type": "Identifier",
                "start": 143,
                "end": 144,
                "name": "g"
              },
              "right": {
                "type": "Literal",
                "start": 147,
                "end": 149,
                "value": 34,
                "raw": "34"
              }
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 154,
            "end": 210,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 158,
                "end": 210,
                "id": {
                  "type": "ArrayPattern",
                  "start": 158,
                  "end": 178,
                  "elements": [
                    {
                      "type": "ObjectPattern",
                      "start": 159,
                      "end": 163,
                      "properties": [
                        {
                          "type": "Property",
                          "start": 161,
                          "end": 162,
                          "method": false,
                          "shorthand": true,
                          "computed": false,
                          "key": {
                            "type": "Identifier",
                            "start": 161,
                            "end": 162,
                            "name": "a"
                          },
                          "kind": "init",
                          "value": {
                            "type": "Identifier",
                            "start": 161,
                            "end": 162,
                            "name": "a"
                          }
                        }
                      ]
                    },
                    {
                      "type": "ObjectPattern",
                      "start": 165,
                      "end": 168,
                      "properties": [
                        {
                          "type": "Property",
                          "start": 166,
                          "end": 167,
                          "method": false,
                          "shorthand": true,
                          "computed": false,
                          "key": {
                            "type": "Identifier",
                            "start": 166,
                            "end": 167,
                            "name": "g"
                          },
                          "kind": "init",
                          "value": {
                            "type": "Identifier",
                            "start": 166,
                            "end": 167,
                            "name": "g"
                          }
                        }
                      ]
                    },
                    {
                      "type": "RestElement",
                      "start": 170,
                      "end": 177,
                      "argument": {
                        "type": "Identifier",
                        "start": 173,
                        "end": 177,
                        "name": "rest"
                      }
                    }
                  ]
                },
                "init": {
                  "type": "ArrayExpression",
                  "start": 181,
                  "end": 210,
                  "elements": [
                    {
                      "type": "ObjectExpression",
                      "start": 182,
                      "end": 193,
                      "properties": [
                        {
                          "type": "Property",
                          "start": 183,
                          "end": 192,
                          "method": false,
                          "shorthand": false,
                          "computed": false,
                          "key": {
                            "type": "Identifier",
                            "start": 183,
                            "end": 184,
                            "name": "a"
                          },
                          "value": {
                            "type": "ObjectExpression",
                            "start": 186,
                            "end": 192,
                            "properties": [
                              {
                                "type": "Property",
                                "start": 187,
                                "end": 191,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 187,
                                  "end": 188,
                                  "name": "g"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 190,
                                  "end": 191,
                                  "value": 4,
                                  "raw": "4"
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
                      "start": 194,
                      "end": 200,
                      "properties": [
                        {
                          "type": "Property",
                          "start": 195,
                          "end": 199,
                          "method": false,
                          "shorthand": false,
                          "computed": false,
                          "key": {
                            "type": "Identifier",
                            "start": 195,
                            "end": 196,
                            "name": "g"
                          },
                          "value": {
                            "type": "Literal",
                            "start": 198,
                            "end": 199,
                            "value": 5,
                            "raw": "5"
                          },
                          "kind": "init"
                        }
                      ]
                    },
                    {
                      "type": "Literal",
                      "start": 202,
                      "end": 209,
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
            "start": 215,
            "end": 238,
            "expression": {
              "type": "CallExpression",
              "start": 215,
              "end": 238,
              "callee": {
                "type": "MemberExpression",
                "start": 215,
                "end": 226,
                "object": {
                  "type": "Identifier",
                  "start": 215,
                  "end": 222,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 223,
                  "end": 226,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 227,
                  "end": 228,
                  "name": "a"
                },
                {
                  "type": "Identifier",
                  "start": 230,
                  "end": 231,
                  "name": "g"
                },
                {
                  "type": "Identifier",
                  "start": 233,
                  "end": 237,
                  "name": "rest"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 243,
            "end": 254,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 247,
                "end": 253,
                "id": {
                  "type": "Identifier",
                  "start": 247,
                  "end": 248,
                  "name": "t"
                },
                "init": {
                  "type": "Literal",
                  "start": 251,
                  "end": 253,
                  "value": 34,
                  "raw": "34"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "ForOfStatement",
            "start": 259,
            "end": 842,
            "await": false,
            "left": {
              "type": "VariableDeclaration",
              "start": 264,
              "end": 388,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 268,
                  "end": 388,
                  "id": {
                    "type": "ObjectPattern",
                    "start": 268,
                    "end": 388,
                    "properties": [
                      {
                        "type": "Property",
                        "start": 278,
                        "end": 316,
                        "method": false,
                        "shorthand": true,
                        "computed": false,
                        "key": {
                          "type": "Identifier",
                          "start": 278,
                          "end": 279,
                          "name": "x"
                        },
                        "kind": "init",
                        "value": {
                          "type": "AssignmentPattern",
                          "start": 278,
                          "end": 316,
                          "left": {
                            "type": "Identifier",
                            "start": 278,
                            "end": 279,
                            "name": "x"
                          },
                          "right": {
                            "type": "AssignmentExpression",
                            "start": 282,
                            "end": 316,
                            "operator": "=",
                            "left": {
                              "type": "Identifier",
                              "start": 282,
                              "end": 283,
                              "name": "g"
                            },
                            "right": {
                              "type": "ObjectExpression",
                              "start": 286,
                              "end": 316,
                              "properties": [
                                {
                                  "type": "Property",
                                  "start": 300,
                                  "end": 306,
                                  "method": false,
                                  "shorthand": false,
                                  "computed": false,
                                  "key": {
                                    "type": "Identifier",
                                    "start": 300,
                                    "end": 302,
                                    "name": "id"
                                  },
                                  "value": {
                                    "type": "Identifier",
                                    "start": 305,
                                    "end": 306,
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
                        "start": 326,
                        "end": 365,
                        "method": false,
                        "shorthand": true,
                        "computed": false,
                        "key": {
                          "type": "Identifier",
                          "start": 326,
                          "end": 327,
                          "name": "y"
                        },
                        "kind": "init",
                        "value": {
                          "type": "AssignmentPattern",
                          "start": 326,
                          "end": 365,
                          "left": {
                            "type": "Identifier",
                            "start": 326,
                            "end": 327,
                            "name": "y"
                          },
                          "right": {
                            "type": "ObjectExpression",
                            "start": 330,
                            "end": 365,
                            "properties": [
                              {
                                "type": "Property",
                                "start": 344,
                                "end": 354,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 344,
                                  "end": 346,
                                  "name": "hh"
                                },
                                "value": {
                                  "type": "AssignmentExpression",
                                  "start": 349,
                                  "end": 354,
                                  "operator": "=",
                                  "left": {
                                    "type": "Identifier",
                                    "start": 349,
                                    "end": 350,
                                    "name": "a"
                                  },
                                  "right": {
                                    "type": "Identifier",
                                    "start": 353,
                                    "end": 354,
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
                        "start": 375,
                        "end": 382,
                        "argument": {
                          "type": "Identifier",
                          "start": 378,
                          "end": 382,
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
              "start": 392,
              "end": 541,
              "elements": [
                {
                  "type": "ObjectExpression",
                  "start": 393,
                  "end": 429,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 403,
                      "end": 408,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 403,
                        "end": 404,
                        "name": "y"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 407,
                        "end": 408,
                        "value": 5,
                        "raw": "5"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 418,
                      "end": 423,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 418,
                        "end": 419,
                        "name": "z"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 422,
                        "end": 423,
                        "value": 8,
                        "raw": "8"
                      },
                      "kind": "init"
                    }
                  ]
                },
                {
                  "type": "ObjectExpression",
                  "start": 431,
                  "end": 467,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 441,
                      "end": 446,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 441,
                        "end": 442,
                        "name": "x"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 445,
                        "end": 446,
                        "value": 2,
                        "raw": "2"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 456,
                      "end": 461,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 456,
                        "end": 457,
                        "name": "y"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 460,
                        "end": 461,
                        "value": 3,
                        "raw": "3"
                      },
                      "kind": "init"
                    }
                  ]
                },
                {
                  "type": "ObjectExpression",
                  "start": 469,
                  "end": 476,
                  "properties": []
                },
                {
                  "type": "ObjectExpression",
                  "start": 478,
                  "end": 517,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 488,
                      "end": 493,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 488,
                        "end": 489,
                        "name": "x"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 492,
                        "end": 493,
                        "value": 5,
                        "raw": "5"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 503,
                      "end": 511,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 503,
                        "end": 504,
                        "name": "h"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 507,
                        "end": 511,
                        "value": "jk",
                        "raw": "'jk'"
                      },
                      "kind": "init"
                    }
                  ]
                },
                {
                  "type": "ObjectExpression",
                  "start": 519,
                  "end": 540,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 529,
                      "end": 534,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 529,
                        "end": 530,
                        "name": "x"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 533,
                        "end": 534,
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
              "start": 544,
              "end": 842,
              "body": [
                {
                  "type": "IfStatement",
                  "start": 554,
                  "end": 669,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 558,
                    "end": 565,
                    "left": {
                      "type": "Identifier",
                      "start": 558,
                      "end": 559,
                      "name": "x"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 564,
                      "end": 565,
                      "value": 2,
                      "raw": "2"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 567,
                    "end": 669,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 581,
                        "end": 601,
                        "expression": {
                          "type": "CallExpression",
                          "start": 581,
                          "end": 601,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 581,
                            "end": 592,
                            "object": {
                              "type": "Identifier",
                              "start": 581,
                              "end": 588,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 589,
                              "end": 592,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 593,
                              "end": 597,
                              "value": "跳过",
                              "raw": "'跳过'"
                            },
                            {
                              "type": "Identifier",
                              "start": 599,
                              "end": 600,
                              "name": "g"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 614,
                        "end": 638,
                        "expression": {
                          "type": "CallExpression",
                          "start": 614,
                          "end": 638,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 614,
                            "end": 625,
                            "object": {
                              "type": "Identifier",
                              "start": 614,
                              "end": 621,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 622,
                              "end": 625,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 626,
                              "end": 627,
                              "name": "g"
                            },
                            {
                              "type": "MemberExpression",
                              "start": 629,
                              "end": 637,
                              "object": {
                                "type": "Identifier",
                                "start": 629,
                                "end": 635,
                                "name": "window"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 636,
                                "end": 637,
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
                        "start": 651,
                        "end": 659,
                        "label": null
                      }
                    ]
                  },
                  "alternate": null
                },
                {
                  "type": "ExpressionStatement",
                  "start": 691,
                  "end": 750,
                  "expression": {
                    "type": "CallExpression",
                    "start": 691,
                    "end": 750,
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
                        "name": "x"
                      },
                      {
                        "type": "Identifier",
                        "start": 706,
                        "end": 707,
                        "name": "y"
                      },
                      {
                        "type": "Identifier",
                        "start": 709,
                        "end": 713,
                        "name": "rest"
                      },
                      {
                        "type": "Identifier",
                        "start": 715,
                        "end": 716,
                        "name": "g"
                      },
                      {
                        "type": "MemberExpression",
                        "start": 718,
                        "end": 726,
                        "object": {
                          "type": "Identifier",
                          "start": 718,
                          "end": 724,
                          "name": "window"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 725,
                          "end": 726,
                          "name": "g"
                        },
                        "computed": false,
                        "optional": false
                      },
                      {
                        "type": "Literal",
                        "start": 728,
                        "end": 738,
                        "value": "window.a",
                        "raw": "'window.a'"
                      },
                      {
                        "type": "MemberExpression",
                        "start": 741,
                        "end": 749,
                        "object": {
                          "type": "Identifier",
                          "start": 741,
                          "end": 747,
                          "name": "window"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 748,
                          "end": 749,
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
                  "start": 759,
                  "end": 823,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 763,
                    "end": 770,
                    "left": {
                      "type": "Identifier",
                      "start": 763,
                      "end": 764,
                      "name": "x"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 769,
                      "end": 770,
                      "value": 5,
                      "raw": "5"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 772,
                    "end": 823,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 786,
                        "end": 795,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 786,
                          "end": 795,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 786,
                            "end": 790,
                            "object": {
                              "type": "Identifier",
                              "start": 786,
                              "end": 787,
                              "name": "g"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 788,
                              "end": 790,
                              "name": "id"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Literal",
                            "start": 793,
                            "end": 795,
                            "value": 55,
                            "raw": "55"
                          }
                        }
                      },
                      {
                        "type": "BreakStatement",
                        "start": 808,
                        "end": 813,
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
            "start": 862,
            "end": 897,
            "expression": {
              "type": "CallExpression",
              "start": 862,
              "end": 897,
              "callee": {
                "type": "MemberExpression",
                "start": 862,
                "end": 873,
                "object": {
                  "type": "Identifier",
                  "start": 862,
                  "end": 869,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 870,
                  "end": 873,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 874,
                  "end": 881,
                  "value": "outer",
                  "raw": "'outer'"
                },
                {
                  "type": "BinaryExpression",
                  "start": 883,
                  "end": 890,
                  "left": {
                    "type": "Identifier",
                    "start": 883,
                    "end": 884,
                    "name": "t"
                  },
                  "operator": "===",
                  "right": {
                    "type": "Identifier",
                    "start": 889,
                    "end": 890,
                    "name": "g"
                  }
                },
                {
                  "type": "Identifier",
                  "start": 892,
                  "end": 893,
                  "name": "t"
                },
                {
                  "type": "Identifier",
                  "start": 895,
                  "end": 896,
                  "name": "g"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 902,
            "end": 911,
            "expression": {
              "type": "AssignmentExpression",
              "start": 902,
              "end": 911,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 902,
                "end": 906,
                "object": {
                  "type": "Identifier",
                  "start": 902,
                  "end": 903,
                  "name": "t"
                },
                "property": {
                  "type": "Identifier",
                  "start": 904,
                  "end": 906,
                  "name": "id"
                },
                "computed": false,
                "optional": false
              },
              "right": {
                "type": "Literal",
                "start": 909,
                "end": 911,
                "value": 99,
                "raw": "99"
              }
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 916,
            "end": 930,
            "expression": {
              "type": "CallExpression",
              "start": 916,
              "end": 930,
              "callee": {
                "type": "MemberExpression",
                "start": 916,
                "end": 927,
                "object": {
                  "type": "Identifier",
                  "start": 916,
                  "end": 923,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 924,
                  "end": 927,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 928,
                  "end": 929,
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
      "start": 958,
      "end": 965,
      "expression": {
        "type": "CallExpression",
        "start": 958,
        "end": 965,
        "callee": {
          "type": "Identifier",
          "start": 958,
          "end": 963,
          "name": "test2"
        },
        "arguments": [],
        "optional": false
      }
    },
    {
      "type": "ExpressionStatement",
      "start": 970,
      "end": 1003,
      "expression": {
        "type": "CallExpression",
        "start": 970,
        "end": 1003,
        "callee": {
          "type": "MemberExpression",
          "start": 970,
          "end": 981,
          "object": {
            "type": "Identifier",
            "start": 970,
            "end": 977,
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "start": 978,
            "end": 981,
            "name": "log"
          },
          "computed": false,
          "optional": false
        },
        "arguments": [
          {
            "type": "Literal",
            "start": 982,
            "end": 992,
            "value": "window.g",
            "raw": "'window.g'"
          },
          {
            "type": "MemberExpression",
            "start": 994,
            "end": 1002,
            "object": {
              "type": "Identifier",
              "start": 994,
              "end": 1000,
              "name": "window"
            },
            "property": {
              "type": "Identifier",
              "start": 1001,
              "end": 1002,
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