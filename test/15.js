const code = `
function test () {
  const x = () => {
      console.log(this, this.g)
  } /* arrow function end */;
  const fn = function () {
      console.log(this, this.g)
  } /* function end */;
  const obj = {
      g : 'obj of g',
      x : () => {
          console.log(this, this.g)
      } /* arrow function end */,
      fn  () {
          console.log(this, this.g)
      } /* function end */
  };
  x()
  obj.x()
  fn()
  obj.fn()
  const t = obj.fn;
  t()
} /* function end */
g = 'window of g'
const obj2 = {
  g : 'obj2 of g',
  test
};
obj2.test()
`

export const _ast15 = {
  "type": "Program",
  "start": 0,
  "end": 593,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 496,
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
        "end": 496,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 23,
            "end": 106,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 29,
                "end": 80,
                "id": {
                  "type": "Identifier",
                  "start": 29,
                  "end": 30,
                  "name": "x"
                },
                "init": {
                  "type": "ArrowFunctionExpression",
                  "start": 33,
                  "end": 80,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "start": 39,
                    "end": 80,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 49,
                        "end": 74,
                        "expression": {
                          "type": "CallExpression",
                          "start": 49,
                          "end": 74,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 49,
                            "end": 60,
                            "object": {
                              "type": "Identifier",
                              "start": 49,
                              "end": 56,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 57,
                              "end": 60,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "ThisExpression",
                              "start": 61,
                              "end": 65
                            },
                            {
                              "type": "MemberExpression",
                              "start": 67,
                              "end": 73,
                              "object": {
                                "type": "ThisExpression",
                                "start": 67,
                                "end": 71
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 72,
                                "end": 73,
                                "name": "g"
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
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 111,
            "end": 195,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 117,
                "end": 175,
                "id": {
                  "type": "Identifier",
                  "start": 117,
                  "end": 119,
                  "name": "fn"
                },
                "init": {
                  "type": "FunctionExpression",
                  "start": 122,
                  "end": 175,
                  "id": null,
                  "expression": false,
                  "generator": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "start": 134,
                    "end": 175,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 144,
                        "end": 169,
                        "expression": {
                          "type": "CallExpression",
                          "start": 144,
                          "end": 169,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 144,
                            "end": 155,
                            "object": {
                              "type": "Identifier",
                              "start": 144,
                              "end": 151,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 152,
                              "end": 155,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "ThisExpression",
                              "start": 156,
                              "end": 160
                            },
                            {
                              "type": "MemberExpression",
                              "start": 162,
                              "end": 168,
                              "object": {
                                "type": "ThisExpression",
                                "start": 162,
                                "end": 166
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 167,
                                "end": 168,
                                "name": "g"
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
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 200,
            "end": 422,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 206,
                "end": 421,
                "id": {
                  "type": "Identifier",
                  "start": 206,
                  "end": 209,
                  "name": "obj"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 212,
                  "end": 421,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 222,
                      "end": 236,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 222,
                        "end": 223,
                        "name": "g"
                      },
                      "value": {
                        "type": "Literal",
                        "start": 226,
                        "end": 236,
                        "value": "obj of g",
                        "raw": "'obj of g'"
                      },
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 246,
                      "end": 305,
                      "method": false,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 246,
                        "end": 247,
                        "name": "x"
                      },
                      "value": {
                        "type": "ArrowFunctionExpression",
                        "start": 250,
                        "end": 305,
                        "id": null,
                        "expression": false,
                        "generator": false,
                        "async": false,
                        "params": [],
                        "body": {
                          "type": "BlockStatement",
                          "start": 256,
                          "end": 305,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 270,
                              "end": 295,
                              "expression": {
                                "type": "CallExpression",
                                "start": 270,
                                "end": 295,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 270,
                                  "end": 281,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 270,
                                    "end": 277,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 278,
                                    "end": 281,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "ThisExpression",
                                    "start": 282,
                                    "end": 286
                                  },
                                  {
                                    "type": "MemberExpression",
                                    "start": 288,
                                    "end": 294,
                                    "object": {
                                      "type": "ThisExpression",
                                      "start": 288,
                                      "end": 292
                                    },
                                    "property": {
                                      "type": "Identifier",
                                      "start": 293,
                                      "end": 294,
                                      "name": "g"
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
                      "kind": "init"
                    },
                    {
                      "type": "Property",
                      "start": 340,
                      "end": 396,
                      "method": true,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 340,
                        "end": 342,
                        "name": "fn"
                      },
                      "kind": "init",
                      "value": {
                        "type": "FunctionExpression",
                        "start": 344,
                        "end": 396,
                        "id": null,
                        "expression": false,
                        "generator": false,
                        "async": false,
                        "params": [],
                        "body": {
                          "type": "BlockStatement",
                          "start": 347,
                          "end": 396,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 361,
                              "end": 386,
                              "expression": {
                                "type": "CallExpression",
                                "start": 361,
                                "end": 386,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 361,
                                  "end": 372,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 361,
                                    "end": 368,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 369,
                                    "end": 372,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "ThisExpression",
                                    "start": 373,
                                    "end": 377
                                  },
                                  {
                                    "type": "MemberExpression",
                                    "start": 379,
                                    "end": 385,
                                    "object": {
                                      "type": "ThisExpression",
                                      "start": 379,
                                      "end": 383
                                    },
                                    "property": {
                                      "type": "Identifier",
                                      "start": 384,
                                      "end": 385,
                                      "name": "g"
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
                      }
                    }
                  ]
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 427,
            "end": 430,
            "expression": {
              "type": "CallExpression",
              "start": 427,
              "end": 430,
              "callee": {
                "type": "Identifier",
                "start": 427,
                "end": 428,
                "name": "x"
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 435,
            "end": 442,
            "expression": {
              "type": "CallExpression",
              "start": 435,
              "end": 442,
              "callee": {
                "type": "MemberExpression",
                "start": 435,
                "end": 440,
                "object": {
                  "type": "Identifier",
                  "start": 435,
                  "end": 438,
                  "name": "obj"
                },
                "property": {
                  "type": "Identifier",
                  "start": 439,
                  "end": 440,
                  "name": "x"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 447,
            "end": 451,
            "expression": {
              "type": "CallExpression",
              "start": 447,
              "end": 451,
              "callee": {
                "type": "Identifier",
                "start": 447,
                "end": 449,
                "name": "fn"
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 456,
            "end": 464,
            "expression": {
              "type": "CallExpression",
              "start": 456,
              "end": 464,
              "callee": {
                "type": "MemberExpression",
                "start": 456,
                "end": 462,
                "object": {
                  "type": "Identifier",
                  "start": 456,
                  "end": 459,
                  "name": "obj"
                },
                "property": {
                  "type": "Identifier",
                  "start": 460,
                  "end": 462,
                  "name": "fn"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 469,
            "end": 486,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 475,
                "end": 485,
                "id": {
                  "type": "Identifier",
                  "start": 475,
                  "end": 476,
                  "name": "t"
                },
                "init": {
                  "type": "MemberExpression",
                  "start": 479,
                  "end": 485,
                  "object": {
                    "type": "Identifier",
                    "start": 479,
                    "end": 482,
                    "name": "obj"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 483,
                    "end": 485,
                    "name": "fn"
                  },
                  "computed": false,
                  "optional": false
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 491,
            "end": 494,
            "expression": {
              "type": "CallExpression",
              "start": 491,
              "end": 494,
              "callee": {
                "type": "Identifier",
                "start": 491,
                "end": 492,
                "name": "t"
              },
              "arguments": [],
              "optional": false
            }
          }
        ]
      }
    },
    {
      "type": "ExpressionStatement",
      "start": 516,
      "end": 533,
      "expression": {
        "type": "AssignmentExpression",
        "start": 516,
        "end": 533,
        "operator": "=",
        "left": {
          "type": "Identifier",
          "start": 516,
          "end": 517,
          "name": "g"
        },
        "right": {
          "type": "Literal",
          "start": 520,
          "end": 533,
          "value": "window of g",
          "raw": "'window of g'"
        }
      }
    },
    {
      "type": "VariableDeclaration",
      "start": 534,
      "end": 581,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 540,
          "end": 580,
          "id": {
            "type": "Identifier",
            "start": 540,
            "end": 544,
            "name": "obj2"
          },
          "init": {
            "type": "ObjectExpression",
            "start": 547,
            "end": 580,
            "properties": [
              {
                "type": "Property",
                "start": 553,
                "end": 568,
                "method": false,
                "shorthand": false,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 553,
                  "end": 554,
                  "name": "g"
                },
                "value": {
                  "type": "Literal",
                  "start": 557,
                  "end": 568,
                  "value": "obj2 of g",
                  "raw": "'obj2 of g'"
                },
                "kind": "init"
              },
              {
                "type": "Property",
                "start": 574,
                "end": 578,
                "method": false,
                "shorthand": true,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 574,
                  "end": 578,
                  "name": "test"
                },
                "kind": "init",
                "value": {
                  "type": "Identifier",
                  "start": 574,
                  "end": 578,
                  "name": "test"
                }
              }
            ]
          }
        }
      ],
      "kind": "const"
    },
    {
      "type": "ExpressionStatement",
      "start": 582,
      "end": 593,
      "expression": {
        "type": "CallExpression",
        "start": 582,
        "end": 593,
        "callee": {
          "type": "MemberExpression",
          "start": 582,
          "end": 591,
          "object": {
            "type": "Identifier",
            "start": 582,
            "end": 586,
            "name": "obj2"
          },
          "property": {
            "type": "Identifier",
            "start": 587,
            "end": 591,
            "name": "test"
          },
          "computed": false,
          "optional": false
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}