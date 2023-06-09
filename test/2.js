export const _ast2 = {
  "type": "Program",
  "start": 0,
  "end": 763,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 3,
      "end": 751,
      "id": {
        "type": "Identifier",
        "start": 12,
        "end": 17,
        "name": "test1"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 20,
        "end": 751,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 28,
            "end": 48,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 34,
                "end": 47,
                "id": {
                  "type": "Identifier",
                  "start": 34,
                  "end": 40,
                  "name": "global"
                },
                "init": {
                  "type": "ThisExpression",
                  "start": 43,
                  "end": 47
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 55,
            "end": 75,
            "expression": {
              "type": "CallExpression",
              "start": 55,
              "end": 74,
              "callee": {
                "type": "MemberExpression",
                "start": 55,
                "end": 66,
                "object": {
                  "type": "Identifier",
                  "start": 55,
                  "end": 62,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 63,
                  "end": 66,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 67,
                  "end": 73,
                  "name": "global"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "FunctionDeclaration",
            "start": 82,
            "end": 104,
            "id": {
              "type": "Identifier",
              "start": 91,
              "end": 92,
              "name": "a"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 95,
              "end": 104,
              "body": []
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 111,
            "end": 293,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 115,
                "end": 293,
                "id": {
                  "type": "Identifier",
                  "start": 115,
                  "end": 117,
                  "name": "fn"
                },
                "init": {
                  "type": "FunctionExpression",
                  "start": 120,
                  "end": 293,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [
                    {
                      "type": "Identifier",
                      "start": 130,
                      "end": 131,
                      "name": "a"
                    }
                  ],
                  "body": {
                    "type": "BlockStatement",
                    "start": 133,
                    "end": 293,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 143,
                        "end": 172,
                        "expression": {
                          "type": "CallExpression",
                          "start": 143,
                          "end": 172,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 143,
                            "end": 154,
                            "object": {
                              "type": "Identifier",
                              "start": 143,
                              "end": 150,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 151,
                              "end": 154,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Literal",
                              "start": 155,
                              "end": 165,
                              "value": "fn start",
                              "raw": "'fn start'"
                            },
                            {
                              "type": "Identifier",
                              "start": 167,
                              "end": 168,
                              "name": "a"
                            },
                            {
                              "type": "Identifier",
                              "start": 170,
                              "end": 171,
                              "name": "f"
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "IfStatement",
                        "start": 181,
                        "end": 284,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 185,
                          "end": 192,
                          "left": {
                            "type": "Identifier",
                            "start": 185,
                            "end": 186,
                            "name": "a"
                          },
                          "operator": "===",
                          "right": {
                            "type": "Identifier",
                            "start": 191,
                            "end": 192,
                            "name": "f"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 194,
                          "end": 234,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 206,
                              "end": 224,
                              "expression": {
                                "type": "CallExpression",
                                "start": 206,
                                "end": 223,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 206,
                                  "end": 217,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 206,
                                    "end": 213,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 214,
                                    "end": 217,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "ThisExpression",
                                    "start": 218,
                                    "end": 222
                                  }
                                ],
                                "optional": false
                              }
                            }
                          ]
                        },
                        "alternate": {
                          "type": "BlockStatement",
                          "start": 240,
                          "end": 284,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 252,
                              "end": 274,
                              "expression": {
                                "type": "CallExpression",
                                "start": 252,
                                "end": 274,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 252,
                                  "end": 263,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 252,
                                    "end": 259,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 260,
                                    "end": 263,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 264,
                                    "end": 270,
                                    "value": "hhhh",
                                    "raw": "'hhhh'"
                                  },
                                  {
                                    "type": "Identifier",
                                    "start": 272,
                                    "end": 273,
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
                        "start": 284,
                        "end": 285
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
            "start": 300,
            "end": 348,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 304,
                "end": 347,
                "id": {
                  "type": "Identifier",
                  "start": 304,
                  "end": 305,
                  "name": "f"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 308,
                  "end": 347,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 310,
                      "end": 315,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 310,
                        "end": 312,
                        "name": "id"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 314,
                        "end": 315,
                        "value": 0,
                        "raw": "0"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 317,
                      "end": 322,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 317,
                        "end": 318,
                        "name": "a"
                      },
                      "value": {
                        "type": "UnaryExpression",
                        "start": 320,
                        "end": 322,
                        "operator": "+",
                        "prefix": true,
                        "argument": {
                          "type": "Literal",
                          "start": 321,
                          "end": 322,
                          "value": 1,
                          "raw": "1"
                        }
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 324,
                      "end": 345,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 324,
                        "end": 328,
                        "name": "text"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 330,
                        "end": 345,
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
            "start": 355,
            "end": 374,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 361,
                "end": 374,
                "id": {
                  "type": "Identifier",
                  "start": 361,
                  "end": 362,
                  "name": "b"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 365,
                  "end": 374,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 367,
                      "end": 368,
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 367,
                        "end": 368,
                        "name": "f"
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "start": 367,
                        "end": 368,
                        "name": "f"
                      }
                    },
                    {
                      "type": "Property",
                      "start": 370,
                      "end": 372,
                      "method": false,
                      "shorthand": true,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 370,
                        "end": 372,
                        "name": "fn"
                      },
                      "kind": "init",
                      "value": {
                        "type": "Identifier",
                        "start": 370,
                        "end": 372,
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
            "start": 381,
            "end": 638,
            "id": {
              "type": "Identifier",
              "start": 390,
              "end": 394,
              "name": "test"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 397,
              "end": 638,
              "body": [
                {
                  "type": "VariableDeclaration",
                  "start": 407,
                  "end": 419,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 413,
                      "end": 418,
                      "id": {
                        "type": "Identifier",
                        "start": 413,
                        "end": 414,
                        "name": "t"
                      },
                      "init": {
                        "type": "Identifier",
                        "start": 417,
                        "end": 418,
                        "name": "f"
                      }
                    }
                  ],
                  "kind": "const"
                },
                {
                  "type": "ExpressionStatement",
                  "start": 428,
                  "end": 442,
                  "expression": {
                    "type": "CallExpression",
                    "start": 428,
                    "end": 442,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 428,
                      "end": 439,
                      "object": {
                        "type": "Identifier",
                        "start": 428,
                        "end": 435,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 436,
                        "end": 439,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 440,
                        "end": 441,
                        "name": "f"
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 451,
                  "end": 519,
                  "expression": {
                    "type": "AssignmentExpression",
                    "start": 451,
                    "end": 518,
                    "operator": "=",
                    "left": {
                      "type": "MemberExpression",
                      "start": 451,
                      "end": 459,
                      "object": {
                        "type": "Identifier",
                        "start": 451,
                        "end": 452,
                        "name": "f"
                      },
                      "property": {
                        "type": "Literal",
                        "start": 453,
                        "end": 458,
                        "value": "ggg",
                        "raw": "'ggg'"
                      },
                      "computed": true,
                      "optional": false
                    },
                    "right": {
                      "type": "BinaryExpression",
                      "start": 462,
                      "end": 518,
                      "left": {
                        "type": "Literal",
                        "start": 462,
                        "end": 463,
                        "value": 3,
                        "raw": "3"
                      },
                      "operator": "+",
                      "right": {
                        "type": "AssignmentExpression",
                        "start": 467,
                        "end": 517,
                        "operator": "=",
                        "left": {
                          "type": "Identifier",
                          "start": 467,
                          "end": 468,
                          "name": "f"
                        },
                        "right": {
                          "type": "AssignmentExpression",
                          "start": 471,
                          "end": 517,
                          "operator": "=",
                          "left": {
                            "type": "Identifier",
                            "start": 471,
                            "end": 472,
                            "name": "g"
                          },
                          "right": {
                            "type": "ObjectExpression",
                            "start": 475,
                            "end": 517,
                            "properties": [
                              {
                                "type": "Property",
                                "start": 477,
                                "end": 482,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 477,
                                  "end": 479,
                                  "name": "id"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 481,
                                  "end": 482,
                                  "value": 2,
                                  "raw": "2"
                                },
                                "kind": "init"
                              },
                              {
                                "type": "Property",
                                "start": 484,
                                "end": 489,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 484,
                                  "end": 486,
                                  "name": "ff"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 488,
                                  "end": 489,
                                  "value": 1,
                                  "raw": "1"
                                },
                                "kind": "init"
                              },
                              {
                                "type": "Property",
                                "start": 491,
                                "end": 515,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 491,
                                  "end": 495,
                                  "name": "text"
                                },
                                "value": {
                                  "type": "Literal",
                                  "start": 497,
                                  "end": 515,
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
                  "start": 528,
                  "end": 592,
                  "expression": {
                    "type": "CallExpression",
                    "start": 528,
                    "end": 591,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 528,
                      "end": 539,
                      "object": {
                        "type": "Identifier",
                        "start": 528,
                        "end": 535,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 536,
                        "end": 539,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 540,
                        "end": 547,
                        "value": "inner",
                        "raw": "'inner'"
                      },
                      {
                        "type": "Identifier",
                        "start": 549,
                        "end": 550,
                        "name": "f"
                      },
                      {
                        "type": "Identifier",
                        "start": 552,
                        "end": 553,
                        "name": "b"
                      },
                      {
                        "type": "Identifier",
                        "start": 555,
                        "end": 556,
                        "name": "t"
                      },
                      {
                        "type": "BinaryExpression",
                        "start": 558,
                        "end": 565,
                        "left": {
                          "type": "Identifier",
                          "start": 558,
                          "end": 559,
                          "name": "f"
                        },
                        "operator": "===",
                        "right": {
                          "type": "Identifier",
                          "start": 564,
                          "end": 565,
                          "name": "g"
                        }
                      },
                      {
                        "type": "BinaryExpression",
                        "start": 567,
                        "end": 581,
                        "left": {
                          "type": "Identifier",
                          "start": 567,
                          "end": 568,
                          "name": "f"
                        },
                        "operator": "===",
                        "right": {
                          "type": "MemberExpression",
                          "start": 573,
                          "end": 581,
                          "object": {
                            "type": "Identifier",
                            "start": 573,
                            "end": 579,
                            "name": "global"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 580,
                            "end": 581,
                            "name": "f"
                          },
                          "computed": false,
                          "optional": false
                        }
                      },
                      {
                        "type": "BinaryExpression",
                        "start": 583,
                        "end": 590,
                        "left": {
                          "type": "Identifier",
                          "start": 583,
                          "end": 584,
                          "name": "f"
                        },
                        "operator": "===",
                        "right": {
                          "type": "Identifier",
                          "start": 589,
                          "end": 590,
                          "name": "t"
                        }
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "VariableDeclaration",
                  "start": 601,
                  "end": 611,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 605,
                      "end": 610,
                      "id": {
                        "type": "Identifier",
                        "start": 605,
                        "end": 606,
                        "name": "c"
                      },
                      "init": {
                        "type": "Literal",
                        "start": 609,
                        "end": 610,
                        "value": 2,
                        "raw": "2"
                      }
                    }
                  ],
                  "kind": "let"
                },
                {
                  "type": "ExpressionStatement",
                  "start": 620,
                  "end": 630,
                  "expression": {
                    "type": "CallExpression",
                    "start": 620,
                    "end": 629,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 620,
                      "end": 624,
                      "object": {
                        "type": "Identifier",
                        "start": 620,
                        "end": 621,
                        "name": "b"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 622,
                        "end": 624,
                        "name": "fn"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "MemberExpression",
                        "start": 625,
                        "end": 628,
                        "object": {
                          "type": "Identifier",
                          "start": 625,
                          "end": 626,
                          "name": "b"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 627,
                          "end": 628,
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
            "start": 645,
            "end": 668,
            "expression": {
              "type": "CallExpression",
              "start": 645,
              "end": 668,
              "callee": {
                "type": "MemberExpression",
                "start": 645,
                "end": 656,
                "object": {
                  "type": "Identifier",
                  "start": 645,
                  "end": 652,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 653,
                  "end": 656,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 657,
                  "end": 664,
                  "value": "outer",
                  "raw": "'outer'"
                },
                {
                  "type": "Identifier",
                  "start": 666,
                  "end": 667,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 675,
            "end": 682,
            "expression": {
              "type": "CallExpression",
              "start": 675,
              "end": 681,
              "callee": {
                "type": "Identifier",
                "start": 675,
                "end": 679,
                "name": "test"
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 689,
            "end": 718,
            "expression": {
              "type": "CallExpression",
              "start": 689,
              "end": 718,
              "callee": {
                "type": "MemberExpression",
                "start": 689,
                "end": 700,
                "object": {
                  "type": "Identifier",
                  "start": 689,
                  "end": 696,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 697,
                  "end": 700,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 701,
                  "end": 714,
                  "value": "outer after",
                  "raw": "'outer after'"
                },
                {
                  "type": "Identifier",
                  "start": 716,
                  "end": 717,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 725,
            "end": 733,
            "expression": {
              "type": "CallExpression",
              "start": 725,
              "end": 732,
              "callee": {
                "type": "MemberExpression",
                "start": 725,
                "end": 729,
                "object": {
                  "type": "Identifier",
                  "start": 725,
                  "end": 726,
                  "name": "b"
                },
                "property": {
                  "type": "Identifier",
                  "start": 727,
                  "end": 729,
                  "name": "fn"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 730,
                  "end": 731,
                  "name": "f"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 740,
            "end": 745,
            "expression": {
              "type": "CallExpression",
              "start": 740,
              "end": 745,
              "callee": {
                "type": "Identifier",
                "start": 740,
                "end": 742,
                "name": "fn"
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 743,
                  "end": 744,
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
      "start": 756,
      "end": 763,
      "expression": {
        "type": "CallExpression",
        "start": 756,
        "end": 763,
        "callee": {
          "type": "Identifier",
          "start": 756,
          "end": 761,
          "name": "test1"
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}