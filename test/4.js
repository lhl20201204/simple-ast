export const _ast4 = {
  "type": "Program",
  "start": 0,
  "end": 1212,
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
      "end": 1200,
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
        "end": 1200,
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
            "end": 1086,
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
              "end": 1086,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 638,
                  "end": 652,
                  "expression": {
                    "type": "CallExpression",
                    "start": 638,
                    "end": 652,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 638,
                      "end": 649,
                      "object": {
                        "type": "Identifier",
                        "start": 638,
                        "end": 645,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 646,
                        "end": 649,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 650,
                        "end": 651,
                        "name": "f"
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "VariableDeclaration",
                  "start": 661,
                  "end": 704,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 665,
                      "end": 703,
                      "id": {
                        "type": "Identifier",
                        "start": 665,
                        "end": 666,
                        "name": "f"
                      },
                      "init": {
                        "type": "ObjectExpression",
                        "start": 669,
                        "end": 703,
                        "properties": [
                          {
                            "type": "Property",
                            "start": 670,
                            "end": 675,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 670,
                              "end": 672,
                              "name": "id"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 674,
                              "end": 675,
                              "value": 1,
                              "raw": "1"
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 677,
                            "end": 702,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 677,
                              "end": 681,
                              "name": "text"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 683,
                              "end": 702,
                              "value": "funciton_1 defind",
                              "raw": "'funciton_1 defind'"
                            },
                            "kind": "init"
                          }
                        ]
                      }
                    }
                  ],
                  "kind": "var"
                },
                {
                  "type": "FunctionDeclaration",
                  "start": 714,
                  "end": 1002,
                  "id": {
                    "type": "Identifier",
                    "start": 723,
                    "end": 727,
                    "name": "test"
                  },
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "start": 730,
                    "end": 1002,
                    "body": [
                      {
                        "type": "VariableDeclaration",
                        "start": 742,
                        "end": 754,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 748,
                            "end": 753,
                            "id": {
                              "type": "Identifier",
                              "start": 748,
                              "end": 749,
                              "name": "t"
                            },
                            "init": {
                              "type": "Identifier",
                              "start": 752,
                              "end": 753,
                              "name": "f"
                            }
                          }
                        ],
                        "kind": "const"
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 765,
                        "end": 779,
                        "expression": {
                          "type": "CallExpression",
                          "start": 765,
                          "end": 779,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 765,
                            "end": 776,
                            "object": {
                              "type": "Identifier",
                              "start": 765,
                              "end": 772,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 773,
                              "end": 776,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 777,
                              "end": 778,
                              "name": "f"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 790,
                        "end": 860,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 790,
                          "end": 859,
                          "operator": "=",
                          "left": {
                            "type": "MemberExpression",
                            "start": 790,
                            "end": 798,
                            "object": {
                              "type": "Identifier",
                              "start": 790,
                              "end": 791,
                              "name": "f"
                            },
                            "property": {
                              "type": "Literal",
                              "start": 792,
                              "end": 797,
                              "value": "ggg",
                              "raw": "'ggg'"
                            },
                            "computed": true,
                            "optional": false
                          },
                          "right": {
                            "type": "BinaryExpression",
                            "start": 801,
                            "end": 859,
                            "left": {
                              "type": "Literal",
                              "start": 801,
                              "end": 802,
                              "value": 3,
                              "raw": "3"
                            },
                            "operator": "+",
                            "right": {
                              "type": "AssignmentExpression",
                              "start": 806,
                              "end": 858,
                              "operator": "=",
                              "left": {
                                "type": "Identifier",
                                "start": 806,
                                "end": 807,
                                "name": "f"
                              },
                              "right": {
                                "type": "AssignmentExpression",
                                "start": 810,
                                "end": 858,
                                "operator": "=",
                                "left": {
                                  "type": "Identifier",
                                  "start": 810,
                                  "end": 811,
                                  "name": "g"
                                },
                                "right": {
                                  "type": "ObjectExpression",
                                  "start": 814,
                                  "end": 858,
                                  "properties": [
                                    {
                                      "type": "Property",
                                      "start": 816,
                                      "end": 821,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 816,
                                        "end": 818,
                                        "name": "id"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 820,
                                        "end": 821,
                                        "value": 2,
                                        "raw": "2"
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 823,
                                      "end": 828,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 823,
                                        "end": 825,
                                        "name": "ff"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 827,
                                        "end": 828,
                                        "value": 1,
                                        "raw": "1"
                                      },
                                      "kind": "init"
                                    },
                                    {
                                      "type": "Property",
                                      "start": 830,
                                      "end": 856,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 830,
                                        "end": 834,
                                        "name": "text"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 836,
                                        "end": 856,
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
                        "start": 871,
                        "end": 935,
                        "expression": {
                          "type": "CallExpression",
                          "start": 871,
                          "end": 934,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 871,
                            "end": 882,
                            "object": {
                              "type": "Identifier",
                              "start": 871,
                              "end": 878,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 879,
                              "end": 882,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 883,
                              "end": 890,
                              "value": "inner",
                              "raw": "'inner'"
                            },
                            {
                              "type": "Identifier",
                              "start": 892,
                              "end": 893,
                              "name": "f"
                            },
                            {
                              "type": "Identifier",
                              "start": 895,
                              "end": 896,
                              "name": "b"
                            },
                            {
                              "type": "Identifier",
                              "start": 898,
                              "end": 899,
                              "name": "t"
                            },
                            {
                              "type": "BinaryExpression",
                              "start": 901,
                              "end": 908,
                              "left": {
                                "type": "Identifier",
                                "start": 901,
                                "end": 902,
                                "name": "f"
                              },
                              "operator": "===",
                              "right": {
                                "type": "Identifier",
                                "start": 907,
                                "end": 908,
                                "name": "g"
                              }
                            },
                            {
                              "type": "BinaryExpression",
                              "start": 910,
                              "end": 924,
                              "left": {
                                "type": "Identifier",
                                "start": 910,
                                "end": 911,
                                "name": "f"
                              },
                              "operator": "===",
                              "right": {
                                "type": "MemberExpression",
                                "start": 916,
                                "end": 924,
                                "object": {
                                  "type": "Identifier",
                                  "start": 916,
                                  "end": 922,
                                  "name": "global"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 923,
                                  "end": 924,
                                  "name": "f"
                                },
                                "computed": false,
                                "optional": false
                              }
                            },
                            {
                              "type": "BinaryExpression",
                              "start": 926,
                              "end": 933,
                              "left": {
                                "type": "Identifier",
                                "start": 926,
                                "end": 927,
                                "name": "f"
                              },
                              "operator": "===",
                              "right": {
                                "type": "Identifier",
                                "start": 932,
                                "end": 933,
                                "name": "t"
                              }
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 946,
                        "end": 952,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 946,
                          "end": 951,
                          "operator": "=",
                          "left": {
                            "type": "Identifier",
                            "start": 946,
                            "end": 947,
                            "name": "x"
                          },
                          "right": {
                            "type": "Identifier",
                            "start": 950,
                            "end": 951,
                            "name": "f"
                          }
                        }
                      },
                      {
                        "type": "VariableDeclaration",
                        "start": 963,
                        "end": 973,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 967,
                            "end": 972,
                            "id": {
                              "type": "Identifier",
                              "start": 967,
                              "end": 968,
                              "name": "c"
                            },
                            "init": {
                              "type": "Literal",
                              "start": 971,
                              "end": 972,
                              "value": 2,
                              "raw": "2"
                            }
                          }
                        ],
                        "kind": "let"
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 982,
                        "end": 992,
                        "expression": {
                          "type": "CallExpression",
                          "start": 982,
                          "end": 991,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 982,
                            "end": 986,
                            "object": {
                              "type": "Identifier",
                              "start": 982,
                              "end": 983,
                              "name": "b"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 984,
                              "end": 986,
                              "name": "fn"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "MemberExpression",
                              "start": 987,
                              "end": 990,
                              "object": {
                                "type": "Identifier",
                                "start": 987,
                                "end": 988,
                                "name": "b"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 989,
                                "end": 990,
                                "name": "f"
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
                  "start": 1011,
                  "end": 1017,
                  "expression": {
                    "type": "CallExpression",
                    "start": 1011,
                    "end": 1017,
                    "callee": {
                      "type": "Identifier",
                      "start": 1011,
                      "end": 1015,
                      "name": "test"
                    },
                    "arguments": [],
                    "optional": false
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 1026,
                  "end": 1061,
                  "expression": {
                    "type": "CallExpression",
                    "start": 1026,
                    "end": 1061,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 1026,
                      "end": 1037,
                      "object": {
                        "type": "Identifier",
                        "start": 1026,
                        "end": 1033,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 1034,
                        "end": 1037,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 1038,
                        "end": 1039,
                        "name": "f"
                      },
                      {
                        "type": "BinaryExpression",
                        "start": 1041,
                        "end": 1048,
                        "left": {
                          "type": "Identifier",
                          "start": 1041,
                          "end": 1042,
                          "name": "f"
                        },
                        "operator": "===",
                        "right": {
                          "type": "Identifier",
                          "start": 1047,
                          "end": 1048,
                          "name": "x"
                        }
                      },
                      {
                        "type": "Literal",
                        "start": 1050,
                        "end": 1060,
                        "value": "test end",
                        "raw": "'test end'"
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 1070,
                  "end": 1078,
                  "expression": {
                    "type": "CallExpression",
                    "start": 1070,
                    "end": 1077,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 1070,
                      "end": 1074,
                      "object": {
                        "type": "Identifier",
                        "start": 1070,
                        "end": 1071,
                        "name": "b"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 1072,
                        "end": 1074,
                        "name": "fn"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 1075,
                        "end": 1076,
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
            "start": 1093,
            "end": 1116,
            "expression": {
              "type": "CallExpression",
              "start": 1093,
              "end": 1116,
              "callee": {
                "type": "MemberExpression",
                "start": 1093,
                "end": 1104,
                "object": {
                  "type": "Identifier",
                  "start": 1093,
                  "end": 1100,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 1101,
                  "end": 1104,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 1105,
                  "end": 1112,
                  "value": "outer",
                  "raw": "'outer'"
                },
                {
                  "type": "Identifier",
                  "start": 1114,
                  "end": 1115,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1123,
            "end": 1130,
            "expression": {
              "type": "CallExpression",
              "start": 1123,
              "end": 1129,
              "callee": {
                "type": "Identifier",
                "start": 1123,
                "end": 1127,
                "name": "test"
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1137,
            "end": 1166,
            "expression": {
              "type": "CallExpression",
              "start": 1137,
              "end": 1166,
              "callee": {
                "type": "MemberExpression",
                "start": 1137,
                "end": 1148,
                "object": {
                  "type": "Identifier",
                  "start": 1137,
                  "end": 1144,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 1145,
                  "end": 1148,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 1149,
                  "end": 1162,
                  "value": "outer after",
                  "raw": "'outer after'"
                },
                {
                  "type": "Identifier",
                  "start": 1164,
                  "end": 1165,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1173,
            "end": 1181,
            "expression": {
              "type": "CallExpression",
              "start": 1173,
              "end": 1180,
              "callee": {
                "type": "MemberExpression",
                "start": 1173,
                "end": 1177,
                "object": {
                  "type": "Identifier",
                  "start": 1173,
                  "end": 1174,
                  "name": "b"
                },
                "property": {
                  "type": "Identifier",
                  "start": 1175,
                  "end": 1177,
                  "name": "fn"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 1178,
                  "end": 1179,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1188,
            "end": 1194,
            "expression": {
              "type": "CallExpression",
              "start": 1188,
              "end": 1193,
              "callee": {
                "type": "Identifier",
                "start": 1188,
                "end": 1190,
                "name": "fn"
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 1191,
                  "end": 1192,
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
      "start": 1205,
      "end": 1212,
      "expression": {
        "type": "CallExpression",
        "start": 1205,
        "end": 1212,
        "callee": {
          "type": "Identifier",
          "start": 1205,
          "end": 1210,
          "name": "test1"
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}