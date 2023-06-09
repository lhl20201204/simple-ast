export const _ast1 = {
  "type": "Program",
  "start": 0,
  "end": 763,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 1,
      "end": 752,
      "id": {
        "type": "Identifier",
        "start": 10,
        "end": 14,
        "name": "test"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 17,
        "end": 752,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 25,
            "end": 45,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 31,
                "end": 44,
                "id": {
                  "type": "Identifier",
                  "start": 31,
                  "end": 37,
                  "name": "global"
                },
                "init": {
                  "type": "ThisExpression",
                  "start": 40,
                  "end": 44
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 52,
            "end": 72,
            "expression": {
              "type": "CallExpression",
              "start": 52,
              "end": 71,
              "callee": {
                "type": "MemberExpression",
                "start": 52,
                "end": 63,
                "object": {
                  "type": "Identifier",
                  "start": 52,
                  "end": 59,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 60,
                  "end": 63,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 64,
                  "end": 70,
                  "name": "global"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "FunctionDeclaration",
            "start": 79,
            "end": 125,
            "id": {
              "type": "Identifier",
              "start": 88,
              "end": 89,
              "name": "a"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 92,
              "end": 125,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 102,
                  "end": 117,
                  "expression": {
                    "type": "Literal",
                    "start": 102,
                    "end": 117,
                    "value": "[native code]",
                    "raw": "'[native code]'"
                  },
                  "directive": "[native code]"
                }
              ]
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 132,
            "end": 314,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 136,
                "end": 314,
                "id": {
                  "type": "Identifier",
                  "start": 136,
                  "end": 138,
                  "name": "fn"
                },
                "init": {
                  "type": "FunctionExpression",
                  "start": 141,
                  "end": 314,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [
                    {
                      "type": "Identifier",
                      "start": 151,
                      "end": 152,
                      "name": "a"
                    }
                  ],
                  "body": {
                    "type": "BlockStatement",
                    "start": 154,
                    "end": 314,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 164,
                        "end": 193,
                        "expression": {
                          "type": "CallExpression",
                          "start": 164,
                          "end": 193,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 164,
                            "end": 175,
                            "object": {
                              "type": "Identifier",
                              "start": 164,
                              "end": 171,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 172,
                              "end": 175,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 176,
                              "end": 186,
                              "value": "fn start",
                              "raw": "'fn start'"
                            },
                            {
                              "type": "Identifier",
                              "start": 188,
                              "end": 189,
                              "name": "a"
                            },
                            {
                              "type": "Identifier",
                              "start": 191,
                              "end": 192,
                              "name": "f"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "IfStatement",
                        "start": 202,
                        "end": 305,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 206,
                          "end": 213,
                          "left": {
                            "type": "Identifier",
                            "start": 206,
                            "end": 207,
                            "name": "a"
                          },
                          "operator": "===",
                          "right": {
                            "type": "Identifier",
                            "start": 212,
                            "end": 213,
                            "name": "f"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 215,
                          "end": 255,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 227,
                              "end": 245,
                              "expression": {
                                "type": "CallExpression",
                                "start": 227,
                                "end": 244,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 227,
                                  "end": 238,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 227,
                                    "end": 234,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 235,
                                    "end": 238,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "ThisExpression",
                                    "start": 239,
                                    "end": 243
                                  }
                                ],
                                "optional": false
                              }
                            }
                          ]
                        },
                        "alternate": {
                          "type": "BlockStatement",
                          "start": 261,
                          "end": 305,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 273,
                              "end": 295,
                              "expression": {
                                "type": "CallExpression",
                                "start": 273,
                                "end": 295,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 273,
                                  "end": 284,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 273,
                                    "end": 280,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 281,
                                    "end": 284,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 285,
                                    "end": 291,
                                    "value": "hhhh",
                                    "raw": "'hhhh'"
                                  },
                                  {
                                    "type": "Identifier",
                                    "start": 293,
                                    "end": 294,
                                    "name": "a"
                                  }
                                ],
                                "optional": false
                              }
                            }
                          ]
                        }
                      },
                      {
                        "type": "EmptyStatement",
                        "start": 305,
                        "end": 306
                      }
                    ]
                  }
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "VariableDeclaration",
            "start": 321,
            "end": 369,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 325,
                "end": 368,
                "id": {
                  "type": "Identifier",
                  "start": 325,
                  "end": 326,
                  "name": "f"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 329,
                  "end": 368,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 331,
                      "end": 336,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 331,
                        "end": 333,
                        "name": "id"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 335,
                        "end": 336,
                        "value": 0,
                        "raw": "0"
                      },
                      "kind": "init"
                    },
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
                        "name": "a"
                      },
                      "value": {
                        "type": "UnaryExpression",
                        "start": 341,
                        "end": 343,
                        "operator": "+",
                        "prefix": true,
                        "argument": {
                          "type": "Literal",
                          "start": 342,
                          "end": 343,
                          "value": 1,
                          "raw": "1"
                        }
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 345,
                      "end": 366,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 345,
                        "end": 349,
                        "name": "text"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 351,
                        "end": 366,
                        "value": "global defind",
                        "raw": "'global defind'"
                      },
                      "kind": "init"
                    }
                  ]
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "VariableDeclaration",
            "start": 376,
            "end": 395,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 382,
                "end": 395,
                "id": {
                  "type": "Identifier",
                  "start": 382,
                  "end": 383,
                  "name": "b"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 386,
                  "end": 395,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 388,
                      "end": 389,
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 388,
                        "end": 389,
                        "name": "f"
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "start": 388,
                        "end": 389,
                        "name": "f"
                      }
                    },
                    {
                      "type": "Property",
                      "start": 391,
                      "end": 393,
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 391,
                        "end": 393,
                        "name": "fn"
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "start": 391,
                        "end": 393,
                        "name": "fn"
                      }
                    }
                  ]
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "FunctionDeclaration",
            "start": 402,
            "end": 675,
            "id": {
              "type": "Identifier",
              "start": 411,
              "end": 415,
              "name": "test"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [
              {
                "type": "AssignmentPattern",
                "start": 416,
                "end": 453,
                "left": {
                  "type": "Identifier",
                  "start": 416,
                  "end": 417,
                  "name": "f"
                },
                "right": {
                  "type": "ObjectExpression",
                  "start": 420,
                  "end": 453,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 422,
                      "end": 427,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 422,
                        "end": 424,
                        "name": "id"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 426,
                        "end": 427,
                        "value": 1,
                        "raw": "1"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 429,
                      "end": 451,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 429,
                        "end": 433,
                        "name": "text"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 435,
                        "end": 451,
                        "value": "params defined",
                        "raw": "'params defined'"
                      },
                      "kind": "init"
                    }
                  ]
                }
              }
            ],
            "body": {
              "type": "BlockStatement",
              "start": 455,
              "end": 675,
              "body": [
                {
                  "type": "VariableDeclaration",
                  "start": 465,
                  "end": 477,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 471,
                      "end": 476,
                      "id": {
                        "type": "Identifier",
                        "start": 471,
                        "end": 472,
                        "name": "t"
                      },
                      "init": {
                        "type": "Identifier",
                        "start": 475,
                        "end": 476,
                        "name": "f"
                      }
                    }
                  ],
                  "kind": "const"
                },
                {
                  "type": "ExpressionStatement",
                  "start": 486,
                  "end": 500,
                  "expression": {
                    "type": "CallExpression",
                    "start": 486,
                    "end": 500,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 486,
                      "end": 497,
                      "object": {
                        "type": "Identifier",
                        "start": 486,
                        "end": 493,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 494,
                        "end": 497,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 498,
                        "end": 499,
                        "name": "f"
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 509,
                  "end": 577,
                  "expression": {
                    "type": "AssignmentExpression",
                    "start": 509,
                    "end": 576,
                    "operator": "=",
                    "left": {
                      "type": "MemberExpression",
                      "start": 509,
                      "end": 517,
                      "object": {
                        "type": "Identifier",
                        "start": 509,
                        "end": 510,
                        "name": "f"
                      },
                      "property": {
                        "type": "Literal",
                        "start": 511,
                        "end": 516,
                        "value": "ggg",
                        "raw": "'ggg'"
                      },
                      "computed": true,
                      "optional": false
                    },
                    "right": {
                      "type": "BinaryExpression",
                      "start": 520,
                      "end": 576,
                      "left": {
                        "type": "Literal",
                        "start": 520,
                        "end": 521,
                        "value": 3,
                        "raw": "3"
                      },
                      "operator": "+",
                      "right": {
                        "type": "AssignmentExpression",
                        "start": 525,
                        "end": 575,
                        "operator": "=",
                        "left": {
                          "type": "Identifier",
                          "start": 525,
                          "end": 526,
                          "name": "f"
                        },
                        "right": {
                          "type": "AssignmentExpression",
                          "start": 529,
                          "end": 575,
                          "operator": "=",
                          "left": {
                            "type": "Identifier",
                            "start": 529,
                            "end": 530,
                            "name": "g"
                          },
                          "right": {
                            "type": "ObjectExpression",
                            "start": 533,
                            "end": 575,
                            "properties": [
                              {
                                "type": "Property",
                                "start": 535,
                                "end": 540,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 535,
                                  "end": 537,
                                  "name": "id"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 539,
                                  "end": 540,
                                  "value": 2,
                                  "raw": "2"
                                },
                                "kind": "init"
                              },
                              {
                                "type": "Property",
                                "start": 542,
                                "end": 547,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 542,
                                  "end": 544,
                                  "name": "ff"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 546,
                                  "end": 547,
                                  "value": 1,
                                  "raw": "1"
                                },
                                "kind": "init"
                              },
                              {
                                "type": "Property",
                                "start": 549,
                                "end": 573,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 549,
                                  "end": 553,
                                  "name": "text"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 555,
                                  "end": 573,
                                  "value": "function defined",
                                  "raw": "'function defined'"
                                },
                                "kind": "init"
                              }
                            ]
                          }
                        }
                      }
                    }
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 586,
                  "end": 650,
                  "expression": {
                    "type": "CallExpression",
                    "start": 586,
                    "end": 649,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 586,
                      "end": 597,
                      "object": {
                        "type": "Identifier",
                        "start": 586,
                        "end": 593,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 594,
                        "end": 597,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 598,
                        "end": 605,
                        "value": "inner",
                        "raw": "'inner'"
                      },
                      {
                        "type": "Identifier",
                        "start": 607,
                        "end": 608,
                        "name": "f"
                      },
                      {
                        "type": "Identifier",
                        "start": 610,
                        "end": 611,
                        "name": "b"
                      },
                      {
                        "type": "Identifier",
                        "start": 613,
                        "end": 614,
                        "name": "t"
                      },
                      {
                        "type": "BinaryExpression",
                        "start": 616,
                        "end": 623,
                        "left": {
                          "type": "Identifier",
                          "start": 616,
                          "end": 617,
                          "name": "f"
                        },
                        "operator": "===",
                        "right": {
                          "type": "Identifier",
                          "start": 622,
                          "end": 623,
                          "name": "g"
                        }
                      },
                      {
                        "type": "BinaryExpression",
                        "start": 625,
                        "end": 639,
                        "left": {
                          "type": "Identifier",
                          "start": 625,
                          "end": 626,
                          "name": "f"
                        },
                        "operator": "===",
                        "right": {
                          "type": "MemberExpression",
                          "start": 631,
                          "end": 639,
                          "object": {
                            "type": "Identifier",
                            "start": 631,
                            "end": 637,
                            "name": "global"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 638,
                            "end": 639,
                            "name": "f"
                          },
                          "computed": false,
                          "optional": false
                        }
                      },
                      {
                        "type": "BinaryExpression",
                        "start": 641,
                        "end": 648,
                        "left": {
                          "type": "Identifier",
                          "start": 641,
                          "end": 642,
                          "name": "f"
                        },
                        "operator": "===",
                        "right": {
                          "type": "Identifier",
                          "start": 647,
                          "end": 648,
                          "name": "t"
                        }
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 659,
                  "end": 667,
                  "expression": {
                    "type": "CallExpression",
                    "start": 659,
                    "end": 666,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 659,
                      "end": 663,
                      "object": {
                        "type": "Identifier",
                        "start": 659,
                        "end": 660,
                        "name": "b"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 661,
                        "end": 663,
                        "name": "fn"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 664,
                        "end": 665,
                        "name": "f"
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
            "start": 682,
            "end": 705,
            "expression": {
              "type": "CallExpression",
              "start": 682,
              "end": 705,
              "callee": {
                "type": "MemberExpression",
                "start": 682,
                "end": 693,
                "object": {
                  "type": "Identifier",
                  "start": 682,
                  "end": 689,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 690,
                  "end": 693,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 694,
                  "end": 701,
                  "value": "outer",
                  "raw": "'outer'"
                },
                {
                  "type": "Identifier",
                  "start": 703,
                  "end": 704,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 712,
            "end": 719,
            "expression": {
              "type": "CallExpression",
              "start": 712,
              "end": 718,
              "callee": {
                "type": "Identifier",
                "start": 712,
                "end": 716,
                "name": "test"
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 726,
            "end": 734,
            "expression": {
              "type": "CallExpression",
              "start": 726,
              "end": 733,
              "callee": {
                "type": "MemberExpression",
                "start": 726,
                "end": 730,
                "object": {
                  "type": "Identifier",
                  "start": 726,
                  "end": 727,
                  "name": "b"
                },
                "property": {
                  "type": "Identifier",
                  "start": 728,
                  "end": 730,
                  "name": "fn"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 731,
                  "end": 732,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 741,
            "end": 746,
            "expression": {
              "type": "CallExpression",
              "start": 741,
              "end": 746,
              "callee": {
                "type": "Identifier",
                "start": 741,
                "end": 743,
                "name": "fn"
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 744,
                  "end": 745,
                  "name": "f"
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
      "start": 757,
      "end": 763,
      "expression": {
        "type": "CallExpression",
        "start": 757,
        "end": 763,
        "callee": {
          "type": "Identifier",
          "start": 757,
          "end": 761,
          "name": "test"
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}