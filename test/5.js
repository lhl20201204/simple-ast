export const _ast4 = {
  "type": "Program",
  "start": 0,
  "end": 1350,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 187,
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
        "start": 16,
        "end": 187,
        "body": [
          {
            "type": "FunctionDeclaration",
            "start": 20,
            "end": 159,
            "id": {
              "type": "Identifier",
              "start": 29,
              "end": 30,
              "name": "a"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [
              {
                "type": "Identifier",
                "start": 31,
                "end": 32,
                "name": "x"
              }
            ],
            "body": {
              "type": "BlockStatement",
              "start": 34,
              "end": 159,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 40,
                  "end": 63,
                  "expression": {
                    "type": "CallExpression",
                    "start": 40,
                    "end": 62,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 40,
                      "end": 51,
                      "object": {
                        "type": "Identifier",
                        "start": 40,
                        "end": 47,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 48,
                        "end": 51,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "TemplateLiteral",
                        "start": 52,
                        "end": 61,
                        "expressions": [
                          {
                            "type": "Identifier",
                            "start": 58,
                            "end": 59,
                            "name": "x"
                          }
                        ],
                        "quasis": [
                          {
                            "type": "TemplateElement",
                            "start": 53,
                            "end": 56,
                            "value": {
                              "raw": "当前是",
                              "cooked": "当前是"
                            },
                            "tail": false
                          },
                          {
                            "type": "TemplateElement",
                            "start": 60,
                            "end": 60,
                            "value": {
                              "raw": "",
                              "cooked": ""
                            },
                            "tail": true
                          }
                        ]
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "IfStatement",
                  "start": 68,
                  "end": 111,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 72,
                    "end": 78,
                    "left": {
                      "type": "Identifier",
                      "start": 72,
                      "end": 73,
                      "name": "x"
                    },
                    "operator": "<",
                    "right": {
                      "type": "Literal",
                      "start": 76,
                      "end": 78,
                      "value": 10,
                      "raw": "10"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 80,
                    "end": 111,
                    "body": [
                      {
                        "type": "ReturnStatement",
                        "start": 88,
                        "end": 105,
                        "argument": {
                          "type": "BinaryExpression",
                          "start": 95,
                          "end": 105,
                          "left": {
                            "type": "Identifier",
                            "start": 95,
                            "end": 96,
                            "name": "x"
                          },
                          "operator": "+",
                          "right": {
                            "type": "CallExpression",
                            "start": 99,
                            "end": 105,
                            "callee": {
                              "type": "Identifier",
                              "start": 99,
                              "end": 100,
                              "name": "a"
                            },
                            "arguments": [
                              {
                                "type": "BinaryExpression",
                                "start": 101,
                                "end": 104,
                                "left": {
                                  "type": "Identifier",
                                  "start": 101,
                                  "end": 102,
                                  "name": "x"
                                },
                                "operator": "+",
                                "right": {
                                  "type": "Literal",
                                  "start": 103,
                                  "end": 104,
                                  "value": 1,
                                  "raw": "1"
                                }
                              }
                            ],
                            "optional": false
                          }
                        }
                      }
                    ]
                  },
                  "alternate": null
                },
                {
                  "type": "ExpressionStatement",
                  "start": 116,
                  "end": 141,
                  "expression": {
                    "type": "CallExpression",
                    "start": 116,
                    "end": 140,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 116,
                      "end": 127,
                      "object": {
                        "type": "Identifier",
                        "start": 116,
                        "end": 123,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 124,
                        "end": 127,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 128,
                        "end": 136,
                        "value": "return",
                        "raw": "'return'"
                      },
                      {
                        "type": "Identifier",
                        "start": 138,
                        "end": 139,
                        "name": "x"
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ReturnStatement",
                  "start": 146,
                  "end": 155,
                  "argument": {
                    "type": "Identifier",
                    "start": 153,
                    "end": 154,
                    "name": "x"
                  }
                }
              ]
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 165,
            "end": 183,
            "expression": {
              "type": "CallExpression",
              "start": 165,
              "end": 182,
              "callee": {
                "type": "MemberExpression",
                "start": 165,
                "end": 176,
                "object": {
                  "type": "Identifier",
                  "start": 165,
                  "end": 172,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 173,
                  "end": 176,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "CallExpression",
                  "start": 177,
                  "end": 181,
                  "callee": {
                    "type": "Identifier",
                    "start": 177,
                    "end": 178,
                    "name": "a"
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "start": 179,
                      "end": 180,
                      "value": 0,
                      "raw": "0"
                    }
                  ],
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
      "type": "FunctionDeclaration",
      "start": 193,
      "end": 1338,
      "id": {
        "type": "Identifier",
        "start": 202,
        "end": 207,
        "name": "test1"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 210,
        "end": 1338,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 218,
            "end": 238,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 224,
                "end": 237,
                "id": {
                  "type": "Identifier",
                  "start": 224,
                  "end": 230,
                  "name": "global"
                },
                "init": {
                  "type": "ThisExpression",
                  "start": 233,
                  "end": 237
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 245,
            "end": 265,
            "expression": {
              "type": "CallExpression",
              "start": 245,
              "end": 264,
              "callee": {
                "type": "MemberExpression",
                "start": 245,
                "end": 256,
                "object": {
                  "type": "Identifier",
                  "start": 245,
                  "end": 252,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 253,
                  "end": 256,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 257,
                  "end": 263,
                  "name": "global"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "FunctionDeclaration",
            "start": 272,
            "end": 294,
            "id": {
              "type": "Identifier",
              "start": 281,
              "end": 282,
              "name": "a"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 285,
              "end": 294,
              "body": []
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 301,
            "end": 489,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 305,
                "end": 489,
                "id": {
                  "type": "Identifier",
                  "start": 305,
                  "end": 307,
                  "name": "fn"
                },
                "init": {
                  "type": "FunctionExpression",
                  "start": 310,
                  "end": 489,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [
                    {
                      "type": "Identifier",
                      "start": 320,
                      "end": 321,
                      "name": "a"
                    }
                  ],
                  "body": {
                    "type": "BlockStatement",
                    "start": 323,
                    "end": 489,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 333,
                        "end": 362,
                        "expression": {
                          "type": "CallExpression",
                          "start": 333,
                          "end": 362,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 333,
                            "end": 344,
                            "object": {
                              "type": "Identifier",
                              "start": 333,
                              "end": 340,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 341,
                              "end": 344,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 345,
                              "end": 355,
                              "value": "fn start",
                              "raw": "'fn start'"
                            },
                            {
                              "type": "Identifier",
                              "start": 357,
                              "end": 358,
                              "name": "a"
                            },
                            {
                              "type": "Identifier",
                              "start": 360,
                              "end": 361,
                              "name": "f"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "IfStatement",
                        "start": 371,
                        "end": 481,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 375,
                          "end": 382,
                          "left": {
                            "type": "Identifier",
                            "start": 375,
                            "end": 376,
                            "name": "a"
                          },
                          "operator": "===",
                          "right": {
                            "type": "Identifier",
                            "start": 381,
                            "end": 382,
                            "name": "f"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 384,
                          "end": 424,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 396,
                              "end": 414,
                              "expression": {
                                "type": "CallExpression",
                                "start": 396,
                                "end": 413,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 396,
                                  "end": 407,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 396,
                                    "end": 403,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 404,
                                    "end": 407,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "ThisExpression",
                                    "start": 408,
                                    "end": 412
                                  }
                                ],
                                "optional": false
                              }
                            }
                          ]
                        },
                        "alternate": {
                          "type": "BlockStatement",
                          "start": 430,
                          "end": 481,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 442,
                              "end": 471,
                              "expression": {
                                "type": "CallExpression",
                                "start": 442,
                                "end": 471,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 442,
                                  "end": 460,
                                  "object": {
                                    "type": "MemberExpression",
                                    "start": 442,
                                    "end": 456,
                                    "object": {
                                      "type": "Identifier",
                                      "start": 442,
                                      "end": 448,
                                      "name": "window"
                                    },
                                    "property": {
                                      "type": "Identifier",
                                      "start": 449,
                                      "end": 456,
                                      "name": "console"
                                    },
                                    "computed": false,
                                    "optional": false
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 457,
                                    "end": 460,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 461,
                                    "end": 467,
                                    "value": "hhhh",
                                    "raw": "'hhhh'"
                                  },
                                  {
                                    "type": "Identifier",
                                    "start": 469,
                                    "end": 470,
                                    "name": "a"
                                  }
                                ],
                                "optional": false
                              }
                            }
                          ]
                        }
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
            "start": 496,
            "end": 544,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 500,
                "end": 543,
                "id": {
                  "type": "Identifier",
                  "start": 500,
                  "end": 501,
                  "name": "f"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 504,
                  "end": 543,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 506,
                      "end": 511,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 506,
                        "end": 508,
                        "name": "id"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 510,
                        "end": 511,
                        "value": 0,
                        "raw": "0"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 513,
                      "end": 518,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 513,
                        "end": 514,
                        "name": "a"
                      },
                      "value": {
                        "type": "UnaryExpression",
                        "start": 516,
                        "end": 518,
                        "operator": "+",
                        "prefix": true,
                        "argument": {
                          "type": "Literal",
                          "start": 517,
                          "end": 518,
                          "value": 1,
                          "raw": "1"
                        }
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 520,
                      "end": 541,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 520,
                        "end": 524,
                        "name": "text"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 526,
                        "end": 541,
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
            "start": 551,
            "end": 586,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 557,
                "end": 586,
                "id": {
                  "type": "Identifier",
                  "start": 557,
                  "end": 558,
                  "name": "b"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 561,
                  "end": 586,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 563,
                      "end": 564,
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 563,
                        "end": 564,
                        "name": "f"
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "start": 563,
                        "end": 564,
                        "name": "f"
                      }
                    },
                    {
                      "type": "Property",
                      "start": 566,
                      "end": 568,
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 566,
                        "end": 568,
                        "name": "fn"
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "start": 566,
                        "end": 568,
                        "name": "fn"
                      }
                    },
                    {
                      "type": "Property",
                      "start": 570,
                      "end": 584,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 570,
                        "end": 571,
                        "name": "c"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 573,
                        "end": 584,
                        "value": "fdljfosdj",
                        "raw": "'fdljfosdj'"
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
            "type": "VariableDeclaration",
            "start": 593,
            "end": 605,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 597,
                "end": 605,
                "id": {
                  "type": "Identifier",
                  "start": 597,
                  "end": 598,
                  "name": "x"
                },
                "init": {
                  "type": "Literal",
                  "start": 601,
                  "end": 605,
                  "value": null,
                  "raw": "null"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "FunctionDeclaration",
            "start": 612,
            "end": 1224,
            "id": {
              "type": "Identifier",
              "start": 621,
              "end": 625,
              "name": "test"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 628,
              "end": 1224,
              "body": [
                {
                  "type": "VariableDeclaration",
                  "start": 664,
                  "end": 707,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 668,
                      "end": 706,
                      "id": {
                        "type": "Identifier",
                        "start": 668,
                        "end": 669,
                        "name": "f"
                      },
                      "init": {
                        "type": "ObjectExpression",
                        "start": 672,
                        "end": 706,
                        "properties": [
                          {
                            "type": "Property",
                            "start": 673,
                            "end": 678,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 673,
                              "end": 675,
                              "name": "id"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 677,
                              "end": 678,
                              "value": 1,
                              "raw": "1"
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 680,
                            "end": 705,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 680,
                              "end": 684,
                              "name": "text"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 686,
                              "end": 705,
                              "value": "funciton_1 defind",
                              "raw": "'funciton_1 defind'"
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
                  "type": "FunctionDeclaration",
                  "start": 717,
                  "end": 1054,
                  "id": {
                    "type": "Identifier",
                    "start": 726,
                    "end": 730,
                    "name": "test"
                  },
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "start": 733,
                    "end": 1054,
                    "body": [
                      {
                        "type": "VariableDeclaration",
                        "start": 745,
                        "end": 757,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 751,
                            "end": 756,
                            "id": {
                              "type": "Identifier",
                              "start": 751,
                              "end": 752,
                              "name": "t"
                            },
                            "init": {
                              "type": "Identifier",
                              "start": 755,
                              "end": 756,
                              "name": "f"
                            }
                          }
                        ],
                        "kind": "const"
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 768,
                        "end": 782,
                        "expression": {
                          "type": "CallExpression",
                          "start": 768,
                          "end": 782,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 768,
                            "end": 779,
                            "object": {
                              "type": "Identifier",
                              "start": 768,
                              "end": 775,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 776,
                              "end": 779,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 780,
                              "end": 781,
                              "name": "f"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 814,
                        "end": 884,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 814,
                          "end": 883,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 814,
                            "end": 822,
                            "object": {
                              "type": "Identifier",
                              "start": 814,
                              "end": 815,
                              "name": "f"
                            },
                            "property": {
                              "type": "Literal",
                              "start": 816,
                              "end": 821,
                              "value": "ggg",
                              "raw": "'ggg'"
                            },
                            "computed": true,
                            "optional": false
                          },
                          "right": {
                            "type": "BinaryExpression",
                            "start": 825,
                            "end": 883,
                            "left": {
                              "type": "Literal",
                              "start": 825,
                              "end": 826,
                              "value": 3,
                              "raw": "3"
                            },
                            "operator": "+",
                            "right": {
                              "type": "AssignmentExpression",
                              "start": 830,
                              "end": 882,
                              "operator": "=",
                              "left": {
                                "type": "Identifier",
                                "start": 830,
                                "end": 831,
                                "name": "f"
                              },
                              "right": {
                                "type": "AssignmentExpression",
                                "start": 834,
                                "end": 882,
                                "operator": "=",
                                "left": {
                                  "type": "Identifier",
                                  "start": 834,
                                  "end": 835,
                                  "name": "g"
                                },
                                "right": {
                                  "type": "ObjectExpression",
                                  "start": 838,
                                  "end": 882,
                                  "properties": [
                                    {
                                      "type": "Property",
                                      "start": 840,
                                      "end": 845,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 840,
                                        "end": 842,
                                        "name": "id"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 844,
                                        "end": 845,
                                        "value": 2,
                                        "raw": "2"
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 847,
                                      "end": 852,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 847,
                                        "end": 849,
                                        "name": "ff"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 851,
                                        "end": 852,
                                        "value": 1,
                                        "raw": "1"
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 854,
                                      "end": 880,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 854,
                                        "end": 858,
                                        "name": "text"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 860,
                                        "end": 880,
                                        "value": "function_2 defined",
                                        "raw": "'function_2 defined'"
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
                        "start": 895,
                        "end": 959,
                        "expression": {
                          "type": "CallExpression",
                          "start": 895,
                          "end": 958,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 895,
                            "end": 906,
                            "object": {
                              "type": "Identifier",
                              "start": 895,
                              "end": 902,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 903,
                              "end": 906,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 907,
                              "end": 914,
                              "value": "inner",
                              "raw": "'inner'"
                            },
                            {
                              "type": "Identifier",
                              "start": 916,
                              "end": 917,
                              "name": "f"
                            },
                            {
                              "type": "Identifier",
                              "start": 919,
                              "end": 920,
                              "name": "b"
                            },
                            {
                              "type": "Identifier",
                              "start": 922,
                              "end": 923,
                              "name": "t"
                            },
                            {
                              "type": "BinaryExpression",
                              "start": 925,
                              "end": 932,
                              "left": {
                                "type": "Identifier",
                                "start": 925,
                                "end": 926,
                                "name": "f"
                              },
                              "operator": "===",
                              "right": {
                                "type": "Identifier",
                                "start": 931,
                                "end": 932,
                                "name": "g"
                              }
                            },
                            {
                              "type": "BinaryExpression",
                              "start": 934,
                              "end": 948,
                              "left": {
                                "type": "Identifier",
                                "start": 934,
                                "end": 935,
                                "name": "f"
                              },
                              "operator": "===",
                              "right": {
                                "type": "MemberExpression",
                                "start": 940,
                                "end": 948,
                                "object": {
                                  "type": "Identifier",
                                  "start": 940,
                                  "end": 946,
                                  "name": "global"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 947,
                                  "end": 948,
                                  "name": "f"
                                },
                                "computed": false,
                                "optional": false
                              }
                            },
                            {
                              "type": "BinaryExpression",
                              "start": 950,
                              "end": 957,
                              "left": {
                                "type": "Identifier",
                                "start": 950,
                                "end": 951,
                                "name": "f"
                              },
                              "operator": "===",
                              "right": {
                                "type": "Identifier",
                                "start": 956,
                                "end": 957,
                                "name": "t"
                              }
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 970,
                        "end": 976,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 970,
                          "end": 975,
                          "operator": "=",
                          "left": {
                            "type": "Identifier",
                            "start": 970,
                            "end": 971,
                            "name": "x"
                          },
                          "right": {
                            "type": "Identifier",
                            "start": 974,
                            "end": 975,
                            "name": "f"
                          }
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 987,
                        "end": 1006,
                        "expression": {
                          "type": "CallExpression",
                          "start": 987,
                          "end": 1006,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 987,
                            "end": 998,
                            "object": {
                              "type": "Identifier",
                              "start": 987,
                              "end": 994,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 995,
                              "end": 998,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 999,
                              "end": 1002,
                              "value": "x",
                              "raw": "'x'"
                            },
                            {
                              "type": "Identifier",
                              "start": 1004,
                              "end": 1005,
                              "name": "x"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "VariableDeclaration",
                        "start": 1017,
                        "end": 1027,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 1021,
                            "end": 1026,
                            "id": {
                              "type": "Identifier",
                              "start": 1021,
                              "end": 1022,
                              "name": "c"
                            },
                            "init": {
                              "type": "Literal",
                              "start": 1025,
                              "end": 1026,
                              "value": 2,
                              "raw": "2"
                            }
                          }
                        ],
                        "kind": "let"
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 1036,
                        "end": 1044,
                        "expression": {
                          "type": "CallExpression",
                          "start": 1036,
                          "end": 1043,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 1036,
                            "end": 1040,
                            "object": {
                              "type": "Identifier",
                              "start": 1036,
                              "end": 1037,
                              "name": "b"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 1038,
                              "end": 1040,
                              "name": "fn"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 1041,
                              "end": 1042,
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
                  "start": 1063,
                  "end": 1069,
                  "expression": {
                    "type": "CallExpression",
                    "start": 1063,
                    "end": 1069,
                    "callee": {
                      "type": "Identifier",
                      "start": 1063,
                      "end": 1067,
                      "name": "test"
                    },
                    "arguments": [],
                    "optional": false
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 1078,
                  "end": 1106,
                  "expression": {
                    "type": "CallExpression",
                    "start": 1078,
                    "end": 1106,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 1078,
                      "end": 1089,
                      "object": {
                        "type": "Identifier",
                        "start": 1078,
                        "end": 1085,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 1086,
                        "end": 1089,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 1090,
                        "end": 1105,
                        "value": "test 结束------",
                        "raw": "'test 结束------'"
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 1154,
                  "end": 1199,
                  "expression": {
                    "type": "CallExpression",
                    "start": 1154,
                    "end": 1199,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 1154,
                      "end": 1165,
                      "object": {
                        "type": "Identifier",
                        "start": 1154,
                        "end": 1161,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 1162,
                        "end": 1165,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 1166,
                        "end": 1167,
                        "name": "f"
                      },
                      {
                        "type": "BinaryExpression",
                        "start": 1169,
                        "end": 1176,
                        "left": {
                          "type": "Identifier",
                          "start": 1169,
                          "end": 1170,
                          "name": "f"
                        },
                        "operator": "===",
                        "right": {
                          "type": "Identifier",
                          "start": 1175,
                          "end": 1176,
                          "name": "x"
                        }
                      },
                      {
                        "type": "MemberExpression",
                        "start": 1178,
                        "end": 1186,
                        "object": {
                          "type": "Identifier",
                          "start": 1178,
                          "end": 1184,
                          "name": "window"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 1185,
                          "end": 1186,
                          "name": "g"
                        },
                        "computed": false,
                        "optional": false
                      },
                      {
                        "type": "Literal",
                        "start": 1188,
                        "end": 1198,
                        "value": "test end",
                        "raw": "'test end'"
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 1208,
                  "end": 1216,
                  "expression": {
                    "type": "CallExpression",
                    "start": 1208,
                    "end": 1215,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 1208,
                      "end": 1212,
                      "object": {
                        "type": "Identifier",
                        "start": 1208,
                        "end": 1209,
                        "name": "b"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 1210,
                        "end": 1212,
                        "name": "fn"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 1213,
                        "end": 1214,
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
            "start": 1231,
            "end": 1254,
            "expression": {
              "type": "CallExpression",
              "start": 1231,
              "end": 1254,
              "callee": {
                "type": "MemberExpression",
                "start": 1231,
                "end": 1242,
                "object": {
                  "type": "Identifier",
                  "start": 1231,
                  "end": 1238,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 1239,
                  "end": 1242,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 1243,
                  "end": 1250,
                  "value": "outer",
                  "raw": "'outer'"
                },
                {
                  "type": "Identifier",
                  "start": 1252,
                  "end": 1253,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1261,
            "end": 1268,
            "expression": {
              "type": "CallExpression",
              "start": 1261,
              "end": 1267,
              "callee": {
                "type": "Identifier",
                "start": 1261,
                "end": 1265,
                "name": "test"
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1275,
            "end": 1304,
            "expression": {
              "type": "CallExpression",
              "start": 1275,
              "end": 1304,
              "callee": {
                "type": "MemberExpression",
                "start": 1275,
                "end": 1286,
                "object": {
                  "type": "Identifier",
                  "start": 1275,
                  "end": 1282,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 1283,
                  "end": 1286,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 1287,
                  "end": 1300,
                  "value": "outer after",
                  "raw": "'outer after'"
                },
                {
                  "type": "Identifier",
                  "start": 1302,
                  "end": 1303,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1311,
            "end": 1319,
            "expression": {
              "type": "CallExpression",
              "start": 1311,
              "end": 1318,
              "callee": {
                "type": "MemberExpression",
                "start": 1311,
                "end": 1315,
                "object": {
                  "type": "Identifier",
                  "start": 1311,
                  "end": 1312,
                  "name": "b"
                },
                "property": {
                  "type": "Identifier",
                  "start": 1313,
                  "end": 1315,
                  "name": "fn"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 1316,
                  "end": 1317,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1326,
            "end": 1332,
            "expression": {
              "type": "CallExpression",
              "start": 1326,
              "end": 1331,
              "callee": {
                "type": "Identifier",
                "start": 1326,
                "end": 1328,
                "name": "fn"
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 1329,
                  "end": 1330,
                  "name": "x"
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
      "start": 1343,
      "end": 1350,
      "expression": {
        "type": "CallExpression",
        "start": 1343,
        "end": 1350,
        "callee": {
          "type": "Identifier",
          "start": 1343,
          "end": 1348,
          "name": "test1"
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}