const code = `
Function.prototype.call = function call(context, ...args) {
  if (typeof this !== 'function') {
    console.error(this, typeof this)
    throw new Error('call不能作用在非函数上')
  }
  const _this = context || window;
  const attr = '__tempAttr___';
  const temp = _this[attr];
  _this[attr] = this;
  const ret =_this[attr](...args);

  if (typeof temp === 'undefined') {
    Reflect.deleteProperty(_this, attr)
  } else {
    _this[attr] = temp
  }
  return ret;
}
`

const code2 = `
Function.prototype.apply = function apply(context, args) {
  if (typeof this !== 'function') {
    throw new Error('apply不能作用在非函数上')
  }
  const _this = context || window;
  const attr = '__tempAttr___';
  const temp = _this[attr];
  _this[attr] = this;
  const ret = _this[attr](...args);
  if (typeof temp === 'undefined') {
    Reflect.deleteProperty(_this, attr)
  } else {
    _this[attr] = temp
  }
  return ret;
}
`

const code3 = `
Reflect.defineProperty(Function.prototype, 'bind', {
  writable: true,
  enumerable: false,
  configurable: true,
  value: function bind(...args1) {
  const _this = this;
  if (typeof _this !== 'function') {
    console.error(_this, typeof _this, 'bind不能作用在非函数上');
    throw new Error('bind不能作用在非函数上');
  }
  
  return function bind(...args2) {
    return _this.call(...args1, ...args2);
  }
}
})
`

export const _FunctionCallAst = {
  "type": "ExpressionStatement",
  "start": 0,
  "end": 457,
  "expression": {
    "type": "AssignmentExpression",
    "start": 0,
    "end": 457,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 0,
      "end": 23,
      "object": {
        "type": "MemberExpression",
        "start": 0,
        "end": 18,
        "object": {
          "type": "Identifier",
          "start": 0,
          "end": 8,
          "name": "Function"
        },
        "property": {
          "type": "Identifier",
          "start": 9,
          "end": 18,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "Identifier",
        "start": 19,
        "end": 23,
        "name": "call"
      },
      "computed": false,
      "optional": false
    },
    "right": {
      "type": "FunctionExpression",
      "start": 26,
      "end": 457,
      "id": {
        "type": "Identifier",
        "start": 35,
        "end": 39,
        "name": "call"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 40,
          "end": 47,
          "name": "context"
        },
        {
          "type": "RestElement",
          "start": 49,
          "end": 56,
          "argument": {
            "type": "Identifier",
            "start": 52,
            "end": 56,
            "name": "args"
          }
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 58,
        "end": 457,
        "body": [
          {
            "type": "IfStatement",
            "start": 62,
            "end": 173,
            "test": {
              "type": "BinaryExpression",
              "start": 66,
              "end": 92,
              "left": {
                "type": "UnaryExpression",
                "start": 66,
                "end": 77,
                "operator": "typeof",
                "prefix": true,
                "argument": {
                  "type": "ThisExpression",
                  "start": 73,
                  "end": 77
                }
              },
              "operator": "!==",
              "right": {
                "type": "Literal",
                "start": 82,
                "end": 92,
                "value": "function",
                "raw": "'function'"
              }
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 94,
              "end": 173,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 100,
                  "end": 132,
                  "expression": {
                    "type": "CallExpression",
                    "start": 100,
                    "end": 132,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 100,
                      "end": 113,
                      "object": {
                        "type": "Identifier",
                        "start": 100,
                        "end": 107,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 108,
                        "end": 113,
                        "name": "error"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "ThisExpression",
                        "start": 114,
                        "end": 118
                      },
                      {
                        "type": "UnaryExpression",
                        "start": 120,
                        "end": 131,
                        "operator": "typeof",
                        "prefix": true,
                        "argument": {
                          "type": "ThisExpression",
                          "start": 127,
                          "end": 131
                        }
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ThrowStatement",
                  "start": 137,
                  "end": 169,
                  "argument": {
                    "type": "NewExpression",
                    "start": 143,
                    "end": 169,
                    "callee": {
                      "type": "Identifier",
                      "start": 147,
                      "end": 152,
                      "name": "Error"
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 153,
                        "end": 168,
                        "value": "call不能作用在非函数上",
                        "raw": "'call不能作用在非函数上'"
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
            "start": 176,
            "end": 208,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 182,
                "end": 207,
                "id": {
                  "type": "Identifier",
                  "start": 182,
                  "end": 187,
                  "name": "_this"
                },
                "init": {
                  "type": "LogicalExpression",
                  "start": 190,
                  "end": 207,
                  "left": {
                    "type": "Identifier",
                    "start": 190,
                    "end": 197,
                    "name": "context"
                  },
                  "operator": "||",
                  "right": {
                    "type": "Identifier",
                    "start": 201,
                    "end": 207,
                    "name": "window"
                  }
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 211,
            "end": 240,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 217,
                "end": 239,
                "id": {
                  "type": "Identifier",
                  "start": 217,
                  "end": 221,
                  "name": "attr"
                },
                "init": {
                  "type": "Literal",
                  "start": 224,
                  "end": 239,
                  "value": "__tempAttr___",
                  "raw": "'__tempAttr___'"
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 243,
            "end": 268,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 249,
                "end": 267,
                "id": {
                  "type": "Identifier",
                  "start": 249,
                  "end": 253,
                  "name": "temp"
                },
                "init": {
                  "type": "MemberExpression",
                  "start": 256,
                  "end": 267,
                  "object": {
                    "type": "Identifier",
                    "start": 256,
                    "end": 261,
                    "name": "_this"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 262,
                    "end": 266,
                    "name": "attr"
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
            "start": 271,
            "end": 290,
            "expression": {
              "type": "AssignmentExpression",
              "start": 271,
              "end": 289,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 271,
                "end": 282,
                "object": {
                  "type": "Identifier",
                  "start": 271,
                  "end": 276,
                  "name": "_this"
                },
                "property": {
                  "type": "Identifier",
                  "start": 277,
                  "end": 281,
                  "name": "attr"
                },
                "computed": true,
                "optional": false
              },
              "right": {
                "type": "ThisExpression",
                "start": 285,
                "end": 289
              }
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 293,
            "end": 325,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 299,
                "end": 324,
                "id": {
                  "type": "Identifier",
                  "start": 299,
                  "end": 302,
                  "name": "ret"
                },
                "init": {
                  "type": "CallExpression",
                  "start": 304,
                  "end": 324,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 304,
                    "end": 315,
                    "object": {
                      "type": "Identifier",
                      "start": 304,
                      "end": 309,
                      "name": "_this"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 310,
                      "end": 314,
                      "name": "attr"
                    },
                    "computed": true,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "SpreadElement",
                      "start": 316,
                      "end": 323,
                      "argument": {
                        "type": "Identifier",
                        "start": 319,
                        "end": 323,
                        "name": "args"
                      }
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
            "start": 329,
            "end": 441,
            "test": {
              "type": "BinaryExpression",
              "start": 333,
              "end": 360,
              "left": {
                "type": "UnaryExpression",
                "start": 333,
                "end": 344,
                "operator": "typeof",
                "prefix": true,
                "argument": {
                  "type": "Identifier",
                  "start": 340,
                  "end": 344,
                  "name": "temp"
                }
              },
              "operator": "===",
              "right": {
                "type": "Literal",
                "start": 349,
                "end": 360,
                "value": "undefined",
                "raw": "'undefined'"
              }
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 362,
              "end": 407,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 368,
                  "end": 403,
                  "expression": {
                    "type": "CallExpression",
                    "start": 368,
                    "end": 403,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 368,
                      "end": 390,
                      "object": {
                        "type": "Identifier",
                        "start": 368,
                        "end": 375,
                        "name": "Reflect"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 376,
                        "end": 390,
                        "name": "deleteProperty"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 391,
                        "end": 396,
                        "name": "_this"
                      },
                      {
                        "type": "Identifier",
                        "start": 398,
                        "end": 402,
                        "name": "attr"
                      }
                    ],
                    "optional": false
                  }
                }
              ]
            },
            "alternate": {
              "type": "BlockStatement",
              "start": 413,
              "end": 441,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 419,
                  "end": 437,
                  "expression": {
                    "type": "AssignmentExpression",
                    "start": 419,
                    "end": 437,
                    "operator": "=",
                    "left": {
                      "type": "MemberExpression",
                      "start": 419,
                      "end": 430,
                      "object": {
                        "type": "Identifier",
                        "start": 419,
                        "end": 424,
                        "name": "_this"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 425,
                        "end": 429,
                        "name": "attr"
                      },
                      "computed": true,
                      "optional": false
                    },
                    "right": {
                      "type": "Identifier",
                      "start": 433,
                      "end": 437,
                      "name": "temp"
                    }
                  }
                }
              ]
            }
          },
          {
            "type": "ReturnStatement",
            "start": 444,
            "end": 455,
            "argument": {
              "type": "Identifier",
              "start": 451,
              "end": 454,
              "name": "ret"
            }
          }
        ]
      }
    }
  }
}

export const _FunctionApplyAst = {
  "type": "ExpressionStatement",
  "start": 0,
  "end": 420,
  "expression": {
    "type": "AssignmentExpression",
    "start": 0,
    "end": 420,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 0,
      "end": 24,
      "object": {
        "type": "MemberExpression",
        "start": 0,
        "end": 18,
        "object": {
          "type": "Identifier",
          "start": 0,
          "end": 8,
          "name": "Function"
        },
        "property": {
          "type": "Identifier",
          "start": 9,
          "end": 18,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "Identifier",
        "start": 19,
        "end": 24,
        "name": "apply"
      },
      "computed": false,
      "optional": false
    },
    "right": {
      "type": "FunctionExpression",
      "start": 27,
      "end": 420,
      "id": {
        "type": "Identifier",
        "start": 36,
        "end": 41,
        "name": "apply"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 42,
          "end": 49,
          "name": "context"
        },
        {
          "type": "Identifier",
          "start": 51,
          "end": 55,
          "name": "args"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 57,
        "end": 420,
        "body": [
          {
            "type": "IfStatement",
            "start": 61,
            "end": 136,
            "test": {
              "type": "BinaryExpression",
              "start": 65,
              "end": 91,
              "left": {
                "type": "UnaryExpression",
                "start": 65,
                "end": 76,
                "operator": "typeof",
                "prefix": true,
                "argument": {
                  "type": "ThisExpression",
                  "start": 72,
                  "end": 76
                }
              },
              "operator": "!==",
              "right": {
                "type": "Literal",
                "start": 81,
                "end": 91,
                "value": "function",
                "raw": "'function'"
              }
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 93,
              "end": 136,
              "body": [
                {
                  "type": "ThrowStatement",
                  "start": 99,
                  "end": 132,
                  "argument": {
                    "type": "NewExpression",
                    "start": 105,
                    "end": 132,
                    "callee": {
                      "type": "Identifier",
                      "start": 109,
                      "end": 114,
                      "name": "Error"
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 115,
                        "end": 131,
                        "value": "apply不能作用在非函数上",
                        "raw": "'apply不能作用在非函数上'"
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
            "start": 139,
            "end": 171,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 145,
                "end": 170,
                "id": {
                  "type": "Identifier",
                  "start": 145,
                  "end": 150,
                  "name": "_this"
                },
                "init": {
                  "type": "LogicalExpression",
                  "start": 153,
                  "end": 170,
                  "left": {
                    "type": "Identifier",
                    "start": 153,
                    "end": 160,
                    "name": "context"
                  },
                  "operator": "||",
                  "right": {
                    "type": "Identifier",
                    "start": 164,
                    "end": 170,
                    "name": "window"
                  }
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 174,
            "end": 203,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 180,
                "end": 202,
                "id": {
                  "type": "Identifier",
                  "start": 180,
                  "end": 184,
                  "name": "attr"
                },
                "init": {
                  "type": "Literal",
                  "start": 187,
                  "end": 202,
                  "value": "__tempAttr___",
                  "raw": "'__tempAttr___'"
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 206,
            "end": 231,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 212,
                "end": 230,
                "id": {
                  "type": "Identifier",
                  "start": 212,
                  "end": 216,
                  "name": "temp"
                },
                "init": {
                  "type": "MemberExpression",
                  "start": 219,
                  "end": 230,
                  "object": {
                    "type": "Identifier",
                    "start": 219,
                    "end": 224,
                    "name": "_this"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 225,
                    "end": 229,
                    "name": "attr"
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
            "start": 234,
            "end": 253,
            "expression": {
              "type": "AssignmentExpression",
              "start": 234,
              "end": 252,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 234,
                "end": 245,
                "object": {
                  "type": "Identifier",
                  "start": 234,
                  "end": 239,
                  "name": "_this"
                },
                "property": {
                  "type": "Identifier",
                  "start": 240,
                  "end": 244,
                  "name": "attr"
                },
                "computed": true,
                "optional": false
              },
              "right": {
                "type": "ThisExpression",
                "start": 248,
                "end": 252
              }
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 256,
            "end": 289,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 262,
                "end": 288,
                "id": {
                  "type": "Identifier",
                  "start": 262,
                  "end": 265,
                  "name": "ret"
                },
                "init": {
                  "type": "CallExpression",
                  "start": 268,
                  "end": 288,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 268,
                    "end": 279,
                    "object": {
                      "type": "Identifier",
                      "start": 268,
                      "end": 273,
                      "name": "_this"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 274,
                      "end": 278,
                      "name": "attr"
                    },
                    "computed": true,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "SpreadElement",
                      "start": 280,
                      "end": 287,
                      "argument": {
                        "type": "Identifier",
                        "start": 283,
                        "end": 287,
                        "name": "args"
                      }
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
            "start": 292,
            "end": 404,
            "test": {
              "type": "BinaryExpression",
              "start": 296,
              "end": 323,
              "left": {
                "type": "UnaryExpression",
                "start": 296,
                "end": 307,
                "operator": "typeof",
                "prefix": true,
                "argument": {
                  "type": "Identifier",
                  "start": 303,
                  "end": 307,
                  "name": "temp"
                }
              },
              "operator": "===",
              "right": {
                "type": "Literal",
                "start": 312,
                "end": 323,
                "value": "undefined",
                "raw": "'undefined'"
              }
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 325,
              "end": 370,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 331,
                  "end": 366,
                  "expression": {
                    "type": "CallExpression",
                    "start": 331,
                    "end": 366,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 331,
                      "end": 353,
                      "object": {
                        "type": "Identifier",
                        "start": 331,
                        "end": 338,
                        "name": "Reflect"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 339,
                        "end": 353,
                        "name": "deleteProperty"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 354,
                        "end": 359,
                        "name": "_this"
                      },
                      {
                        "type": "Identifier",
                        "start": 361,
                        "end": 365,
                        "name": "attr"
                      }
                    ],
                    "optional": false
                  }
                }
              ]
            },
            "alternate": {
              "type": "BlockStatement",
              "start": 376,
              "end": 404,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 382,
                  "end": 400,
                  "expression": {
                    "type": "AssignmentExpression",
                    "start": 382,
                    "end": 400,
                    "operator": "=",
                    "left": {
                      "type": "MemberExpression",
                      "start": 382,
                      "end": 393,
                      "object": {
                        "type": "Identifier",
                        "start": 382,
                        "end": 387,
                        "name": "_this"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 388,
                        "end": 392,
                        "name": "attr"
                      },
                      "computed": true,
                      "optional": false
                    },
                    "right": {
                      "type": "Identifier",
                      "start": 396,
                      "end": 400,
                      "name": "temp"
                    }
                  }
                }
              ]
            }
          },
          {
            "type": "ReturnStatement",
            "start": 407,
            "end": 418,
            "argument": {
              "type": "Identifier",
              "start": 414,
              "end": 417,
              "name": "ret"
            }
          }
        ]
      }
    }
  }
}

export const _FunctionBindAst = {
  "type": "ExpressionStatement",
  "start": 0,
  "end": 396,
  "expression": {
    "type": "CallExpression",
    "start": 0,
    "end": 396,
    "callee": {
      "type": "MemberExpression",
      "start": 0,
      "end": 22,
      "object": {
        "type": "Identifier",
        "start": 0,
        "end": 7,
        "name": "Reflect"
      },
      "property": {
        "type": "Identifier",
        "start": 8,
        "end": 22,
        "name": "defineProperty"
      },
      "computed": false,
      "optional": false
    },
    "arguments": [
      {
        "type": "MemberExpression",
        "start": 23,
        "end": 41,
        "object": {
          "type": "Identifier",
          "start": 23,
          "end": 31,
          "name": "Function"
        },
        "property": {
          "type": "Identifier",
          "start": 32,
          "end": 41,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      {
        "type": "Literal",
        "start": 43,
        "end": 49,
        "value": "bind",
        "raw": "'bind'"
      },
      {
        "type": "ObjectExpression",
        "start": 51,
        "end": 395,
        "properties": [
          {
            "type": "Property",
            "start": 55,
            "end": 69,
            "method": false,
            "shorthand": false,
            "computed": false,
            "key": {
              "type": "Identifier",
              "start": 55,
              "end": 63,
              "name": "writable"
            },
            "value": {
              "type": "Literal",
              "start": 65,
              "end": 69,
              "value": true,
              "raw": "true"
            },
            "kind": "init"
          },
          {
            "type": "Property",
            "start": 73,
            "end": 90,
            "method": false,
            "shorthand": false,
            "computed": false,
            "key": {
              "type": "Identifier",
              "start": 73,
              "end": 83,
              "name": "enumerable"
            },
            "value": {
              "type": "Literal",
              "start": 85,
              "end": 90,
              "value": false,
              "raw": "false"
            },
            "kind": "init"
          },
          {
            "type": "Property",
            "start": 94,
            "end": 112,
            "method": false,
            "shorthand": false,
            "computed": false,
            "key": {
              "type": "Identifier",
              "start": 94,
              "end": 106,
              "name": "configurable"
            },
            "value": {
              "type": "Literal",
              "start": 108,
              "end": 112,
              "value": true,
              "raw": "true"
            },
            "kind": "init"
          },
          {
            "type": "Property",
            "start": 116,
            "end": 393,
            "method": false,
            "shorthand": false,
            "computed": false,
            "key": {
              "type": "Identifier",
              "start": 116,
              "end": 121,
              "name": "value"
            },
            "value": {
              "type": "FunctionExpression",
              "start": 123,
              "end": 393,
              "id": {
                "type": "Identifier",
                "start": 132,
                "end": 136,
                "name": "bind"
              },
              "expression": false,
              "generator": false,
              "async": false,
              "params": [
                {
                  "type": "RestElement",
                  "start": 137,
                  "end": 145,
                  "argument": {
                    "type": "Identifier",
                    "start": 140,
                    "end": 145,
                    "name": "args1"
                  }
                }
              ],
              "body": {
                "type": "BlockStatement",
                "start": 147,
                "end": 393,
                "body": [
                  {
                    "type": "VariableDeclaration",
                    "start": 151,
                    "end": 170,
                    "declarations": [
                      {
                        "type": "VariableDeclarator",
                        "start": 157,
                        "end": 169,
                        "id": {
                          "type": "Identifier",
                          "start": 157,
                          "end": 162,
                          "name": "_this"
                        },
                        "init": {
                          "type": "ThisExpression",
                          "start": 165,
                          "end": 169
                        }
                      }
                    ],
                    "kind": "const"
                  },
                  {
                    "type": "IfStatement",
                    "start": 173,
                    "end": 306,
                    "test": {
                      "type": "BinaryExpression",
                      "start": 177,
                      "end": 204,
                      "left": {
                        "type": "UnaryExpression",
                        "start": 177,
                        "end": 189,
                        "operator": "typeof",
                        "prefix": true,
                        "argument": {
                          "type": "Identifier",
                          "start": 184,
                          "end": 189,
                          "name": "_this"
                        }
                      },
                      "operator": "!==",
                      "right": {
                        "type": "Literal",
                        "start": 194,
                        "end": 204,
                        "value": "function",
                        "raw": "'function'"
                      }
                    },
                    "consequent": {
                      "type": "BlockStatement",
                      "start": 206,
                      "end": 306,
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "start": 212,
                          "end": 264,
                          "expression": {
                            "type": "CallExpression",
                            "start": 212,
                            "end": 263,
                            "callee": {
                              "type": "MemberExpression",
                              "start": 212,
                              "end": 225,
                              "object": {
                                "type": "Identifier",
                                "start": 212,
                                "end": 219,
                                "name": "console"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 220,
                                "end": 225,
                                "name": "error"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "arguments": [
                              {
                                "type": "Identifier",
                                "start": 226,
                                "end": 231,
                                "name": "_this"
                              },
                              {
                                "type": "UnaryExpression",
                                "start": 233,
                                "end": 245,
                                "operator": "typeof",
                                "prefix": true,
                                "argument": {
                                  "type": "Identifier",
                                  "start": 240,
                                  "end": 245,
                                  "name": "_this"
                                }
                              },
                              {
                                "type": "Literal",
                                "start": 247,
                                "end": 262,
                                "value": "bind不能作用在非函数上",
                                "raw": "'bind不能作用在非函数上'"
                              }
                            ],
                            "optional": false
                          }
                        },
                        {
                          "type": "ThrowStatement",
                          "start": 269,
                          "end": 302,
                          "argument": {
                            "type": "NewExpression",
                            "start": 275,
                            "end": 301,
                            "callee": {
                              "type": "Identifier",
                              "start": 279,
                              "end": 284,
                              "name": "Error"
                            },
                            "arguments": [
                              {
                                "type": "Literal",
                                "start": 285,
                                "end": 300,
                                "value": "bind不能作用在非函数上",
                                "raw": "'bind不能作用在非函数上'"
                              }
                            ]
                          }
                        }
                      ]
                    },
                    "alternate": null
                  },
                  {
                    "type": "ReturnStatement",
                    "start": 312,
                    "end": 391,
                    "argument": {
                      "type": "FunctionExpression",
                      "start": 319,
                      "end": 391,
                      "id": {
                        "type": "Identifier",
                        "start": 328,
                        "end": 332,
                        "name": "bind"
                      },
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [
                        {
                          "type": "RestElement",
                          "start": 333,
                          "end": 341,
                          "argument": {
                            "type": "Identifier",
                            "start": 336,
                            "end": 341,
                            "name": "args2"
                          }
                        }
                      ],
                      "body": {
                        "type": "BlockStatement",
                        "start": 343,
                        "end": 391,
                        "body": [
                          {
                            "type": "ReturnStatement",
                            "start": 349,
                            "end": 387,
                            "argument": {
                              "type": "CallExpression",
                              "start": 356,
                              "end": 386,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 356,
                                "end": 366,
                                "object": {
                                  "type": "Identifier",
                                  "start": 356,
                                  "end": 361,
                                  "name": "_this"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 362,
                                  "end": 366,
                                  "name": "call"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "SpreadElement",
                                  "start": 367,
                                  "end": 375,
                                  "argument": {
                                    "type": "Identifier",
                                    "start": 370,
                                    "end": 375,
                                    "name": "args1"
                                  }
                                },
                                {
                                  "type": "SpreadElement",
                                  "start": 377,
                                  "end": 385,
                                  "argument": {
                                    "type": "Identifier",
                                    "start": 380,
                                    "end": 385,
                                    "name": "args2"
                                  }
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
            },
            "kind": "init"
          }
        ]
      }
    ],
    "optional": false
  }
}