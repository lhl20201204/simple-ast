export const _ast7 = {
  "type": "Program",
  "start": 0,
  "end": 806,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 745,
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
        "start": 18,
        "end": 745,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 24,
            "end": 35,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 28,
                "end": 34,
                "id": {
                  "type": "Identifier",
                  "start": 28,
                  "end": 29,
                  "name": "g"
                },
                "init": {
                  "type": "Literal",
                  "start": 32,
                  "end": 34,
                  "value": 34,
                  "raw": "34"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "VariableDeclaration",
            "start": 40,
            "end": 50,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 44,
                "end": 49,
                "id": {
                  "type": "Identifier",
                  "start": 44,
                  "end": 45,
                  "name": "t"
                },
                "init": {
                  "type": "Identifier",
                  "start": 48,
                  "end": 49,
                  "name": "g"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "ForOfStatement",
            "start": 55,
            "end": 655,
            "await": false,
            "left": {
              "type": "VariableDeclaration",
              "start": 61,
              "end": 188,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 67,
                  "end": 188,
                  "id": {
                    "type": "ObjectPattern",
                    "start": 67,
                    "end": 188,
                    "properties": [
                      {
                        "type": "Property",
                        "start": 77,
                        "end": 115,
                        "method": false,
                        "shorthand": true,
                        "computed": false,
                        "key": {
                          "type": "Identifier",
                          "start": 77,
                          "end": 78,
                          "name": "x"
                        },
                        "kind": "init",
                        "value": {
                          "type": "AssignmentPattern",
                          "start": 77,
                          "end": 115,
                          "left": {
                            "type": "Identifier",
                            "start": 77,
                            "end": 78,
                            "name": "x"
                          },
                          "right": {
                            "type": "AssignmentExpression",
                            "start": 81,
                            "end": 115,
                            "operator": "=",
                            "left": {
                              "type": "Identifier",
                              "start": 81,
                              "end": 82,
                              "name": "g"
                            },
                            "right": {
                              "type": "ObjectExpression",
                              "start": 85,
                              "end": 115,
                              "properties": [
                                {
                                  "type": "Property",
                                  "start": 99,
                                  "end": 105,
                                  "method": false,
                                  "shorthand": false,
                                  "computed": false,
                                  "key": {
                                    "type": "Identifier",
                                    "start": 99,
                                    "end": 101,
                                    "name": "id"
                                  },
                                  "value": {
                                    "type": "Literal",
                                    "start": 104,
                                    "end": 105,
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
                        "start": 125,
                        "end": 165,
                        "method": false,
                        "shorthand": true,
                        "computed": false,
                        "key": {
                          "type": "Identifier",
                          "start": 125,
                          "end": 126,
                          "name": "y"
                        },
                        "kind": "init",
                        "value": {
                          "type": "AssignmentPattern",
                          "start": 125,
                          "end": 165,
                          "left": {
                            "type": "Identifier",
                            "start": 125,
                            "end": 126,
                            "name": "y"
                          },
                          "right": {
                            "type": "ObjectExpression",
                            "start": 129,
                            "end": 165,
                            "properties": [
                              {
                                "type": "Property",
                                "start": 143,
                                "end": 155,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 143,
                                  "end": 145,
                                  "name": "hh"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 148,
                                  "end": 155,
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
                        "start": 175,
                        "end": 182,
                        "argument": {
                          "type": "Identifier",
                          "start": 178,
                          "end": 182,
                          "name": "rest"
                        }
                      }
                    ]
                  },
                  "init": null
                }
              ],
              "kind": "const"
            },
            "right": {
              "type": "ArrayExpression",
              "start": 192,
              "end": 350,
              "elements": [
                {
                  "type": "ObjectExpression",
                  "start": 193,
                  "end": 229,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 203,
                      "end": 208,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 203,
                        "end": 204,
                        "name": "y"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 207,
                        "end": 208,
                        "value": 5,
                        "raw": "5"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 218,
                      "end": 223,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 218,
                        "end": 219,
                        "name": "z"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 222,
                        "end": 223,
                        "value": 8,
                        "raw": "8"
                      },
                      "kind": "init"
                    }
                  ]
                },
                {
                  "type": "ObjectExpression",
                  "start": 231,
                  "end": 267,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 241,
                      "end": 246,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 241,
                        "end": 242,
                        "name": "x"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 245,
                        "end": 246,
                        "value": 2,
                        "raw": "2"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 256,
                      "end": 261,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 256,
                        "end": 257,
                        "name": "y"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 260,
                        "end": 261,
                        "value": 3,
                        "raw": "3"
                      },
                      "kind": "init"
                    }
                  ]
                },
                {
                  "type": "ObjectExpression",
                  "start": 269,
                  "end": 285,
                  "properties": []
                },
                {
                  "type": "ObjectExpression",
                  "start": 287,
                  "end": 326,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 297,
                      "end": 302,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 297,
                        "end": 298,
                        "name": "x"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 301,
                        "end": 302,
                        "value": 5,
                        "raw": "5"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 312,
                      "end": 320,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 312,
                        "end": 313,
                        "name": "h"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 316,
                        "end": 320,
                        "value": "jk",
                        "raw": "'jk'"
                      },
                      "kind": "init"
                    }
                  ]
                },
                {
                  "type": "ObjectExpression",
                  "start": 328,
                  "end": 349,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 338,
                      "end": 343,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 338,
                        "end": 339,
                        "name": "x"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 342,
                        "end": 343,
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
              "start": 353,
              "end": 655,
              "body": [
                {
                  "type": "IfStatement",
                  "start": 363,
                  "end": 478,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 367,
                    "end": 374,
                    "left": {
                      "type": "Identifier",
                      "start": 367,
                      "end": 368,
                      "name": "x"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 373,
                      "end": 374,
                      "value": 2,
                      "raw": "2"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 376,
                    "end": 478,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 390,
                        "end": 410,
                        "expression": {
                          "type": "CallExpression",
                          "start": 390,
                          "end": 410,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 390,
                            "end": 401,
                            "object": {
                              "type": "Identifier",
                              "start": 390,
                              "end": 397,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 398,
                              "end": 401,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 402,
                              "end": 406,
                              "value": "跳过",
                              "raw": "'跳过'"
                            },
                            {
                              "type": "Identifier",
                              "start": 408,
                              "end": 409,
                              "name": "g"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 423,
                        "end": 447,
                        "expression": {
                          "type": "CallExpression",
                          "start": 423,
                          "end": 447,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 423,
                            "end": 434,
                            "object": {
                              "type": "Identifier",
                              "start": 423,
                              "end": 430,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 431,
                              "end": 434,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 435,
                              "end": 436,
                              "name": "g"
                            },
                            {
                              "type": "MemberExpression",
                              "start": 438,
                              "end": 446,
                              "object": {
                                "type": "Identifier",
                                "start": 438,
                                "end": 444,
                                "name": "window"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 445,
                                "end": 446,
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
                        "start": 460,
                        "end": 468,
                        "label": null
                      }
                    ]
                  },
                  "alternate": null
                },
                {
                  "type": "ExpressionStatement",
                  "start": 500,
                  "end": 536,
                  "expression": {
                    "type": "CallExpression",
                    "start": 500,
                    "end": 536,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 500,
                      "end": 511,
                      "object": {
                        "type": "Identifier",
                        "start": 500,
                        "end": 507,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 508,
                        "end": 511,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 512,
                        "end": 513,
                        "name": "x"
                      },
                      {
                        "type": "Identifier",
                        "start": 515,
                        "end": 516,
                        "name": "y"
                      },
                      {
                        "type": "Identifier",
                        "start": 518,
                        "end": 522,
                        "name": "rest"
                      },
                      {
                        "type": "Identifier",
                        "start": 524,
                        "end": 525,
                        "name": "g"
                      },
                      {
                        "type": "MemberExpression",
                        "start": 527,
                        "end": 535,
                        "object": {
                          "type": "Identifier",
                          "start": 527,
                          "end": 533,
                          "name": "window"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 534,
                          "end": 535,
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
                  "start": 545,
                  "end": 636,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 549,
                    "end": 556,
                    "left": {
                      "type": "Identifier",
                      "start": 549,
                      "end": 550,
                      "name": "x"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 555,
                      "end": 556,
                      "value": 5,
                      "raw": "5"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 558,
                    "end": 636,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 571,
                        "end": 586,
                        "expression": {
                          "type": "CallExpression",
                          "start": 571,
                          "end": 585,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 571,
                            "end": 582,
                            "object": {
                              "type": "Identifier",
                              "start": 571,
                              "end": 578,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 579,
                              "end": 582,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 583,
                              "end": 584,
                              "name": "g"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 599,
                        "end": 608,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 599,
                          "end": 608,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 599,
                            "end": 603,
                            "object": {
                              "type": "Identifier",
                              "start": 599,
                              "end": 600,
                              "name": "g"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 601,
                              "end": 603,
                              "name": "id"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "right": {
                            "type": "Literal",
                            "start": 606,
                            "end": 608,
                            "value": 55,
                            "raw": "55"
                          }
                        }
                      },
                      {
                        "type": "BreakStatement",
                        "start": 621,
                        "end": 626,
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
            "start": 675,
            "end": 704,
            "expression": {
              "type": "CallExpression",
              "start": 675,
              "end": 704,
              "callee": {
                "type": "MemberExpression",
                "start": 675,
                "end": 686,
                "object": {
                  "type": "Identifier",
                  "start": 675,
                  "end": 682,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 683,
                  "end": 686,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 687,
                  "end": 694,
                  "value": "outer",
                  "raw": "'outer'"
                },
                {
                  "type": "BinaryExpression",
                  "start": 696,
                  "end": 703,
                  "left": {
                    "type": "Identifier",
                    "start": 696,
                    "end": 697,
                    "name": "t"
                  },
                  "operator": "===",
                  "right": {
                    "type": "Identifier",
                    "start": 702,
                    "end": 703,
                    "name": "g"
                  }
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 709,
            "end": 718,
            "expression": {
              "type": "AssignmentExpression",
              "start": 709,
              "end": 718,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 709,
                "end": 713,
                "object": {
                  "type": "Identifier",
                  "start": 709,
                  "end": 710,
                  "name": "t"
                },
                "property": {
                  "type": "Identifier",
                  "start": 711,
                  "end": 713,
                  "name": "id"
                },
                "computed": false,
                "optional": false
              },
              "right": {
                "type": "Literal",
                "start": 716,
                "end": 718,
                "value": 99,
                "raw": "99"
              }
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 723,
            "end": 743,
            "expression": {
              "type": "CallExpression",
              "start": 723,
              "end": 743,
              "callee": {
                "type": "MemberExpression",
                "start": 723,
                "end": 734,
                "object": {
                  "type": "Identifier",
                  "start": 723,
                  "end": 730,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 731,
                  "end": 734,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 735,
                  "end": 736,
                  "name": "t"
                },
                {
                  "type": "MemberExpression",
                  "start": 738,
                  "end": 742,
                  "object": {
                    "type": "Identifier",
                    "start": 738,
                    "end": 739,
                    "name": "t"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 740,
                    "end": 742,
                    "name": "id"
                  },
                  "computed": false,
                  "optional": false
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
      "start": 765,
      "end": 772,
      "expression": {
        "type": "CallExpression",
        "start": 765,
        "end": 772,
        "callee": {
          "type": "Identifier",
          "start": 765,
          "end": 770,
          "name": "test2"
        },
        "arguments": [],
        "optional": false
      }
    },
    {
      "type": "ExpressionStatement",
      "start": 773,
      "end": 806,
      "expression": {
        "type": "CallExpression",
        "start": 773,
        "end": 806,
        "callee": {
          "type": "MemberExpression",
          "start": 773,
          "end": 784,
          "object": {
            "type": "Identifier",
            "start": 773,
            "end": 780,
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "start": 781,
            "end": 784,
            "name": "log"
          },
          "computed": false,
          "optional": false
        },
        "arguments": [
          {
            "type": "Literal",
            "start": 785,
            "end": 795,
            "value": "window.g",
            "raw": "'window.g'"
          },
          {
            "type": "MemberExpression",
            "start": 797,
            "end": 805,
            "object": {
              "type": "Identifier",
              "start": 797,
              "end": 803,
              "name": "window"
            },
            "property": {
              "type": "Identifier",
              "start": 804,
              "end": 805,
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