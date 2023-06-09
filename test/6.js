export const _ast6 = {
  "type": "Program",
  "start": 0,
  "end": 1329,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 2,
      "end": 189,
      "id": {
        "type": "Identifier",
        "start": 11,
        "end": 15,
        "name": "test"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 18,
        "end": 189,
        "body": [
          {
            "type": "FunctionDeclaration",
            "start": 22,
            "end": 161,
            "id": {
              "type": "Identifier",
              "start": 31,
              "end": 32,
              "name": "a"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [
              {
                "type": "Identifier",
                "start": 33,
                "end": 34,
                "name": "x"
              }
            ],
            "body": {
              "type": "BlockStatement",
              "start": 36,
              "end": 161,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 42,
                  "end": 65,
                  "expression": {
                    "type": "CallExpression",
                    "start": 42,
                    "end": 64,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 42,
                      "end": 53,
                      "object": {
                        "type": "Identifier",
                        "start": 42,
                        "end": 49,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 50,
                        "end": 53,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "TemplateLiteral",
                        "start": 54,
                        "end": 63,
                        "expressions": [
                          {
                            "type": "Identifier",
                            "start": 60,
                            "end": 61,
                            "name": "x"
                          }
                        ],
                        "quasis": [
                          {
                            "type": "TemplateElement",
                            "start": 55,
                            "end": 58,
                            "value": {
                              "raw": "当前是",
                              "cooked": "当前是"
                            },
                            "tail": false
                          },
                          {
                            "type": "TemplateElement",
                            "start": 62,
                            "end": 62,
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
                  "start": 70,
                  "end": 113,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 74,
                    "end": 80,
                    "left": {
                      "type": "Identifier",
                      "start": 74,
                      "end": 75,
                      "name": "x"
                    },
                    "operator": "<",
                    "right": {
                      "type": "Literal",
                      "start": 78,
                      "end": 80,
                      "value": 10,
                      "raw": "10"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 82,
                    "end": 113,
                    "body": [
                      {
                        "type": "ReturnStatement",
                        "start": 90,
                        "end": 107,
                        "argument": {
                          "type": "BinaryExpression",
                          "start": 97,
                          "end": 107,
                          "left": {
                            "type": "Identifier",
                            "start": 97,
                            "end": 98,
                            "name": "x"
                          },
                          "operator": "+",
                          "right": {
                            "type": "CallExpression",
                            "start": 101,
                            "end": 107,
                            "callee": {
                              "type": "Identifier",
                              "start": 101,
                              "end": 102,
                              "name": "a"
                            },
                            "arguments": [
                              {
                                "type": "BinaryExpression",
                                "start": 103,
                                "end": 106,
                                "left": {
                                  "type": "Identifier",
                                  "start": 103,
                                  "end": 104,
                                  "name": "x"
                                },
                                "operator": "+",
                                "right": {
                                  "type": "Literal",
                                  "start": 105,
                                  "end": 106,
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
                  "start": 118,
                  "end": 143,
                  "expression": {
                    "type": "CallExpression",
                    "start": 118,
                    "end": 142,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 118,
                      "end": 129,
                      "object": {
                        "type": "Identifier",
                        "start": 118,
                        "end": 125,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 126,
                        "end": 129,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 130,
                        "end": 138,
                        "value": "return",
                        "raw": "'return'"
                      },
                      {
                        "type": "Identifier",
                        "start": 140,
                        "end": 141,
                        "name": "x"
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ReturnStatement",
                  "start": 148,
                  "end": 157,
                  "argument": {
                    "type": "Identifier",
                    "start": 155,
                    "end": 156,
                    "name": "x"
                  }
                }
              ]
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 167,
            "end": 185,
            "expression": {
              "type": "CallExpression",
              "start": 167,
              "end": 184,
              "callee": {
                "type": "MemberExpression",
                "start": 167,
                "end": 178,
                "object": {
                  "type": "Identifier",
                  "start": 167,
                  "end": 174,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 175,
                  "end": 178,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "CallExpression",
                  "start": 179,
                  "end": 183,
                  "callee": {
                    "type": "Identifier",
                    "start": 179,
                    "end": 180,
                    "name": "a"
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "start": 181,
                      "end": 182,
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
      "start": 195,
      "end": 1317,
      "id": {
        "type": "Identifier",
        "start": 204,
        "end": 209,
        "name": "test1"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 212,
        "end": 1317,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 220,
            "end": 240,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 226,
                "end": 239,
                "id": {
                  "type": "Identifier",
                  "start": 226,
                  "end": 232,
                  "name": "global"
                },
                "init": {
                  "type": "ThisExpression",
                  "start": 235,
                  "end": 239
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 247,
            "end": 267,
            "expression": {
              "type": "CallExpression",
              "start": 247,
              "end": 266,
              "callee": {
                "type": "MemberExpression",
                "start": 247,
                "end": 258,
                "object": {
                  "type": "Identifier",
                  "start": 247,
                  "end": 254,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 255,
                  "end": 258,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 259,
                  "end": 265,
                  "name": "global"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "FunctionDeclaration",
            "start": 274,
            "end": 296,
            "id": {
              "type": "Identifier",
              "start": 283,
              "end": 284,
              "name": "a"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 287,
              "end": 296,
              "body": []
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 303,
            "end": 491,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 307,
                "end": 491,
                "id": {
                  "type": "Identifier",
                  "start": 307,
                  "end": 309,
                  "name": "fn"
                },
                "init": {
                  "type": "FunctionExpression",
                  "start": 312,
                  "end": 491,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [
                    {
                      "type": "Identifier",
                      "start": 322,
                      "end": 323,
                      "name": "a"
                    }
                  ],
                  "body": {
                    "type": "BlockStatement",
                    "start": 325,
                    "end": 491,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 335,
                        "end": 364,
                        "expression": {
                          "type": "CallExpression",
                          "start": 335,
                          "end": 364,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 335,
                            "end": 346,
                            "object": {
                              "type": "Identifier",
                              "start": 335,
                              "end": 342,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 343,
                              "end": 346,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 347,
                              "end": 357,
                              "value": "fn start",
                              "raw": "'fn start'"
                            },
                            {
                              "type": "Identifier",
                              "start": 359,
                              "end": 360,
                              "name": "a"
                            },
                            {
                              "type": "Identifier",
                              "start": 362,
                              "end": 363,
                              "name": "f"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "IfStatement",
                        "start": 373,
                        "end": 483,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 377,
                          "end": 384,
                          "left": {
                            "type": "Identifier",
                            "start": 377,
                            "end": 378,
                            "name": "a"
                          },
                          "operator": "===",
                          "right": {
                            "type": "Identifier",
                            "start": 383,
                            "end": 384,
                            "name": "f"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 386,
                          "end": 426,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 398,
                              "end": 416,
                              "expression": {
                                "type": "CallExpression",
                                "start": 398,
                                "end": 415,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 398,
                                  "end": 409,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 398,
                                    "end": 405,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 406,
                                    "end": 409,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "ThisExpression",
                                    "start": 410,
                                    "end": 414
                                  }
                                ],
                                "optional": false
                              }
                            }
                          ]
                        },
                        "alternate": {
                          "type": "BlockStatement",
                          "start": 432,
                          "end": 483,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 444,
                              "end": 473,
                              "expression": {
                                "type": "CallExpression",
                                "start": 444,
                                "end": 473,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 444,
                                  "end": 462,
                                  "object": {
                                    "type": "MemberExpression",
                                    "start": 444,
                                    "end": 458,
                                    "object": {
                                      "type": "Identifier",
                                      "start": 444,
                                      "end": 450,
                                      "name": "window"
                                    },
                                    "property": {
                                      "type": "Identifier",
                                      "start": 451,
                                      "end": 458,
                                      "name": "console"
                                    },
                                    "computed": false,
                                    "optional": false
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 459,
                                    "end": 462,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 463,
                                    "end": 469,
                                    "value": "hhhh",
                                    "raw": "'hhhh'"
                                  },
                                  {
                                    "type": "Identifier",
                                    "start": 471,
                                    "end": 472,
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
            "start": 498,
            "end": 546,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 502,
                "end": 545,
                "id": {
                  "type": "Identifier",
                  "start": 502,
                  "end": 503,
                  "name": "f"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 506,
                  "end": 545,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 508,
                      "end": 513,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 508,
                        "end": 510,
                        "name": "id"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 512,
                        "end": 513,
                        "value": 0,
                        "raw": "0"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 515,
                      "end": 520,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 515,
                        "end": 516,
                        "name": "a"
                      },
                      "value": {
                        "type": "UnaryExpression",
                        "start": 518,
                        "end": 520,
                        "operator": "+",
                        "prefix": true,
                        "argument": {
                          "type": "Literal",
                          "start": 519,
                          "end": 520,
                          "value": 1,
                          "raw": "1"
                        }
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 522,
                      "end": 543,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 522,
                        "end": 526,
                        "name": "text"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 528,
                        "end": 543,
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
            "start": 553,
            "end": 588,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 559,
                "end": 588,
                "id": {
                  "type": "Identifier",
                  "start": 559,
                  "end": 560,
                  "name": "b"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 563,
                  "end": 588,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 565,
                      "end": 566,
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 565,
                        "end": 566,
                        "name": "f"
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "start": 565,
                        "end": 566,
                        "name": "f"
                      }
                    },
                    {
                      "type": "Property",
                      "start": 568,
                      "end": 570,
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 568,
                        "end": 570,
                        "name": "fn"
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "start": 568,
                        "end": 570,
                        "name": "fn"
                      }
                    },
                    {
                      "type": "Property",
                      "start": 572,
                      "end": 586,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 572,
                        "end": 573,
                        "name": "c"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 575,
                        "end": 586,
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
            "start": 595,
            "end": 607,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 599,
                "end": 607,
                "id": {
                  "type": "Identifier",
                  "start": 599,
                  "end": 600,
                  "name": "x"
                },
                "init": {
                  "type": "Literal",
                  "start": 603,
                  "end": 607,
                  "value": null,
                  "raw": "null"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "FunctionDeclaration",
            "start": 614,
            "end": 1203,
            "id": {
              "type": "Identifier",
              "start": 623,
              "end": 627,
              "name": "test"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 630,
              "end": 1203,
              "body": [
                {
                  "type": "VariableDeclaration",
                  "start": 640,
                  "end": 683,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 644,
                      "end": 682,
                      "id": {
                        "type": "Identifier",
                        "start": 644,
                        "end": 645,
                        "name": "f"
                      },
                      "init": {
                        "type": "ObjectExpression",
                        "start": 648,
                        "end": 682,
                        "properties": [
                          {
                            "type": "Property",
                            "start": 649,
                            "end": 654,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 649,
                              "end": 651,
                              "name": "id"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 653,
                              "end": 654,
                              "value": 1,
                              "raw": "1"
                            },
                            "kind": "init"
                          },
                          {
                            "type": "Property",
                            "start": 656,
                            "end": 681,
                            "method": false,
                            "shorthand": false,
                            "computed": false,
                            "key": {
                              "type": "Identifier",
                              "start": 656,
                              "end": 660,
                              "name": "text"
                            },
                            "value": {
                              "type": "Literal",
                              "start": 662,
                              "end": 681,
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
                  "start": 693,
                  "end": 1033,
                  "id": {
                    "type": "Identifier",
                    "start": 702,
                    "end": 706,
                    "name": "test"
                  },
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "start": 709,
                    "end": 1033,
                    "body": [
                      {
                        "type": "VariableDeclaration",
                        "start": 721,
                        "end": 733,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 727,
                            "end": 732,
                            "id": {
                              "type": "Identifier",
                              "start": 727,
                              "end": 728,
                              "name": "t"
                            },
                            "init": {
                              "type": "Identifier",
                              "start": 731,
                              "end": 732,
                              "name": "f"
                            }
                          }
                        ],
                        "kind": "const"
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 744,
                        "end": 758,
                        "expression": {
                          "type": "CallExpression",
                          "start": 744,
                          "end": 758,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 744,
                            "end": 755,
                            "object": {
                              "type": "Identifier",
                              "start": 744,
                              "end": 751,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 752,
                              "end": 755,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 756,
                              "end": 757,
                              "name": "f"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 790,
                        "end": 863,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 790,
                          "end": 862,
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
                            "end": 862,
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
                              "end": 861,
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
                                "end": 861,
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
                                  "end": 861,
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
                                      "end": 831,
                                      "method": false,
                                      "shorthand": true,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 830,
                                        "end": 831,
                                        "name": "f"
                                      },
                                      "kind": "init",
                                      "value": {
                                        "type": "Identifier",
                                        "start": 830,
                                        "end": 831,
                                        "name": "f"
                                      }
                                    },
                                    {
                                      "type": "Property",
                                      "start": 833,
                                      "end": 859,
                                      "method": false,
                                      "shorthand": false,
                                      "computed": false,
                                      "key": {
                                        "type": "Identifier",
                                        "start": 833,
                                        "end": 837,
                                        "name": "text"
                                      },
                                      "value": {
                                        "type": "Literal",
                                        "start": 839,
                                        "end": 859,
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
                        "start": 874,
                        "end": 938,
                        "expression": {
                          "type": "CallExpression",
                          "start": 874,
                          "end": 937,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 874,
                            "end": 885,
                            "object": {
                              "type": "Identifier",
                              "start": 874,
                              "end": 881,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 882,
                              "end": 885,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 886,
                              "end": 893,
                              "value": "inner",
                              "raw": "'inner'"
                            },
                            {
                              "type": "Identifier",
                              "start": 895,
                              "end": 896,
                              "name": "f"
                            },
                            {
                              "type": "Identifier",
                              "start": 898,
                              "end": 899,
                              "name": "b"
                            },
                            {
                              "type": "Identifier",
                              "start": 901,
                              "end": 902,
                              "name": "t"
                            },
                            {
                              "type": "BinaryExpression",
                              "start": 904,
                              "end": 911,
                              "left": {
                                "type": "Identifier",
                                "start": 904,
                                "end": 905,
                                "name": "f"
                              },
                              "operator": "===",
                              "right": {
                                "type": "Identifier",
                                "start": 910,
                                "end": 911,
                                "name": "g"
                              }
                            },
                            {
                              "type": "BinaryExpression",
                              "start": 913,
                              "end": 927,
                              "left": {
                                "type": "Identifier",
                                "start": 913,
                                "end": 914,
                                "name": "f"
                              },
                              "operator": "===",
                              "right": {
                                "type": "MemberExpression",
                                "start": 919,
                                "end": 927,
                                "object": {
                                  "type": "Identifier",
                                  "start": 919,
                                  "end": 925,
                                  "name": "global"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 926,
                                  "end": 927,
                                  "name": "f"
                                },
                                "computed": false,
                                "optional": false
                              }
                            },
                            {
                              "type": "BinaryExpression",
                              "start": 929,
                              "end": 936,
                              "left": {
                                "type": "Identifier",
                                "start": 929,
                                "end": 930,
                                "name": "f"
                              },
                              "operator": "===",
                              "right": {
                                "type": "Identifier",
                                "start": 935,
                                "end": 936,
                                "name": "t"
                              }
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 949,
                        "end": 955,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 949,
                          "end": 954,
                          "operator": "=",
                          "left": {
                            "type": "Identifier",
                            "start": 949,
                            "end": 950,
                            "name": "x"
                          },
                          "right": {
                            "type": "Identifier",
                            "start": 953,
                            "end": 954,
                            "name": "f"
                          }
                        }
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 966,
                        "end": 985,
                        "expression": {
                          "type": "CallExpression",
                          "start": 966,
                          "end": 985,
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
                              "end": 981,
                              "value": "x",
                              "raw": "'x'"
                            },
                            {
                              "type": "Identifier",
                              "start": 983,
                              "end": 984,
                              "name": "x"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "VariableDeclaration",
                        "start": 996,
                        "end": 1006,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 1000,
                            "end": 1005,
                            "id": {
                              "type": "Identifier",
                              "start": 1000,
                              "end": 1001,
                              "name": "c"
                            },
                            "init": {
                              "type": "Literal",
                              "start": 1004,
                              "end": 1005,
                              "value": 2,
                              "raw": "2"
                            }
                          }
                        ],
                        "kind": "let"
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 1015,
                        "end": 1023,
                        "expression": {
                          "type": "CallExpression",
                          "start": 1015,
                          "end": 1022,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 1015,
                            "end": 1019,
                            "object": {
                              "type": "Identifier",
                              "start": 1015,
                              "end": 1016,
                              "name": "b"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 1017,
                              "end": 1019,
                              "name": "fn"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 1020,
                              "end": 1021,
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
                  "start": 1042,
                  "end": 1048,
                  "expression": {
                    "type": "CallExpression",
                    "start": 1042,
                    "end": 1048,
                    "callee": {
                      "type": "Identifier",
                      "start": 1042,
                      "end": 1046,
                      "name": "test"
                    },
                    "arguments": [],
                    "optional": false
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 1057,
                  "end": 1085,
                  "expression": {
                    "type": "CallExpression",
                    "start": 1057,
                    "end": 1085,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 1057,
                      "end": 1068,
                      "object": {
                        "type": "Identifier",
                        "start": 1057,
                        "end": 1064,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 1065,
                        "end": 1068,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 1069,
                        "end": 1084,
                        "value": "test 结束------",
                        "raw": "'test 结束------'"
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 1133,
                  "end": 1178,
                  "expression": {
                    "type": "CallExpression",
                    "start": 1133,
                    "end": 1178,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 1133,
                      "end": 1144,
                      "object": {
                        "type": "Identifier",
                        "start": 1133,
                        "end": 1140,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 1141,
                        "end": 1144,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 1145,
                        "end": 1146,
                        "name": "f"
                      },
                      {
                        "type": "BinaryExpression",
                        "start": 1148,
                        "end": 1155,
                        "left": {
                          "type": "Identifier",
                          "start": 1148,
                          "end": 1149,
                          "name": "f"
                        },
                        "operator": "===",
                        "right": {
                          "type": "Identifier",
                          "start": 1154,
                          "end": 1155,
                          "name": "x"
                        }
                      },
                      {
                        "type": "MemberExpression",
                        "start": 1157,
                        "end": 1165,
                        "object": {
                          "type": "Identifier",
                          "start": 1157,
                          "end": 1163,
                          "name": "window"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 1164,
                          "end": 1165,
                          "name": "g"
                        },
                        "computed": false,
                        "optional": false
                      },
                      {
                        "type": "Literal",
                        "start": 1167,
                        "end": 1177,
                        "value": "test end",
                        "raw": "'test end'"
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 1187,
                  "end": 1195,
                  "expression": {
                    "type": "CallExpression",
                    "start": 1187,
                    "end": 1194,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 1187,
                      "end": 1191,
                      "object": {
                        "type": "Identifier",
                        "start": 1187,
                        "end": 1188,
                        "name": "b"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 1189,
                        "end": 1191,
                        "name": "fn"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 1192,
                        "end": 1193,
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
            "start": 1210,
            "end": 1233,
            "expression": {
              "type": "CallExpression",
              "start": 1210,
              "end": 1233,
              "callee": {
                "type": "MemberExpression",
                "start": 1210,
                "end": 1221,
                "object": {
                  "type": "Identifier",
                  "start": 1210,
                  "end": 1217,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 1218,
                  "end": 1221,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 1222,
                  "end": 1229,
                  "value": "outer",
                  "raw": "'outer'"
                },
                {
                  "type": "Identifier",
                  "start": 1231,
                  "end": 1232,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1240,
            "end": 1247,
            "expression": {
              "type": "CallExpression",
              "start": 1240,
              "end": 1246,
              "callee": {
                "type": "Identifier",
                "start": 1240,
                "end": 1244,
                "name": "test"
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1254,
            "end": 1283,
            "expression": {
              "type": "CallExpression",
              "start": 1254,
              "end": 1283,
              "callee": {
                "type": "MemberExpression",
                "start": 1254,
                "end": 1265,
                "object": {
                  "type": "Identifier",
                  "start": 1254,
                  "end": 1261,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 1262,
                  "end": 1265,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 1266,
                  "end": 1279,
                  "value": "outer after",
                  "raw": "'outer after'"
                },
                {
                  "type": "Identifier",
                  "start": 1281,
                  "end": 1282,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1290,
            "end": 1298,
            "expression": {
              "type": "CallExpression",
              "start": 1290,
              "end": 1297,
              "callee": {
                "type": "MemberExpression",
                "start": 1290,
                "end": 1294,
                "object": {
                  "type": "Identifier",
                  "start": 1290,
                  "end": 1291,
                  "name": "b"
                },
                "property": {
                  "type": "Identifier",
                  "start": 1292,
                  "end": 1294,
                  "name": "fn"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 1295,
                  "end": 1296,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 1305,
            "end": 1311,
            "expression": {
              "type": "CallExpression",
              "start": 1305,
              "end": 1310,
              "callee": {
                "type": "Identifier",
                "start": 1305,
                "end": 1307,
                "name": "fn"
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 1308,
                  "end": 1309,
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
      "start": 1322,
      "end": 1329,
      "expression": {
        "type": "CallExpression",
        "start": 1322,
        "end": 1329,
        "callee": {
          "type": "Identifier",
          "start": 1322,
          "end": 1327,
          "name": "test1"
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}