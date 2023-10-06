const _setClassCode = `
class Set{
  constructor(t = []) {
    this.value = []
    for(const x of t) {
      this.add(x)
    }
  }
  
  add(x) {
    if (!this.has(x)) {
        this.value.push(x)
      }
  }
  
  has(x) {
    return this.value.includes(x)
  }
  
  clear(){
    this.value.splice(0, this.value.length)
  }
  
  delete(x) {
    const i = this.value.indexOf(x)
    if (i > -1) {
       this.value.splice(i, 1)
    }
  }
  
  keys() {
    return this.value
  }
  
  get size() {
    return this.value.length
  }
  
  forEach(cb) {
    this.value.forEach(cb)
  }
  
  entries() {
    const _this = this;
    return (function * () {
      let i = 0;
    while(i < _this.value.length) {
      const t = _this.value[i]
      yield [t, t]
      i++
    }
    })()
  }
  
  *[Symbol.iterator]() {
    let i = 0;
    while(i < this.value.length) {
      yield this.value[i++]
    }
  }
}
`

export const _SetClassAst = {
  "type": "ClassDeclaration",
  "start": 0,
  "end": 869,
  "id": {
    "type": "Identifier",
    "start": 6,
    "end": 9,
    "name": "Set"
  },
  "superClass": null,
  "body": {
    "type": "ClassBody",
    "start": 9,
    "end": 869,
    "body": [
      {
        "type": "MethodDefinition",
        "start": 13,
        "end": 106,
        "static": false,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 13,
          "end": 24,
          "name": "constructor"
        },
        "kind": "constructor",
        "value": {
          "type": "FunctionExpression",
          "start": 24,
          "end": 106,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "AssignmentPattern",
              "start": 25,
              "end": 31,
              "left": {
                "type": "Identifier",
                "start": 25,
                "end": 26,
                "name": "t"
              },
              "right": {
                "type": "ArrayExpression",
                "start": 29,
                "end": 31,
                "elements": []
              }
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 33,
            "end": 106,
            "body": [
              {
                "type": "ExpressionStatement",
                "start": 39,
                "end": 54,
                "expression": {
                  "type": "AssignmentExpression",
                  "start": 39,
                  "end": 54,
                  "operator": "=",
                  "left": {
                    "type": "MemberExpression",
                    "start": 39,
                    "end": 49,
                    "object": {
                      "type": "ThisExpression",
                      "start": 39,
                      "end": 43
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 44,
                      "end": 49,
                      "name": "value"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "right": {
                    "type": "ArrayExpression",
                    "start": 52,
                    "end": 54,
                    "elements": []
                  }
                }
              },
              {
                "type": "ForOfStatement",
                "start": 59,
                "end": 102,
                "await": false,
                "left": {
                  "type": "VariableDeclaration",
                  "start": 63,
                  "end": 70,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 69,
                      "end": 70,
                      "id": {
                        "type": "Identifier",
                        "start": 69,
                        "end": 70,
                        "name": "x"
                      },
                      "init": null
                    }
                  ],
                  "kind": "const"
                },
                "right": {
                  "type": "Identifier",
                  "start": 74,
                  "end": 75,
                  "name": "t"
                },
                "body": {
                  "type": "BlockStatement",
                  "start": 77,
                  "end": 102,
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "start": 85,
                      "end": 96,
                      "expression": {
                        "type": "CallExpression",
                        "start": 85,
                        "end": 96,
                        "callee": {
                          "type": "MemberExpression",
                          "start": 85,
                          "end": 93,
                          "object": {
                            "type": "ThisExpression",
                            "start": 85,
                            "end": 89
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 90,
                            "end": 93,
                            "name": "add"
                          },
                          "computed": false,
                          "optional": false
                        },
                        "arguments": [
                          {
                            "type": "Identifier",
                            "start": 94,
                            "end": 95,
                            "name": "x"
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
      },
      {
        "type": "MethodDefinition",
        "start": 112,
        "end": 183,
        "static": false,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 112,
          "end": 115,
          "name": "add"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 115,
          "end": 183,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "Identifier",
              "start": 116,
              "end": 117,
              "name": "x"
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 119,
            "end": 183,
            "body": [
              {
                "type": "IfStatement",
                "start": 125,
                "end": 179,
                "test": {
                  "type": "UnaryExpression",
                  "start": 129,
                  "end": 141,
                  "operator": "!",
                  "prefix": true,
                  "argument": {
                    "type": "CallExpression",
                    "start": 130,
                    "end": 141,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 130,
                      "end": 138,
                      "object": {
                        "type": "ThisExpression",
                        "start": 130,
                        "end": 134
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 135,
                        "end": 138,
                        "name": "has"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 139,
                        "end": 140,
                        "name": "x"
                      }
                    ],
                    "optional": false
                  }
                },
                "consequent": {
                  "type": "BlockStatement",
                  "start": 143,
                  "end": 179,
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "start": 153,
                      "end": 171,
                      "expression": {
                        "type": "CallExpression",
                        "start": 153,
                        "end": 171,
                        "callee": {
                          "type": "MemberExpression",
                          "start": 153,
                          "end": 168,
                          "object": {
                            "type": "MemberExpression",
                            "start": 153,
                            "end": 163,
                            "object": {
                              "type": "ThisExpression",
                              "start": 153,
                              "end": 157
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 158,
                              "end": 163,
                              "name": "value"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 164,
                            "end": 168,
                            "name": "push"
                          },
                          "computed": false,
                          "optional": false
                        },
                        "arguments": [
                          {
                            "type": "Identifier",
                            "start": 169,
                            "end": 170,
                            "name": "x"
                          }
                        ],
                        "optional": false
                      }
                    }
                  ]
                },
                "alternate": null
              }
            ]
          }
        }
      },
      {
        "type": "MethodDefinition",
        "start": 189,
        "end": 235,
        "static": false,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 189,
          "end": 192,
          "name": "has"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 192,
          "end": 235,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "Identifier",
              "start": 193,
              "end": 194,
              "name": "x"
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 196,
            "end": 235,
            "body": [
              {
                "type": "ReturnStatement",
                "start": 202,
                "end": 231,
                "argument": {
                  "type": "CallExpression",
                  "start": 209,
                  "end": 231,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 209,
                    "end": 228,
                    "object": {
                      "type": "MemberExpression",
                      "start": 209,
                      "end": 219,
                      "object": {
                        "type": "ThisExpression",
                        "start": 209,
                        "end": 213
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 214,
                        "end": 219,
                        "name": "value"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 220,
                      "end": 228,
                      "name": "includes"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "Identifier",
                      "start": 229,
                      "end": 230,
                      "name": "x"
                    }
                  ],
                  "optional": false
                }
              }
            ]
          }
        }
      },
      {
        "type": "MethodDefinition",
        "start": 241,
        "end": 297,
        "static": false,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 241,
          "end": 246,
          "name": "clear"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 246,
          "end": 297,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [],
          "body": {
            "type": "BlockStatement",
            "start": 248,
            "end": 297,
            "body": [
              {
                "type": "ExpressionStatement",
                "start": 254,
                "end": 293,
                "expression": {
                  "type": "CallExpression",
                  "start": 254,
                  "end": 293,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 254,
                    "end": 271,
                    "object": {
                      "type": "MemberExpression",
                      "start": 254,
                      "end": 264,
                      "object": {
                        "type": "ThisExpression",
                        "start": 254,
                        "end": 258
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 259,
                        "end": 264,
                        "name": "value"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 265,
                      "end": 271,
                      "name": "splice"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "start": 272,
                      "end": 273,
                      "value": 0,
                      "raw": "0"
                    },
                    {
                      "type": "MemberExpression",
                      "start": 275,
                      "end": 292,
                      "object": {
                        "type": "MemberExpression",
                        "start": 275,
                        "end": 285,
                        "object": {
                          "type": "ThisExpression",
                          "start": 275,
                          "end": 279
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 280,
                          "end": 285,
                          "name": "value"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 286,
                        "end": 292,
                        "name": "length"
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
      },
      {
        "type": "MethodDefinition",
        "start": 303,
        "end": 409,
        "static": false,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 303,
          "end": 309,
          "name": "delete"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 309,
          "end": 409,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "Identifier",
              "start": 310,
              "end": 311,
              "name": "x"
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 313,
            "end": 409,
            "body": [
              {
                "type": "VariableDeclaration",
                "start": 319,
                "end": 350,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 325,
                    "end": 350,
                    "id": {
                      "type": "Identifier",
                      "start": 325,
                      "end": 326,
                      "name": "i"
                    },
                    "init": {
                      "type": "CallExpression",
                      "start": 329,
                      "end": 350,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 329,
                        "end": 347,
                        "object": {
                          "type": "MemberExpression",
                          "start": 329,
                          "end": 339,
                          "object": {
                            "type": "ThisExpression",
                            "start": 329,
                            "end": 333
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 334,
                            "end": 339,
                            "name": "value"
                          },
                          "computed": false,
                          "optional": false
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 340,
                          "end": 347,
                          "name": "indexOf"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "Identifier",
                          "start": 348,
                          "end": 349,
                          "name": "x"
                        }
                      ],
                      "optional": false
                    }
                  }
                ],
                "kind": "const"
              },
              {
                "type": "IfStatement",
                "start": 355,
                "end": 405,
                "test": {
                  "type": "BinaryExpression",
                  "start": 359,
                  "end": 365,
                  "left": {
                    "type": "Identifier",
                    "start": 359,
                    "end": 360,
                    "name": "i"
                  },
                  "operator": ">",
                  "right": {
                    "type": "UnaryExpression",
                    "start": 363,
                    "end": 365,
                    "operator": "-",
                    "prefix": true,
                    "argument": {
                      "type": "Literal",
                      "start": 364,
                      "end": 365,
                      "value": 1,
                      "raw": "1"
                    }
                  }
                },
                "consequent": {
                  "type": "BlockStatement",
                  "start": 367,
                  "end": 405,
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "start": 376,
                      "end": 399,
                      "expression": {
                        "type": "CallExpression",
                        "start": 376,
                        "end": 399,
                        "callee": {
                          "type": "MemberExpression",
                          "start": 376,
                          "end": 393,
                          "object": {
                            "type": "MemberExpression",
                            "start": 376,
                            "end": 386,
                            "object": {
                              "type": "ThisExpression",
                              "start": 376,
                              "end": 380
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 381,
                              "end": 386,
                              "name": "value"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 387,
                            "end": 393,
                            "name": "splice"
                          },
                          "computed": false,
                          "optional": false
                        },
                        "arguments": [
                          {
                            "type": "Identifier",
                            "start": 394,
                            "end": 395,
                            "name": "i"
                          },
                          {
                            "type": "Literal",
                            "start": 397,
                            "end": 398,
                            "value": 1,
                            "raw": "1"
                          }
                        ],
                        "optional": false
                      }
                    }
                  ]
                },
                "alternate": null
              }
            ]
          }
        }
      },
      {
        "type": "MethodDefinition",
        "start": 415,
        "end": 449,
        "static": false,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 415,
          "end": 419,
          "name": "keys"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 419,
          "end": 449,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [],
          "body": {
            "type": "BlockStatement",
            "start": 422,
            "end": 449,
            "body": [
              {
                "type": "ReturnStatement",
                "start": 428,
                "end": 445,
                "argument": {
                  "type": "MemberExpression",
                  "start": 435,
                  "end": 445,
                  "object": {
                    "type": "ThisExpression",
                    "start": 435,
                    "end": 439
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 440,
                    "end": 445,
                    "name": "value"
                  },
                  "computed": false,
                  "optional": false
                }
              }
            ]
          }
        }
      },
      {
        "type": "MethodDefinition",
        "start": 455,
        "end": 500,
        "static": false,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 459,
          "end": 463,
          "name": "size"
        },
        "kind": "get",
        "value": {
          "type": "FunctionExpression",
          "start": 463,
          "end": 500,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [],
          "body": {
            "type": "BlockStatement",
            "start": 466,
            "end": 500,
            "body": [
              {
                "type": "ReturnStatement",
                "start": 472,
                "end": 496,
                "argument": {
                  "type": "MemberExpression",
                  "start": 479,
                  "end": 496,
                  "object": {
                    "type": "MemberExpression",
                    "start": 479,
                    "end": 489,
                    "object": {
                      "type": "ThisExpression",
                      "start": 479,
                      "end": 483
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 484,
                      "end": 489,
                      "name": "value"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 490,
                    "end": 496,
                    "name": "length"
                  },
                  "computed": false,
                  "optional": false
                }
              }
            ]
          }
        }
      },
      {
        "type": "MethodDefinition",
        "start": 506,
        "end": 550,
        "static": false,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 506,
          "end": 513,
          "name": "forEach"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 513,
          "end": 550,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "Identifier",
              "start": 514,
              "end": 516,
              "name": "cb"
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 518,
            "end": 550,
            "body": [
              {
                "type": "ExpressionStatement",
                "start": 524,
                "end": 546,
                "expression": {
                  "type": "CallExpression",
                  "start": 524,
                  "end": 546,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 524,
                    "end": 542,
                    "object": {
                      "type": "MemberExpression",
                      "start": 524,
                      "end": 534,
                      "object": {
                        "type": "ThisExpression",
                        "start": 524,
                        "end": 528
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 529,
                        "end": 534,
                        "name": "value"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 535,
                      "end": 542,
                      "name": "forEach"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "Identifier",
                      "start": 543,
                      "end": 545,
                      "name": "cb"
                    }
                  ],
                  "optional": false
                }
              }
            ]
          }
        }
      },
      {
        "type": "MethodDefinition",
        "start": 556,
        "end": 751,
        "static": false,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 556,
          "end": 563,
          "name": "entries"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 563,
          "end": 751,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [],
          "body": {
            "type": "BlockStatement",
            "start": 566,
            "end": 751,
            "body": [
              {
                "type": "VariableDeclaration",
                "start": 572,
                "end": 591,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 578,
                    "end": 590,
                    "id": {
                      "type": "Identifier",
                      "start": 578,
                      "end": 583,
                      "name": "_this"
                    },
                    "init": {
                      "type": "ThisExpression",
                      "start": 586,
                      "end": 590
                    }
                  }
                ],
                "kind": "const"
              },
              {
                "type": "ReturnStatement",
                "start": 596,
                "end": 747,
                "argument": {
                  "type": "CallExpression",
                  "start": 603,
                  "end": 747,
                  "callee": {
                    "type": "FunctionExpression",
                    "start": 604,
                    "end": 744,
                    "id": null,
                    "expression": false,
                    "generator": true,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "start": 618,
                      "end": 744,
                      "body": [
                        {
                          "type": "VariableDeclaration",
                          "start": 626,
                          "end": 636,
                          "declarations": [
                            {
                              "type": "VariableDeclarator",
                              "start": 630,
                              "end": 635,
                              "id": {
                                "type": "Identifier",
                                "start": 630,
                                "end": 631,
                                "name": "i"
                              },
                              "init": {
                                "type": "Literal",
                                "start": 634,
                                "end": 635,
                                "value": 0,
                                "raw": "0"
                              }
                            }
                          ],
                          "kind": "let"
                        },
                        {
                          "type": "WhileStatement",
                          "start": 641,
                          "end": 738,
                          "test": {
                            "type": "BinaryExpression",
                            "start": 647,
                            "end": 669,
                            "left": {
                              "type": "Identifier",
                              "start": 647,
                              "end": 648,
                              "name": "i"
                            },
                            "operator": "<",
                            "right": {
                              "type": "MemberExpression",
                              "start": 651,
                              "end": 669,
                              "object": {
                                "type": "MemberExpression",
                                "start": 651,
                                "end": 662,
                                "object": {
                                  "type": "Identifier",
                                  "start": 651,
                                  "end": 656,
                                  "name": "_this"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 657,
                                  "end": 662,
                                  "name": "value"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 663,
                                "end": 669,
                                "name": "length"
                              },
                              "computed": false,
                              "optional": false
                            }
                          },
                          "body": {
                            "type": "BlockStatement",
                            "start": 671,
                            "end": 738,
                            "body": [
                              {
                                "type": "VariableDeclaration",
                                "start": 679,
                                "end": 703,
                                "declarations": [
                                  {
                                    "type": "VariableDeclarator",
                                    "start": 685,
                                    "end": 703,
                                    "id": {
                                      "type": "Identifier",
                                      "start": 685,
                                      "end": 686,
                                      "name": "t"
                                    },
                                    "init": {
                                      "type": "MemberExpression",
                                      "start": 689,
                                      "end": 703,
                                      "object": {
                                        "type": "MemberExpression",
                                        "start": 689,
                                        "end": 700,
                                        "object": {
                                          "type": "Identifier",
                                          "start": 689,
                                          "end": 694,
                                          "name": "_this"
                                        },
                                        "property": {
                                          "type": "Identifier",
                                          "start": 695,
                                          "end": 700,
                                          "name": "value"
                                        },
                                        "computed": false,
                                        "optional": false
                                      },
                                      "property": {
                                        "type": "Identifier",
                                        "start": 701,
                                        "end": 702,
                                        "name": "i"
                                      },
                                      "computed": true,
                                      "optional": false
                                    }
                                  }
                                ],
                                "kind": "const"
                              },
                              {
                                "type": "ExpressionStatement",
                                "start": 710,
                                "end": 722,
                                "expression": {
                                  "type": "YieldExpression",
                                  "start": 710,
                                  "end": 722,
                                  "delegate": false,
                                  "argument": {
                                    "type": "ArrayExpression",
                                    "start": 716,
                                    "end": 722,
                                    "elements": [
                                      {
                                        "type": "Identifier",
                                        "start": 717,
                                        "end": 718,
                                        "name": "t"
                                      },
                                      {
                                        "type": "Identifier",
                                        "start": 720,
                                        "end": 721,
                                        "name": "t"
                                      }
                                    ]
                                  }
                                }
                              },
                              {
                                "type": "ExpressionStatement",
                                "start": 729,
                                "end": 732,
                                "expression": {
                                  "type": "UpdateExpression",
                                  "start": 729,
                                  "end": 732,
                                  "operator": "++",
                                  "prefix": false,
                                  "argument": {
                                    "type": "Identifier",
                                    "start": 729,
                                    "end": 730,
                                    "name": "i"
                                  }
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  },
                  "arguments": [],
                  "optional": false
                }
              }
            ]
          }
        }
      },
      {
        "type": "MethodDefinition",
        "start": 757,
        "end": 867,
        "static": false,
        "computed": true,
        "key": {
          "type": "MemberExpression",
          "start": 759,
          "end": 774,
          "object": {
            "type": "Identifier",
            "start": 759,
            "end": 765,
            "name": "Symbol"
          },
          "property": {
            "type": "Identifier",
            "start": 766,
            "end": 774,
            "name": "iterator"
          },
          "computed": false,
          "optional": false
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 775,
          "end": 867,
          "id": null,
          "expression": false,
          "generator": true,
          "async": false,
          "params": [],
          "body": {
            "type": "BlockStatement",
            "start": 778,
            "end": 867,
            "body": [
              {
                "type": "VariableDeclaration",
                "start": 784,
                "end": 794,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 788,
                    "end": 793,
                    "id": {
                      "type": "Identifier",
                      "start": 788,
                      "end": 789,
                      "name": "i"
                    },
                    "init": {
                      "type": "Literal",
                      "start": 792,
                      "end": 793,
                      "value": 0,
                      "raw": "0"
                    }
                  }
                ],
                "kind": "let"
              },
              {
                "type": "WhileStatement",
                "start": 799,
                "end": 863,
                "test": {
                  "type": "BinaryExpression",
                  "start": 805,
                  "end": 826,
                  "left": {
                    "type": "Identifier",
                    "start": 805,
                    "end": 806,
                    "name": "i"
                  },
                  "operator": "<",
                  "right": {
                    "type": "MemberExpression",
                    "start": 809,
                    "end": 826,
                    "object": {
                      "type": "MemberExpression",
                      "start": 809,
                      "end": 819,
                      "object": {
                        "type": "ThisExpression",
                        "start": 809,
                        "end": 813
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 814,
                        "end": 819,
                        "name": "value"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 820,
                      "end": 826,
                      "name": "length"
                    },
                    "computed": false,
                    "optional": false
                  }
                },
                "body": {
                  "type": "BlockStatement",
                  "start": 828,
                  "end": 863,
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "start": 836,
                      "end": 857,
                      "expression": {
                        "type": "YieldExpression",
                        "start": 836,
                        "end": 857,
                        "delegate": false,
                        "argument": {
                          "type": "MemberExpression",
                          "start": 842,
                          "end": 857,
                          "object": {
                            "type": "MemberExpression",
                            "start": 842,
                            "end": 852,
                            "object": {
                              "type": "ThisExpression",
                              "start": 842,
                              "end": 846
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 847,
                              "end": 852,
                              "name": "value"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "property": {
                            "type": "UpdateExpression",
                            "start": 853,
                            "end": 856,
                            "operator": "++",
                            "prefix": false,
                            "argument": {
                              "type": "Identifier",
                              "start": 853,
                              "end": 854,
                              "name": "i"
                            }
                          },
                          "computed": true,
                          "optional": false
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    ]
  }
}