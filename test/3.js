export const _ast3 = {
  "type": "Program",
  "start": 0,
  "end": 941,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 4,
      "end": 161,
      "id": {
        "type": "Identifier",
        "start": 13,
        "end": 17,
        "name": "test"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 20,
        "end": 161,
        "body": [
          {
            "type": "FunctionDeclaration",
            "start": 24,
            "end": 133,
            "id": {
              "type": "Identifier",
              "start": 33,
              "end": 34,
              "name": "a"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [
              {
                "type": "Identifier",
                "start": 35,
                "end": 36,
                "name": "x"
              }
            ],
            "body": {
              "type": "BlockStatement",
              "start": 38,
              "end": 133,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 44,
                  "end": 67,
                  "expression": {
                    "type": "CallExpression",
                    "start": 44,
                    "end": 66,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 44,
                      "end": 55,
                      "object": {
                        "type": "Identifier",
                        "start": 44,
                        "end": 51,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 52,
                        "end": 55,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "TemplateLiteral",
                        "start": 56,
                        "end": 65,
                        "expressions": [
                          {
                            "type": "Identifier",
                            "start": 62,
                            "end": 63,
                            "name": "x"
                          }
                        ],
                        "quasis": [
                          {
                            "type": "TemplateElement",
                            "start": 57,
                            "end": 60,
                            "value": {
                              "raw": "当前是",
                              "cooked": "当前是"
                            },
                            "tail": false
                          },
                          {
                            "type": "TemplateElement",
                            "start": 64,
                            "end": 64,
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
                  "start": 72,
                  "end": 115,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 76,
                    "end": 82,
                    "left": {
                      "type": "Identifier",
                      "start": 76,
                      "end": 77,
                      "name": "x"
                    },
                    "operator": "<",
                    "right": {
                      "type": "Literal",
                      "start": 80,
                      "end": 82,
                      "value": 10,
                      "raw": "10"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 84,
                    "end": 115,
                    "body": [
                      {
                        "type": "ReturnStatement",
                        "start": 92,
                        "end": 109,
                        "argument": {
                          "type": "BinaryExpression",
                          "start": 99,
                          "end": 109,
                          "left": {
                            "type": "Identifier",
                            "start": 99,
                            "end": 100,
                            "name": "x"
                          },
                          "operator": "+",
                          "right": {
                            "type": "CallExpression",
                            "start": 103,
                            "end": 109,
                            "callee": {
                              "type": "Identifier",
                              "start": 103,
                              "end": 104,
                              "name": "a"
                            },
                            "arguments": [
                              {
                                "type": "BinaryExpression",
                                "start": 105,
                                "end": 108,
                                "left": {
                                  "type": "Identifier",
                                  "start": 105,
                                  "end": 106,
                                  "name": "x"
                                },
                                "operator": "+",
                                "right": {
                                  "type": "Literal",
                                  "start": 107,
                                  "end": 108,
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
                  "type": "ReturnStatement",
                  "start": 120,
                  "end": 129,
                  "argument": {
                    "type": "Identifier",
                    "start": 127,
                    "end": 128,
                    "name": "x"
                  }
                }
              ]
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 139,
            "end": 157,
            "expression": {
              "type": "CallExpression",
              "start": 139,
              "end": 156,
              "callee": {
                "type": "MemberExpression",
                "start": 139,
                "end": 150,
                "object": {
                  "type": "Identifier",
                  "start": 139,
                  "end": 146,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 147,
                  "end": 150,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "CallExpression",
                  "start": 151,
                  "end": 155,
                  "callee": {
                    "type": "Identifier",
                    "start": 151,
                    "end": 152,
                    "name": "a"
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "start": 153,
                      "end": 154,
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
      "start": 167,
      "end": 930,
      "id": {
        "type": "Identifier",
        "start": 176,
        "end": 181,
        "name": "test1"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 184,
        "end": 930,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 192,
            "end": 212,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 198,
                "end": 211,
                "id": {
                  "type": "Identifier",
                  "start": 198,
                  "end": 204,
                  "name": "global"
                },
                "init": {
                  "type": "ThisExpression",
                  "start": 207,
                  "end": 211
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 219,
            "end": 239,
            "expression": {
              "type": "CallExpression",
              "start": 219,
              "end": 238,
              "callee": {
                "type": "MemberExpression",
                "start": 219,
                "end": 230,
                "object": {
                  "type": "Identifier",
                  "start": 219,
                  "end": 226,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 227,
                  "end": 230,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 231,
                  "end": 237,
                  "name": "global"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "FunctionDeclaration",
            "start": 246,
            "end": 268,
            "id": {
              "type": "Identifier",
              "start": 255,
              "end": 256,
              "name": "a"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 259,
              "end": 268,
              "body": []
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 275,
            "end": 456,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 279,
                "end": 456,
                "id": {
                  "type": "Identifier",
                  "start": 279,
                  "end": 281,
                  "name": "fn"
                },
                "init": {
                  "type": "FunctionExpression",
                  "start": 284,
                  "end": 456,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [
                    {
                      "type": "Identifier",
                      "start": 294,
                      "end": 295,
                      "name": "a"
                    }
                  ],
                  "body": {
                    "type": "BlockStatement",
                    "start": 297,
                    "end": 456,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 307,
                        "end": 336,
                        "expression": {
                          "type": "CallExpression",
                          "start": 307,
                          "end": 336,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 307,
                            "end": 318,
                            "object": {
                              "type": "Identifier",
                              "start": 307,
                              "end": 314,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 315,
                              "end": 318,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 319,
                              "end": 329,
                              "value": "fn start",
                              "raw": "'fn start'"
                            },
                            {
                              "type": "Identifier",
                              "start": 331,
                              "end": 332,
                              "name": "a"
                            },
                            {
                              "type": "Identifier",
                              "start": 334,
                              "end": 335,
                              "name": "f"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "IfStatement",
                        "start": 345,
                        "end": 448,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 349,
                          "end": 356,
                          "left": {
                            "type": "Identifier",
                            "start": 349,
                            "end": 350,
                            "name": "a"
                          },
                          "operator": "===",
                          "right": {
                            "type": "Identifier",
                            "start": 355,
                            "end": 356,
                            "name": "f"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 358,
                          "end": 398,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 370,
                              "end": 388,
                              "expression": {
                                "type": "CallExpression",
                                "start": 370,
                                "end": 387,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 370,
                                  "end": 381,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 370,
                                    "end": 377,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 378,
                                    "end": 381,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "ThisExpression",
                                    "start": 382,
                                    "end": 386
                                  }
                                ],
                                "optional": false
                              }
                            }
                          ]
                        },
                        "alternate": {
                          "type": "BlockStatement",
                          "start": 404,
                          "end": 448,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 416,
                              "end": 438,
                              "expression": {
                                "type": "CallExpression",
                                "start": 416,
                                "end": 438,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 416,
                                  "end": 427,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 416,
                                    "end": 423,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 424,
                                    "end": 427,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 428,
                                    "end": 434,
                                    "value": "hhhh",
                                    "raw": "'hhhh'"
                                  },
                                  {
                                    "type": "Identifier",
                                    "start": 436,
                                    "end": 437,
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
            "start": 463,
            "end": 511,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 467,
                "end": 510,
                "id": {
                  "type": "Identifier",
                  "start": 467,
                  "end": 468,
                  "name": "f"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 471,
                  "end": 510,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 473,
                      "end": 478,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 473,
                        "end": 475,
                        "name": "id"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 477,
                        "end": 478,
                        "value": 0,
                        "raw": "0"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 480,
                      "end": 485,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 480,
                        "end": 481,
                        "name": "a"
                      },
                      "value": {
                        "type": "UnaryExpression",
                        "start": 483,
                        "end": 485,
                        "operator": "+",
                        "prefix": true,
                        "argument": {
                          "type": "Literal",
                          "start": 484,
                          "end": 485,
                          "value": 1,
                          "raw": "1"
                        }
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 487,
                      "end": 508,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 487,
                        "end": 491,
                        "name": "text"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 493,
                        "end": 508,
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
            "start": 518,
            "end": 553,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 524,
                "end": 553,
                "id": {
                  "type": "Identifier",
                  "start": 524,
                  "end": 525,
                  "name": "b"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 528,
                  "end": 553,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 530,
                      "end": 531,
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 530,
                        "end": 531,
                        "name": "f"
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "start": 530,
                        "end": 531,
                        "name": "f"
                      }
                    },
                    {
                      "type": "Property",
                      "start": 533,
                      "end": 535,
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 533,
                        "end": 535,
                        "name": "fn"
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "start": 533,
                        "end": 535,
                        "name": "fn"
                      }
                    },
                    {
                      "type": "Property",
                      "start": 537,
                      "end": 551,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 537,
                        "end": 538,
                        "name": "c"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 540,
                        "end": 551,
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
            "type": "FunctionDeclaration",
            "start": 560,
            "end": 817,
            "id": {
              "type": "Identifier",
              "start": 569,
              "end": 573,
              "name": "test"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 576,
              "end": 817,
              "body": [
                {
                  "type": "VariableDeclaration",
                  "start": 586,
                  "end": 598,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 592,
                      "end": 597,
                      "id": {
                        "type": "Identifier",
                        "start": 592,
                        "end": 593,
                        "name": "t"
                      },
                      "init": {
                        "type": "Identifier",
                        "start": 596,
                        "end": 597,
                        "name": "f"
                      }
                    }
                  ],
                  "kind": "const"
                },
                {
                  "type": "ExpressionStatement",
                  "start": 607,
                  "end": 621,
                  "expression": {
                    "type": "CallExpression",
                    "start": 607,
                    "end": 621,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 607,
                      "end": 618,
                      "object": {
                        "type": "Identifier",
                        "start": 607,
                        "end": 614,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 615,
                        "end": 618,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 619,
                        "end": 620,
                        "name": "f"
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 630,
                  "end": 698,
                  "expression": {
                    "type": "AssignmentExpression",
                    "start": 630,
                    "end": 697,
                    "operator": "=",
                    "left": {
                      "type": "MemberExpression",
                      "start": 630,
                      "end": 638,
                      "object": {
                        "type": "Identifier",
                        "start": 630,
                        "end": 631,
                        "name": "f"
                      },
                      "property": {
                        "type": "Literal",
                        "start": 632,
                        "end": 637,
                        "value": "ggg",
                        "raw": "'ggg'"
                      },
                      "computed": true,
                      "optional": false
                    },
                    "right": {
                      "type": "BinaryExpression",
                      "start": 641,
                      "end": 697,
                      "left": {
                        "type": "Literal",
                        "start": 641,
                        "end": 642,
                        "value": 3,
                        "raw": "3"
                      },
                      "operator": "+",
                      "right": {
                        "type": "AssignmentExpression",
                        "start": 646,
                        "end": 696,
                        "operator": "=",
                        "left": {
                          "type": "Identifier",
                          "start": 646,
                          "end": 647,
                          "name": "f"
                        },
                        "right": {
                          "type": "AssignmentExpression",
                          "start": 650,
                          "end": 696,
                          "operator": "=",
                          "left": {
                            "type": "Identifier",
                            "start": 650,
                            "end": 651,
                            "name": "g"
                          },
                          "right": {
                            "type": "ObjectExpression",
                            "start": 654,
                            "end": 696,
                            "properties": [
                              {
                                "type": "Property",
                                "start": 656,
                                "end": 661,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 656,
                                  "end": 658,
                                  "name": "id"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 660,
                                  "end": 661,
                                  "value": 2,
                                  "raw": "2"
                                },
                                "kind": "init"
                              },
                              {
                                "type": "Property",
                                "start": 663,
                                "end": 668,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 663,
                                  "end": 665,
                                  "name": "ff"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 667,
                                  "end": 668,
                                  "value": 1,
                                  "raw": "1"
                                },
                                "kind": "init"
                              },
                              {
                                "type": "Property",
                                "start": 670,
                                "end": 694,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 670,
                                  "end": 674,
                                  "name": "text"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 676,
                                  "end": 694,
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
                  "start": 707,
                  "end": 771,
                  "expression": {
                    "type": "CallExpression",
                    "start": 707,
                    "end": 770,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 707,
                      "end": 718,
                      "object": {
                        "type": "Identifier",
                        "start": 707,
                        "end": 714,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 715,
                        "end": 718,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 719,
                        "end": 726,
                        "value": "inner",
                        "raw": "'inner'"
                      },
                      {
                        "type": "Identifier",
                        "start": 728,
                        "end": 729,
                        "name": "f"
                      },
                      {
                        "type": "Identifier",
                        "start": 731,
                        "end": 732,
                        "name": "b"
                      },
                      {
                        "type": "Identifier",
                        "start": 734,
                        "end": 735,
                        "name": "t"
                      },
                      {
                        "type": "BinaryExpression",
                        "start": 737,
                        "end": 744,
                        "left": {
                          "type": "Identifier",
                          "start": 737,
                          "end": 738,
                          "name": "f"
                        },
                        "operator": "===",
                        "right": {
                          "type": "Identifier",
                          "start": 743,
                          "end": 744,
                          "name": "g"
                        }
                      },
                      {
                        "type": "BinaryExpression",
                        "start": 746,
                        "end": 760,
                        "left": {
                          "type": "Identifier",
                          "start": 746,
                          "end": 747,
                          "name": "f"
                        },
                        "operator": "===",
                        "right": {
                          "type": "MemberExpression",
                          "start": 752,
                          "end": 760,
                          "object": {
                            "type": "Identifier",
                            "start": 752,
                            "end": 758,
                            "name": "global"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 759,
                            "end": 760,
                            "name": "f"
                          },
                          "computed": false,
                          "optional": false
                        }
                      },
                      {
                        "type": "BinaryExpression",
                        "start": 762,
                        "end": 769,
                        "left": {
                          "type": "Identifier",
                          "start": 762,
                          "end": 763,
                          "name": "f"
                        },
                        "operator": "===",
                        "right": {
                          "type": "Identifier",
                          "start": 768,
                          "end": 769,
                          "name": "t"
                        }
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "VariableDeclaration",
                  "start": 780,
                  "end": 790,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 784,
                      "end": 789,
                      "id": {
                        "type": "Identifier",
                        "start": 784,
                        "end": 785,
                        "name": "c"
                      },
                      "init": {
                        "type": "Literal",
                        "start": 788,
                        "end": 789,
                        "value": 2,
                        "raw": "2"
                      }
                    }
                  ],
                  "kind": "let"
                },
                {
                  "type": "ExpressionStatement",
                  "start": 799,
                  "end": 809,
                  "expression": {
                    "type": "CallExpression",
                    "start": 799,
                    "end": 808,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 799,
                      "end": 803,
                      "object": {
                        "type": "Identifier",
                        "start": 799,
                        "end": 800,
                        "name": "b"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 801,
                        "end": 803,
                        "name": "fn"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "MemberExpression",
                        "start": 804,
                        "end": 807,
                        "object": {
                          "type": "Identifier",
                          "start": 804,
                          "end": 805,
                          "name": "b"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 806,
                          "end": 807,
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
            "start": 824,
            "end": 847,
            "expression": {
              "type": "CallExpression",
              "start": 824,
              "end": 847,
              "callee": {
                "type": "MemberExpression",
                "start": 824,
                "end": 835,
                "object": {
                  "type": "Identifier",
                  "start": 824,
                  "end": 831,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 832,
                  "end": 835,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 836,
                  "end": 843,
                  "value": "outer",
                  "raw": "'outer'"
                },
                {
                  "type": "Identifier",
                  "start": 845,
                  "end": 846,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 854,
            "end": 861,
            "expression": {
              "type": "CallExpression",
              "start": 854,
              "end": 860,
              "callee": {
                "type": "Identifier",
                "start": 854,
                "end": 858,
                "name": "test"
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 868,
            "end": 897,
            "expression": {
              "type": "CallExpression",
              "start": 868,
              "end": 897,
              "callee": {
                "type": "MemberExpression",
                "start": 868,
                "end": 879,
                "object": {
                  "type": "Identifier",
                  "start": 868,
                  "end": 875,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 876,
                  "end": 879,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 880,
                  "end": 893,
                  "value": "outer after",
                  "raw": "'outer after'"
                },
                {
                  "type": "Identifier",
                  "start": 895,
                  "end": 896,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 904,
            "end": 912,
            "expression": {
              "type": "CallExpression",
              "start": 904,
              "end": 911,
              "callee": {
                "type": "MemberExpression",
                "start": 904,
                "end": 908,
                "object": {
                  "type": "Identifier",
                  "start": 904,
                  "end": 905,
                  "name": "b"
                },
                "property": {
                  "type": "Identifier",
                  "start": 906,
                  "end": 908,
                  "name": "fn"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 909,
                  "end": 910,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 919,
            "end": 924,
            "expression": {
              "type": "CallExpression",
              "start": 919,
              "end": 924,
              "callee": {
                "type": "Identifier",
                "start": 919,
                "end": 921,
                "name": "fn"
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 922,
                  "end": 923,
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
      "start": 935,
      "end": 941,
      "expression": {
        "type": "CallExpression",
        "start": 935,
        "end": 941,
        "callee": {
          "type": "Identifier",
          "start": 935,
          "end": 939,
          "name": "test"
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}