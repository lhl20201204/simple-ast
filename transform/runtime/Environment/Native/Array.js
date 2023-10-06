const code = `
Array.prototype[Symbol.iterator] = function * Array$Symbol$iterator() {
  let i = 0;
  while(i < this.length) {
    yield this[i++]
  }
}
`

const code2 = `Array.prototype.map = function (cb) {
  const arr = []
  let i = 0;
  for(const x of this) {
    arr.push(cb(x, i++, this))
  }
  return arr;
}

Array.prototype.filter =function (cb) {
  const arr = []
  let i = 0;
  for(const x of this) {
    if(cb(x, i++, this)) {
      arr.push(x)
    }
  }
  return arr;
}

Array.prototype.reduce = function (cb, init) {
  const arr = []
  let i = 0;
  let sum = init;
  for(const x of this) {
    if (sum === void 0 && i === 0) {
      sum = x;
    } else {
      sum = cb(sum, x, i, this)
    }
    i++
  }
  return sum;
}

Array.prototype.indexOf = function (x) {
  let i =0;
  for(const t of this ) {
    if (t === x) {
      return i
    }
    i++;
  }
  return -1
}

Array.prototype.slice = function slice(start, end) {
  const nil = void 0;
  if (start === nil && end === nil) {
    return [...this];
  }

  // 将负数索引转换为正数索引
  var length = this.length;
  start = start >= 0 ? start : length + start;
  end = end !== nil ? (end >= 0 ? end : length + end) : length;

  var result = [];
  for (var i = start; i < end; i++) {
    result.push(this[i]);
  }
  return result;
}

Array.prototype.includes = function (x) {
  for(const t of this ) {
    if (t === x) {
      return true
    }
  }
  return false
}
`
export const _arrayMapAst = {
  "type": "ExpressionStatement",
  "start": 1,
  "end": 144,
  "expression": {
    "type": "AssignmentExpression",
    "start": 1,
    "end": 144,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 1,
      "end": 20,
      "object": {
        "type": "MemberExpression",
        "start": 1,
        "end": 16,
        "object": {
          "type": "Identifier",
          "start": 1,
          "end": 6,
          "name": "Array"
        },
        "property": {
          "type": "Identifier",
          "start": 7,
          "end": 16,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "Identifier",
        "start": 17,
        "end": 20,
        "name": "map"
      },
      "computed": false,
      "optional": false
    },
    "right": {
      "type": "FunctionExpression",
      "start": 23,
      "end": 144,
      "id": null,
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 33,
          "end": 35,
          "name": "cb"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 37,
        "end": 144,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 41,
            "end": 55,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 47,
                "end": 55,
                "id": {
                  "type": "Identifier",
                  "start": 47,
                  "end": 50,
                  "name": "arr"
                },
                "init": {
                  "type": "ArrayExpression",
                  "start": 53,
                  "end": 55,
                  "elements": []
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 58,
            "end": 68,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 62,
                "end": 67,
                "id": {
                  "type": "Identifier",
                  "start": 62,
                  "end": 63,
                  "name": "i"
                },
                "init": {
                  "type": "Literal",
                  "start": 66,
                  "end": 67,
                  "value": 0,
                  "raw": "0"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "ForOfStatement",
            "start": 71,
            "end": 128,
            "await": false,
            "left": {
              "type": "VariableDeclaration",
              "start": 75,
              "end": 82,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 81,
                  "end": 82,
                  "id": {
                    "type": "Identifier",
                    "start": 81,
                    "end": 82,
                    "name": "x"
                  },
                  "init": null
                }
              ],
              "kind": "const"
            },
            "right": {
              "type": "ThisExpression",
              "start": 86,
              "end": 90
            },
            "body": {
              "type": "BlockStatement",
              "start": 92,
              "end": 128,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 98,
                  "end": 124,
                  "expression": {
                    "type": "CallExpression",
                    "start": 98,
                    "end": 124,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 98,
                      "end": 106,
                      "object": {
                        "type": "Identifier",
                        "start": 98,
                        "end": 101,
                        "name": "arr"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 102,
                        "end": 106,
                        "name": "push"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "CallExpression",
                        "start": 107,
                        "end": 123,
                        "callee": {
                          "type": "Identifier",
                          "start": 107,
                          "end": 109,
                          "name": "cb"
                        },
                        "arguments": [
                          {
                            "type": "Identifier",
                            "start": 110,
                            "end": 111,
                            "name": "x"
                          },
                          {
                            "type": "UpdateExpression",
                            "start": 113,
                            "end": 116,
                            "operator": "++",
                            "prefix": false,
                            "argument": {
                              "type": "Identifier",
                              "start": 113,
                              "end": 114,
                              "name": "i"
                            }
                          },
                          {
                            "type": "ThisExpression",
                            "start": 118,
                            "end": 122
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
            "type": "ReturnStatement",
            "start": 131,
            "end": 142,
            "argument": {
              "type": "Identifier",
              "start": 138,
              "end": 141,
              "name": "arr"
            }
          }
        ]
      }
    }
  }
}

export const _arrayFilterAst = {
  "type": "ExpressionStatement",
  "start": 146,
  "end": 311,
  "expression": {
    "type": "AssignmentExpression",
    "start": 146,
    "end": 311,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 146,
      "end": 168,
      "object": {
        "type": "MemberExpression",
        "start": 146,
        "end": 161,
        "object": {
          "type": "Identifier",
          "start": 146,
          "end": 151,
          "name": "Array"
        },
        "property": {
          "type": "Identifier",
          "start": 152,
          "end": 161,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "Identifier",
        "start": 162,
        "end": 168,
        "name": "filter"
      },
      "computed": false,
      "optional": false
    },
    "right": {
      "type": "FunctionExpression",
      "start": 170,
      "end": 311,
      "id": null,
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 180,
          "end": 182,
          "name": "cb"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 184,
        "end": 311,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 188,
            "end": 202,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 194,
                "end": 202,
                "id": {
                  "type": "Identifier",
                  "start": 194,
                  "end": 197,
                  "name": "arr"
                },
                "init": {
                  "type": "ArrayExpression",
                  "start": 200,
                  "end": 202,
                  "elements": []
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 205,
            "end": 215,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 209,
                "end": 214,
                "id": {
                  "type": "Identifier",
                  "start": 209,
                  "end": 210,
                  "name": "i"
                },
                "init": {
                  "type": "Literal",
                  "start": 213,
                  "end": 214,
                  "value": 0,
                  "raw": "0"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "ForOfStatement",
            "start": 218,
            "end": 295,
            "await": false,
            "left": {
              "type": "VariableDeclaration",
              "start": 222,
              "end": 229,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 228,
                  "end": 229,
                  "id": {
                    "type": "Identifier",
                    "start": 228,
                    "end": 229,
                    "name": "x"
                  },
                  "init": null
                }
              ],
              "kind": "const"
            },
            "right": {
              "type": "ThisExpression",
              "start": 233,
              "end": 237
            },
            "body": {
              "type": "BlockStatement",
              "start": 239,
              "end": 295,
              "body": [
                {
                  "type": "IfStatement",
                  "start": 245,
                  "end": 291,
                  "test": {
                    "type": "CallExpression",
                    "start": 248,
                    "end": 264,
                    "callee": {
                      "type": "Identifier",
                      "start": 248,
                      "end": 250,
                      "name": "cb"
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 251,
                        "end": 252,
                        "name": "x"
                      },
                      {
                        "type": "UpdateExpression",
                        "start": 254,
                        "end": 257,
                        "operator": "++",
                        "prefix": false,
                        "argument": {
                          "type": "Identifier",
                          "start": 254,
                          "end": 255,
                          "name": "i"
                        }
                      },
                      {
                        "type": "ThisExpression",
                        "start": 259,
                        "end": 263
                      }
                    ],
                    "optional": false
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 266,
                    "end": 291,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 274,
                        "end": 285,
                        "expression": {
                          "type": "CallExpression",
                          "start": 274,
                          "end": 285,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 274,
                            "end": 282,
                            "object": {
                              "type": "Identifier",
                              "start": 274,
                              "end": 277,
                              "name": "arr"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 278,
                              "end": 282,
                              "name": "push"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 283,
                              "end": 284,
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
          },
          {
            "type": "ReturnStatement",
            "start": 298,
            "end": 309,
            "argument": {
              "type": "Identifier",
              "start": 305,
              "end": 308,
              "name": "arr"
            }
          }
        ]
      }
    }
  }
}

export const _arrayReduceAst = {
  "type": "ExpressionStatement",
  "start": 313,
  "end": 563,
  "expression": {
    "type": "AssignmentExpression",
    "start": 313,
    "end": 563,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 313,
      "end": 335,
      "object": {
        "type": "MemberExpression",
        "start": 313,
        "end": 328,
        "object": {
          "type": "Identifier",
          "start": 313,
          "end": 318,
          "name": "Array"
        },
        "property": {
          "type": "Identifier",
          "start": 319,
          "end": 328,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "Identifier",
        "start": 329,
        "end": 335,
        "name": "reduce"
      },
      "computed": false,
      "optional": false
    },
    "right": {
      "type": "FunctionExpression",
      "start": 338,
      "end": 563,
      "id": null,
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 348,
          "end": 350,
          "name": "cb"
        },
        {
          "type": "Identifier",
          "start": 352,
          "end": 356,
          "name": "init"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 358,
        "end": 563,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 362,
            "end": 376,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 368,
                "end": 376,
                "id": {
                  "type": "Identifier",
                  "start": 368,
                  "end": 371,
                  "name": "arr"
                },
                "init": {
                  "type": "ArrayExpression",
                  "start": 374,
                  "end": 376,
                  "elements": []
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 379,
            "end": 389,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 383,
                "end": 388,
                "id": {
                  "type": "Identifier",
                  "start": 383,
                  "end": 384,
                  "name": "i"
                },
                "init": {
                  "type": "Literal",
                  "start": 387,
                  "end": 388,
                  "value": 0,
                  "raw": "0"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "VariableDeclaration",
            "start": 392,
            "end": 407,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 396,
                "end": 406,
                "id": {
                  "type": "Identifier",
                  "start": 396,
                  "end": 399,
                  "name": "sum"
                },
                "init": {
                  "type": "Identifier",
                  "start": 402,
                  "end": 406,
                  "name": "init"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "ForOfStatement",
            "start": 410,
            "end": 547,
            "await": false,
            "left": {
              "type": "VariableDeclaration",
              "start": 414,
              "end": 421,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 420,
                  "end": 421,
                  "id": {
                    "type": "Identifier",
                    "start": 420,
                    "end": 421,
                    "name": "x"
                  },
                  "init": null
                }
              ],
              "kind": "const"
            },
            "right": {
              "type": "ThisExpression",
              "start": 425,
              "end": 429
            },
            "body": {
              "type": "BlockStatement",
              "start": 431,
              "end": 547,
              "body": [
                {
                  "type": "IfStatement",
                  "start": 437,
                  "end": 535,
                  "test": {
                    "type": "LogicalExpression",
                    "start": 441,
                    "end": 466,
                    "left": {
                      "type": "BinaryExpression",
                      "start": 441,
                      "end": 455,
                      "left": {
                        "type": "Identifier",
                        "start": 441,
                        "end": 444,
                        "name": "sum"
                      },
                      "operator": "===",
                      "right": {
                        "type": "UnaryExpression",
                        "start": 449,
                        "end": 455,
                        "operator": "void",
                        "prefix": true,
                        "argument": {
                          "type": "Literal",
                          "start": 454,
                          "end": 455,
                          "value": 0,
                          "raw": "0"
                        }
                      }
                    },
                    "operator": "&&",
                    "right": {
                      "type": "BinaryExpression",
                      "start": 459,
                      "end": 466,
                      "left": {
                        "type": "Identifier",
                        "start": 459,
                        "end": 460,
                        "name": "i"
                      },
                      "operator": "===",
                      "right": {
                        "type": "Literal",
                        "start": 465,
                        "end": 466,
                        "value": 0,
                        "raw": "0"
                      }
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 468,
                    "end": 490,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 476,
                        "end": 484,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 476,
                          "end": 483,
                          "operator": "=",
                          "left": {
                            "type": "Identifier",
                            "start": 476,
                            "end": 479,
                            "name": "sum"
                          },
                          "right": {
                            "type": "Identifier",
                            "start": 482,
                            "end": 483,
                            "name": "x"
                          }
                        }
                      }
                    ]
                  },
                  "alternate": {
                    "type": "BlockStatement",
                    "start": 496,
                    "end": 535,
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "start": 504,
                        "end": 529,
                        "expression": {
                          "type": "AssignmentExpression",
                          "start": 504,
                          "end": 529,
                          "operator": "=",
                          "left": {
                            "type": "Identifier",
                            "start": 504,
                            "end": 507,
                            "name": "sum"
                          },
                          "right": {
                            "type": "CallExpression",
                            "start": 510,
                            "end": 529,
                            "callee": {
                              "type": "Identifier",
                              "start": 510,
                              "end": 512,
                              "name": "cb"
                            },
                            "arguments": [
                              {
                                "type": "Identifier",
                                "start": 513,
                                "end": 516,
                                "name": "sum"
                              },
                              {
                                "type": "Identifier",
                                "start": 518,
                                "end": 519,
                                "name": "x"
                              },
                              {
                                "type": "Identifier",
                                "start": 521,
                                "end": 522,
                                "name": "i"
                              },
                              {
                                "type": "ThisExpression",
                                "start": 524,
                                "end": 528
                              }
                            ],
                            "optional": false
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  "type": "ExpressionStatement",
                  "start": 540,
                  "end": 543,
                  "expression": {
                    "type": "UpdateExpression",
                    "start": 540,
                    "end": 543,
                    "operator": "++",
                    "prefix": false,
                    "argument": {
                      "type": "Identifier",
                      "start": 540,
                      "end": 541,
                      "name": "i"
                    }
                  }
                }
              ]
            }
          },
          {
            "type": "ReturnStatement",
            "start": 550,
            "end": 561,
            "argument": {
              "type": "Identifier",
              "start": 557,
              "end": 560,
              "name": "sum"
            }
          }
        ]
      }
    }
  }
}

export const _arrayIndexOfAst = {
  "type": "ExpressionStatement",
  "start": 0,
  "end": 145,
  "expression": {
    "type": "AssignmentExpression",
    "start": 0,
    "end": 145,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 0,
      "end": 23,
      "object": {
        "type": "MemberExpression",
        "start": 0,
        "end": 15,
        "object": {
          "type": "Identifier",
          "start": 0,
          "end": 5,
          "name": "Array"
        },
        "property": {
          "type": "Identifier",
          "start": 6,
          "end": 15,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "Identifier",
        "start": 16,
        "end": 23,
        "name": "indexOf"
      },
      "computed": false,
      "optional": false
    },
    "right": {
      "type": "FunctionExpression",
      "start": 26,
      "end": 145,
      "id": null,
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 36,
          "end": 37,
          "name": "x"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 39,
        "end": 145,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 43,
            "end": 52,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 47,
                "end": 51,
                "id": {
                  "type": "Identifier",
                  "start": 47,
                  "end": 48,
                  "name": "i"
                },
                "init": {
                  "type": "Literal",
                  "start": 50,
                  "end": 51,
                  "value": 0,
                  "raw": "0"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "ForOfStatement",
            "start": 55,
            "end": 131,
            "await": false,
            "left": {
              "type": "VariableDeclaration",
              "start": 59,
              "end": 66,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 65,
                  "end": 66,
                  "id": {
                    "type": "Identifier",
                    "start": 65,
                    "end": 66,
                    "name": "t"
                  },
                  "init": null
                }
              ],
              "kind": "const"
            },
            "right": {
              "type": "ThisExpression",
              "start": 70,
              "end": 74
            },
            "body": {
              "type": "BlockStatement",
              "start": 77,
              "end": 131,
              "body": [
                {
                  "type": "IfStatement",
                  "start": 83,
                  "end": 118,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 87,
                    "end": 94,
                    "left": {
                      "type": "Identifier",
                      "start": 87,
                      "end": 88,
                      "name": "t"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Identifier",
                      "start": 93,
                      "end": 94,
                      "name": "x"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 96,
                    "end": 118,
                    "body": [
                      {
                        "type": "ReturnStatement",
                        "start": 104,
                        "end": 112,
                        "argument": {
                          "type": "Identifier",
                          "start": 111,
                          "end": 112,
                          "name": "i"
                        }
                      }
                    ]
                  },
                  "alternate": null
                },
                {
                  "type": "ExpressionStatement",
                  "start": 123,
                  "end": 127,
                  "expression": {
                    "type": "UpdateExpression",
                    "start": 123,
                    "end": 126,
                    "operator": "++",
                    "prefix": false,
                    "argument": {
                      "type": "Identifier",
                      "start": 123,
                      "end": 124,
                      "name": "i"
                    }
                  }
                }
              ]
            }
          },
          {
            "type": "ReturnStatement",
            "start": 134,
            "end": 143,
            "argument": {
              "type": "UnaryExpression",
              "start": 141,
              "end": 143,
              "operator": "-",
              "prefix": true,
              "argument": {
                "type": "Literal",
                "start": 142,
                "end": 143,
                "value": 1,
                "raw": "1"
              }
            }
          }
        ]
      }
    }
  }
};

export const _arrayIncludesAst = {
  "type": "ExpressionStatement",
  "start": 1,
  "end": 132,
  "expression": {
    "type": "AssignmentExpression",
    "start": 1,
    "end": 132,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 1,
      "end": 25,
      "object": {
        "type": "MemberExpression",
        "start": 1,
        "end": 16,
        "object": {
          "type": "Identifier",
          "start": 1,
          "end": 6,
          "name": "Array"
        },
        "property": {
          "type": "Identifier",
          "start": 7,
          "end": 16,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "Identifier",
        "start": 17,
        "end": 25,
        "name": "includes"
      },
      "computed": false,
      "optional": false
    },
    "right": {
      "type": "FunctionExpression",
      "start": 28,
      "end": 132,
      "id": null,
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 38,
          "end": 39,
          "name": "x"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 41,
        "end": 132,
        "body": [
          {
            "type": "ForOfStatement",
            "start": 45,
            "end": 115,
            "await": false,
            "left": {
              "type": "VariableDeclaration",
              "start": 49,
              "end": 56,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 55,
                  "end": 56,
                  "id": {
                    "type": "Identifier",
                    "start": 55,
                    "end": 56,
                    "name": "t"
                  },
                  "init": null
                }
              ],
              "kind": "const"
            },
            "right": {
              "type": "ThisExpression",
              "start": 60,
              "end": 64
            },
            "body": {
              "type": "BlockStatement",
              "start": 67,
              "end": 115,
              "body": [
                {
                  "type": "IfStatement",
                  "start": 73,
                  "end": 111,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 77,
                    "end": 84,
                    "left": {
                      "type": "Identifier",
                      "start": 77,
                      "end": 78,
                      "name": "t"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Identifier",
                      "start": 83,
                      "end": 84,
                      "name": "x"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 86,
                    "end": 111,
                    "body": [
                      {
                        "type": "ReturnStatement",
                        "start": 94,
                        "end": 105,
                        "argument": {
                          "type": "Literal",
                          "start": 101,
                          "end": 105,
                          "value": true,
                          "raw": "true"
                        }
                      }
                    ]
                  },
                  "alternate": null
                }
              ]
            }
          },
          {
            "type": "ReturnStatement",
            "start": 118,
            "end": 130,
            "argument": {
              "type": "Literal",
              "start": 125,
              "end": 130,
              "value": false,
              "raw": "false"
            }
          }
        ]
      }
    }
  }
}

export const _arraySliceAst = {
  "type": "ExpressionStatement",
  "start": 0,
  "end": 403,
  "expression": {
    "type": "AssignmentExpression",
    "start": 0,
    "end": 403,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 0,
      "end": 21,
      "object": {
        "type": "MemberExpression",
        "start": 0,
        "end": 15,
        "object": {
          "type": "Identifier",
          "start": 0,
          "end": 5,
          "name": "Array"
        },
        "property": {
          "type": "Identifier",
          "start": 6,
          "end": 15,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "Identifier",
        "start": 16,
        "end": 21,
        "name": "slice"
      },
      "computed": false,
      "optional": false
    },
    "right": {
      "type": "FunctionExpression",
      "start": 24,
      "end": 403,
      "id": {
        "type": "Identifier",
        "start": 33,
        "end": 38,
        "name": "slice"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 39,
          "end": 44,
          "name": "start"
        },
        {
          "type": "Identifier",
          "start": 46,
          "end": 49,
          "name": "end"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 51,
        "end": 403,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 55,
            "end": 74,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 61,
                "end": 73,
                "id": {
                  "type": "Identifier",
                  "start": 61,
                  "end": 64,
                  "name": "nil"
                },
                "init": {
                  "type": "UnaryExpression",
                  "start": 67,
                  "end": 73,
                  "operator": "void",
                  "prefix": true,
                  "argument": {
                    "type": "Literal",
                    "start": 72,
                    "end": 73,
                    "value": 0,
                    "raw": "0"
                  }
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "IfStatement",
            "start": 77,
            "end": 138,
            "test": {
              "type": "LogicalExpression",
              "start": 81,
              "end": 109,
              "left": {
                "type": "BinaryExpression",
                "start": 81,
                "end": 94,
                "left": {
                  "type": "Identifier",
                  "start": 81,
                  "end": 86,
                  "name": "start"
                },
                "operator": "===",
                "right": {
                  "type": "Identifier",
                  "start": 91,
                  "end": 94,
                  "name": "nil"
                }
              },
              "operator": "&&",
              "right": {
                "type": "BinaryExpression",
                "start": 98,
                "end": 109,
                "left": {
                  "type": "Identifier",
                  "start": 98,
                  "end": 101,
                  "name": "end"
                },
                "operator": "===",
                "right": {
                  "type": "Identifier",
                  "start": 106,
                  "end": 109,
                  "name": "nil"
                }
              }
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 111,
              "end": 138,
              "body": [
                {
                  "type": "ReturnStatement",
                  "start": 117,
                  "end": 134,
                  "argument": {
                    "type": "ArrayExpression",
                    "start": 124,
                    "end": 133,
                    "elements": [
                      {
                        "type": "SpreadElement",
                        "start": 125,
                        "end": 132,
                        "argument": {
                          "type": "ThisExpression",
                          "start": 128,
                          "end": 132
                        }
                      }
                    ]
                  }
                }
              ]
            },
            "alternate": null
          },
          {
            "type": "VariableDeclaration",
            "start": 160,
            "end": 185,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 164,
                "end": 184,
                "id": {
                  "type": "Identifier",
                  "start": 164,
                  "end": 170,
                  "name": "length"
                },
                "init": {
                  "type": "MemberExpression",
                  "start": 173,
                  "end": 184,
                  "object": {
                    "type": "ThisExpression",
                    "start": 173,
                    "end": 177
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 178,
                    "end": 184,
                    "name": "length"
                  },
                  "computed": false,
                  "optional": false
                }
              }
            ],
            "kind": "var"
          },
          {
            "type": "ExpressionStatement",
            "start": 188,
            "end": 232,
            "expression": {
              "type": "AssignmentExpression",
              "start": 188,
              "end": 231,
              "operator": "=",
              "left": {
                "type": "Identifier",
                "start": 188,
                "end": 193,
                "name": "start"
              },
              "right": {
                "type": "ConditionalExpression",
                "start": 196,
                "end": 231,
                "test": {
                  "type": "BinaryExpression",
                  "start": 196,
                  "end": 206,
                  "left": {
                    "type": "Identifier",
                    "start": 196,
                    "end": 201,
                    "name": "start"
                  },
                  "operator": ">=",
                  "right": {
                    "type": "Literal",
                    "start": 205,
                    "end": 206,
                    "value": 0,
                    "raw": "0"
                  }
                },
                "consequent": {
                  "type": "Identifier",
                  "start": 209,
                  "end": 214,
                  "name": "start"
                },
                "alternate": {
                  "type": "BinaryExpression",
                  "start": 217,
                  "end": 231,
                  "left": {
                    "type": "Identifier",
                    "start": 217,
                    "end": 223,
                    "name": "length"
                  },
                  "operator": "+",
                  "right": {
                    "type": "Identifier",
                    "start": 226,
                    "end": 231,
                    "name": "start"
                  }
                }
              }
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 235,
            "end": 296,
            "expression": {
              "type": "AssignmentExpression",
              "start": 235,
              "end": 295,
              "operator": "=",
              "left": {
                "type": "Identifier",
                "start": 235,
                "end": 238,
                "name": "end"
              },
              "right": {
                "type": "ConditionalExpression",
                "start": 241,
                "end": 295,
                "test": {
                  "type": "BinaryExpression",
                  "start": 241,
                  "end": 252,
                  "left": {
                    "type": "Identifier",
                    "start": 241,
                    "end": 244,
                    "name": "end"
                  },
                  "operator": "!==",
                  "right": {
                    "type": "Identifier",
                    "start": 249,
                    "end": 252,
                    "name": "nil"
                  }
                },
                "consequent": {
                  "type": "ConditionalExpression",
                  "start": 256,
                  "end": 285,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 256,
                    "end": 264,
                    "left": {
                      "type": "Identifier",
                      "start": 256,
                      "end": 259,
                      "name": "end"
                    },
                    "operator": ">=",
                    "right": {
                      "type": "Literal",
                      "start": 263,
                      "end": 264,
                      "value": 0,
                      "raw": "0"
                    }
                  },
                  "consequent": {
                    "type": "Identifier",
                    "start": 267,
                    "end": 270,
                    "name": "end"
                  },
                  "alternate": {
                    "type": "BinaryExpression",
                    "start": 273,
                    "end": 285,
                    "left": {
                      "type": "Identifier",
                      "start": 273,
                      "end": 279,
                      "name": "length"
                    },
                    "operator": "+",
                    "right": {
                      "type": "Identifier",
                      "start": 282,
                      "end": 285,
                      "name": "end"
                    }
                  }
                },
                "alternate": {
                  "type": "Identifier",
                  "start": 289,
                  "end": 295,
                  "name": "length"
                }
              }
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 300,
            "end": 316,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 304,
                "end": 315,
                "id": {
                  "type": "Identifier",
                  "start": 304,
                  "end": 310,
                  "name": "result"
                },
                "init": {
                  "type": "ArrayExpression",
                  "start": 313,
                  "end": 315,
                  "elements": []
                }
              }
            ],
            "kind": "var"
          },
          {
            "type": "ForStatement",
            "start": 319,
            "end": 384,
            "init": {
              "type": "VariableDeclaration",
              "start": 324,
              "end": 337,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 328,
                  "end": 337,
                  "id": {
                    "type": "Identifier",
                    "start": 328,
                    "end": 329,
                    "name": "i"
                  },
                  "init": {
                    "type": "Identifier",
                    "start": 332,
                    "end": 337,
                    "name": "start"
                  }
                }
              ],
              "kind": "var"
            },
            "test": {
              "type": "BinaryExpression",
              "start": 339,
              "end": 346,
              "left": {
                "type": "Identifier",
                "start": 339,
                "end": 340,
                "name": "i"
              },
              "operator": "<",
              "right": {
                "type": "Identifier",
                "start": 343,
                "end": 346,
                "name": "end"
              }
            },
            "update": {
              "type": "UpdateExpression",
              "start": 348,
              "end": 351,
              "operator": "++",
              "prefix": false,
              "argument": {
                "type": "Identifier",
                "start": 348,
                "end": 349,
                "name": "i"
              }
            },
            "body": {
              "type": "BlockStatement",
              "start": 353,
              "end": 384,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 359,
                  "end": 380,
                  "expression": {
                    "type": "CallExpression",
                    "start": 359,
                    "end": 379,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 359,
                      "end": 370,
                      "object": {
                        "type": "Identifier",
                        "start": 359,
                        "end": 365,
                        "name": "result"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 366,
                        "end": 370,
                        "name": "push"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "MemberExpression",
                        "start": 371,
                        "end": 378,
                        "object": {
                          "type": "ThisExpression",
                          "start": 371,
                          "end": 375
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 376,
                          "end": 377,
                          "name": "i"
                        },
                        "computed": true,
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
            "type": "ReturnStatement",
            "start": 387,
            "end": 401,
            "argument": {
              "type": "Identifier",
              "start": 394,
              "end": 400,
              "name": "result"
            }
          }
        ]
      }
    }
  }
}

export const _ArraySymbolIteratorAst = {
  "type": "ExpressionStatement",
  "start": 2,
  "end": 139,
  "expression": {
    "type": "AssignmentExpression",
    "start": 2,
    "end": 139,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 2,
      "end": 34,
      "object": {
        "type": "MemberExpression",
        "start": 2,
        "end": 17,
        "object": {
          "type": "Identifier",
          "start": 2,
          "end": 7,
          "name": "Array"
        },
        "property": {
          "type": "Identifier",
          "start": 8,
          "end": 17,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "MemberExpression",
        "start": 18,
        "end": 33,
        "object": {
          "type": "Identifier",
          "start": 18,
          "end": 24,
          "name": "Symbol"
        },
        "property": {
          "type": "Identifier",
          "start": 25,
          "end": 33,
          "name": "iterator"
        },
        "computed": false,
        "optional": false
      },
      "computed": true,
      "optional": false
    },
    "right": {
      "type": "FunctionExpression",
      "start": 37,
      "end": 139,
      "id": {
        "type": "Identifier",
        "start": 48,
        "end": 69,
        "name": "Array$Symbol$iterator"
      },
      "expression": false,
      "generator": true,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 72,
        "end": 139,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 76,
            "end": 86,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 80,
                "end": 85,
                "id": {
                  "type": "Identifier",
                  "start": 80,
                  "end": 81,
                  "name": "i"
                },
                "init": {
                  "type": "Literal",
                  "start": 84,
                  "end": 85,
                  "value": 0,
                  "raw": "0"
                }
              }
            ],
            "kind": "let"
          },
          {
            "type": "WhileStatement",
            "start": 89,
            "end": 137,
            "test": {
              "type": "BinaryExpression",
              "start": 95,
              "end": 110,
              "left": {
                "type": "Identifier",
                "start": 95,
                "end": 96,
                "name": "i"
              },
              "operator": "<",
              "right": {
                "type": "MemberExpression",
                "start": 99,
                "end": 110,
                "object": {
                  "type": "ThisExpression",
                  "start": 99,
                  "end": 103
                },
                "property": {
                  "type": "Identifier",
                  "start": 104,
                  "end": 110,
                  "name": "length"
                },
                "computed": false,
                "optional": false
              }
            },
            "body": {
              "type": "BlockStatement",
              "start": 112,
              "end": 137,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 118,
                  "end": 133,
                  "expression": {
                    "type": "YieldExpression",
                    "start": 118,
                    "end": 133,
                    "delegate": false,
                    "argument": {
                      "type": "MemberExpression",
                      "start": 124,
                      "end": 133,
                      "object": {
                        "type": "ThisExpression",
                        "start": 124,
                        "end": 128
                      },
                      "property": {
                        "type": "UpdateExpression",
                        "start": 129,
                        "end": 132,
                        "operator": "++",
                        "prefix": false,
                        "argument": {
                          "type": "Identifier",
                          "start": 129,
                          "end": 130,
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
}