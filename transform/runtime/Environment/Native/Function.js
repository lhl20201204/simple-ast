const code = `
Function.prototype.call = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('call不能作用在非函数上')
  }
  const _this = context || window;
  const attr = '__tempAttr___';
  const temp = _this[attr];
  _this[attr] = this;
  const ret =_this[attr](...args);
  if (typeof temp === void 0) {
    Reflect.deleteProperty(_this, attr)
  } else {
    _this[attr] = temp
  }
  return ret;
}
`

const code2 = `
Function.prototype.apply = function (context, args) {
  if (typeof this !== 'function') {
    throw new Error('apply不能作用在非函数上')
  }
  const _this = context || window;
  const attr = '__tempAttr___';
  const temp = _this[attr];
  _this[attr] = this;
  const ret = _this[attr](...args);
  if (typeof temp === void 0) {
    Reflect.deleteProperty(_this, attr)
  } else {
    _this[attr] = temp
  }
  return ret;
}
`

const code3 = `
Function.prototype.bind = function (...args1) {
  const _this = this;
  if (typeof _this !== 'function') {
    console.error(_this);
    throw new Error('bind不能作用在非函数上');
  }
  
  return function bind(...args2) {
    return _this.call(...args1, ...args2);
  }
}
`

export const _FunctionCallAst = {
  "type": "ExpressionStatement",
  "start": 1,
  "end": 414,
  "expression": {
    "type": "AssignmentExpression",
    "start": 1,
    "end": 414,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 1,
      "end": 24,
      "object": {
        "type": "MemberExpression",
        "start": 1,
        "end": 19,
        "object": {
          "type": "Identifier",
          "start": 1,
          "end": 9,
          "name": "Function"
        },
        "property": {
          "type": "Identifier",
          "start": 10,
          "end": 19,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "Identifier",
        "start": 20,
        "end": 24,
        "name": "call"
      },
      "computed": false,
      "optional": false
    },
    "right": {
      "type": "FunctionExpression",
      "start": 27,
      "end": 414,
      "id": null,
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 37,
          "end": 44,
          "name": "context"
        },
        {
          "type": "RestElement",
          "start": 46,
          "end": 53,
          "argument": {
            "type": "Identifier",
            "start": 49,
            "end": 53,
            "name": "args"
          }
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 55,
        "end": 414,
        "body": [
          {
            "type": "IfStatement",
            "start": 59,
            "end": 133,
            "test": {
              "type": "BinaryExpression",
              "start": 63,
              "end": 89,
              "left": {
                "type": "UnaryExpression",
                "start": 63,
                "end": 74,
                "operator": "typeof",
                "prefix": true,
                "argument": {
                  "type": "ThisExpression",
                  "start": 70,
                  "end": 74
                }
              },
              "operator": "!==",
              "right": {
                "type": "Literal",
                "start": 79,
                "end": 89,
                "value": "function",
                "raw": "'function'"
              }
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 91,
              "end": 133,
              "body": [
                {
                  "type": "ThrowStatement",
                  "start": 97,
                  "end": 129,
                  "argument": {
                    "type": "NewExpression",
                    "start": 103,
                    "end": 129,
                    "callee": {
                      "type": "Identifier",
                      "start": 107,
                      "end": 112,
                      "name": "Error"
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 113,
                        "end": 128,
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
            "start": 136,
            "end": 168,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 142,
                "end": 167,
                "id": {
                  "type": "Identifier",
                  "start": 142,
                  "end": 147,
                  "name": "_this"
                },
                "init": {
                  "type": "LogicalExpression",
                  "start": 150,
                  "end": 167,
                  "left": {
                    "type": "Identifier",
                    "start": 150,
                    "end": 157,
                    "name": "context"
                  },
                  "operator": "||",
                  "right": {
                    "type": "Identifier",
                    "start": 161,
                    "end": 167,
                    "name": "window"
                  }
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 171,
            "end": 200,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 177,
                "end": 199,
                "id": {
                  "type": "Identifier",
                  "start": 177,
                  "end": 181,
                  "name": "attr"
                },
                "init": {
                  "type": "Literal",
                  "start": 184,
                  "end": 199,
                  "value": "__tempAttr___",
                  "raw": "'__tempAttr___'"
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 203,
            "end": 228,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 209,
                "end": 227,
                "id": {
                  "type": "Identifier",
                  "start": 209,
                  "end": 213,
                  "name": "temp"
                },
                "init": {
                  "type": "MemberExpression",
                  "start": 216,
                  "end": 227,
                  "object": {
                    "type": "Identifier",
                    "start": 216,
                    "end": 221,
                    "name": "_this"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 222,
                    "end": 226,
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
            "start": 231,
            "end": 250,
            "expression": {
              "type": "AssignmentExpression",
              "start": 231,
              "end": 249,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 231,
                "end": 242,
                "object": {
                  "type": "Identifier",
                  "start": 231,
                  "end": 236,
                  "name": "_this"
                },
                "property": {
                  "type": "Identifier",
                  "start": 237,
                  "end": 241,
                  "name": "attr"
                },
                "computed": true,
                "optional": false
              },
              "right": {
                "type": "ThisExpression",
                "start": 245,
                "end": 249
              }
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 256,
            "end": 288,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 262,
                "end": 287,
                "id": {
                  "type": "Identifier",
                  "start": 262,
                  "end": 265,
                  "name": "ret"
                },
                "init": {
                  "type": "CallExpression",
                  "start": 267,
                  "end": 287,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 267,
                    "end": 278,
                    "object": {
                      "type": "Identifier",
                      "start": 267,
                      "end": 272,
                      "name": "_this"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 273,
                      "end": 277,
                      "name": "attr"
                    },
                    "computed": true,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "SpreadElement",
                      "start": 279,
                      "end": 286,
                      "argument": {
                        "type": "Identifier",
                        "start": 282,
                        "end": 286,
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
            "start": 291,
            "end": 398,
            "test": {
              "type": "BinaryExpression",
              "start": 295,
              "end": 317,
              "left": {
                "type": "UnaryExpression",
                "start": 295,
                "end": 306,
                "operator": "typeof",
                "prefix": true,
                "argument": {
                  "type": "Identifier",
                  "start": 302,
                  "end": 306,
                  "name": "temp"
                }
              },
              "operator": "===",
              "right": {
                "type": "UnaryExpression",
                "start": 311,
                "end": 317,
                "operator": "void",
                "prefix": true,
                "argument": {
                  "type": "Literal",
                  "start": 316,
                  "end": 317,
                  "value": 0,
                  "raw": "0"
                }
              }
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 319,
              "end": 364,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 325,
                  "end": 360,
                  "expression": {
                    "type": "CallExpression",
                    "start": 325,
                    "end": 360,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 325,
                      "end": 347,
                      "object": {
                        "type": "Identifier",
                        "start": 325,
                        "end": 332,
                        "name": "Reflect"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 333,
                        "end": 347,
                        "name": "deleteProperty"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 348,
                        "end": 353,
                        "name": "_this"
                      },
                      {
                        "type": "Identifier",
                        "start": 355,
                        "end": 359,
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
              "start": 370,
              "end": 398,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 376,
                  "end": 394,
                  "expression": {
                    "type": "AssignmentExpression",
                    "start": 376,
                    "end": 394,
                    "operator": "=",
                    "left": {
                      "type": "MemberExpression",
                      "start": 376,
                      "end": 387,
                      "object": {
                        "type": "Identifier",
                        "start": 376,
                        "end": 381,
                        "name": "_this"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 382,
                        "end": 386,
                        "name": "attr"
                      },
                      "computed": true,
                      "optional": false
                    },
                    "right": {
                      "type": "Identifier",
                      "start": 390,
                      "end": 394,
                      "name": "temp"
                    }
                  }
                }
              ]
            }
          },
          {
            "type": "ReturnStatement",
            "start": 401,
            "end": 412,
            "argument": {
              "type": "Identifier",
              "start": 408,
              "end": 411,
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
  "end": 410,
  "expression": {
    "type": "AssignmentExpression",
    "start": 0,
    "end": 410,
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
      "end": 410,
      "id": null,
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 37,
          "end": 44,
          "name": "context"
        },
        {
          "type": "Identifier",
          "start": 46,
          "end": 50,
          "name": "args"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 52,
        "end": 410,
        "body": [
          {
            "type": "IfStatement",
            "start": 56,
            "end": 131,
            "test": {
              "type": "BinaryExpression",
              "start": 60,
              "end": 86,
              "left": {
                "type": "UnaryExpression",
                "start": 60,
                "end": 71,
                "operator": "typeof",
                "prefix": true,
                "argument": {
                  "type": "ThisExpression",
                  "start": 67,
                  "end": 71
                }
              },
              "operator": "!==",
              "right": {
                "type": "Literal",
                "start": 76,
                "end": 86,
                "value": "function",
                "raw": "'function'"
              }
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 88,
              "end": 131,
              "body": [
                {
                  "type": "ThrowStatement",
                  "start": 94,
                  "end": 127,
                  "argument": {
                    "type": "NewExpression",
                    "start": 100,
                    "end": 127,
                    "callee": {
                      "type": "Identifier",
                      "start": 104,
                      "end": 109,
                      "name": "Error"
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 110,
                        "end": 126,
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
            "start": 134,
            "end": 166,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 140,
                "end": 165,
                "id": {
                  "type": "Identifier",
                  "start": 140,
                  "end": 145,
                  "name": "_this"
                },
                "init": {
                  "type": "LogicalExpression",
                  "start": 148,
                  "end": 165,
                  "left": {
                    "type": "Identifier",
                    "start": 148,
                    "end": 155,
                    "name": "context"
                  },
                  "operator": "||",
                  "right": {
                    "type": "Identifier",
                    "start": 159,
                    "end": 165,
                    "name": "window"
                  }
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 169,
            "end": 198,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 175,
                "end": 197,
                "id": {
                  "type": "Identifier",
                  "start": 175,
                  "end": 179,
                  "name": "attr"
                },
                "init": {
                  "type": "Literal",
                  "start": 182,
                  "end": 197,
                  "value": "__tempAttr___",
                  "raw": "'__tempAttr___'"
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 201,
            "end": 226,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 207,
                "end": 225,
                "id": {
                  "type": "Identifier",
                  "start": 207,
                  "end": 211,
                  "name": "temp"
                },
                "init": {
                  "type": "MemberExpression",
                  "start": 214,
                  "end": 225,
                  "object": {
                    "type": "Identifier",
                    "start": 214,
                    "end": 219,
                    "name": "_this"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 220,
                    "end": 224,
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
            "start": 229,
            "end": 248,
            "expression": {
              "type": "AssignmentExpression",
              "start": 229,
              "end": 247,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 229,
                "end": 240,
                "object": {
                  "type": "Identifier",
                  "start": 229,
                  "end": 234,
                  "name": "_this"
                },
                "property": {
                  "type": "Identifier",
                  "start": 235,
                  "end": 239,
                  "name": "attr"
                },
                "computed": true,
                "optional": false
              },
              "right": {
                "type": "ThisExpression",
                "start": 243,
                "end": 247
              }
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 251,
            "end": 284,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 257,
                "end": 283,
                "id": {
                  "type": "Identifier",
                  "start": 257,
                  "end": 260,
                  "name": "ret"
                },
                "init": {
                  "type": "CallExpression",
                  "start": 263,
                  "end": 283,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 263,
                    "end": 274,
                    "object": {
                      "type": "Identifier",
                      "start": 263,
                      "end": 268,
                      "name": "_this"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 269,
                      "end": 273,
                      "name": "attr"
                    },
                    "computed": true,
                    "optional": false
                  },
                  "arguments": [
                    {
                      "type": "SpreadElement",
                      "start": 275,
                      "end": 282,
                      "argument": {
                        "type": "Identifier",
                        "start": 278,
                        "end": 282,
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
            "start": 287,
            "end": 394,
            "test": {
              "type": "BinaryExpression",
              "start": 291,
              "end": 313,
              "left": {
                "type": "UnaryExpression",
                "start": 291,
                "end": 302,
                "operator": "typeof",
                "prefix": true,
                "argument": {
                  "type": "Identifier",
                  "start": 298,
                  "end": 302,
                  "name": "temp"
                }
              },
              "operator": "===",
              "right": {
                "type": "UnaryExpression",
                "start": 307,
                "end": 313,
                "operator": "void",
                "prefix": true,
                "argument": {
                  "type": "Literal",
                  "start": 312,
                  "end": 313,
                  "value": 0,
                  "raw": "0"
                }
              }
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 315,
              "end": 360,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 321,
                  "end": 356,
                  "expression": {
                    "type": "CallExpression",
                    "start": 321,
                    "end": 356,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 321,
                      "end": 343,
                      "object": {
                        "type": "Identifier",
                        "start": 321,
                        "end": 328,
                        "name": "Reflect"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 329,
                        "end": 343,
                        "name": "deleteProperty"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 344,
                        "end": 349,
                        "name": "_this"
                      },
                      {
                        "type": "Identifier",
                        "start": 351,
                        "end": 355,
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
              "start": 366,
              "end": 394,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 372,
                  "end": 390,
                  "expression": {
                    "type": "AssignmentExpression",
                    "start": 372,
                    "end": 390,
                    "operator": "=",
                    "left": {
                      "type": "MemberExpression",
                      "start": 372,
                      "end": 383,
                      "object": {
                        "type": "Identifier",
                        "start": 372,
                        "end": 377,
                        "name": "_this"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 378,
                        "end": 382,
                        "name": "attr"
                      },
                      "computed": true,
                      "optional": false
                    },
                    "right": {
                      "type": "Identifier",
                      "start": 386,
                      "end": 390,
                      "name": "temp"
                    }
                  }
                }
              ]
            }
          },
          {
            "type": "ReturnStatement",
            "start": 397,
            "end": 408,
            "argument": {
              "type": "Identifier",
              "start": 404,
              "end": 407,
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
  "start": 1,
  "end": 294,
  "expression": {
    "type": "AssignmentExpression",
    "start": 1,
    "end": 294,
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "start": 1,
      "end": 24,
      "object": {
        "type": "MemberExpression",
        "start": 1,
        "end": 19,
        "object": {
          "type": "Identifier",
          "start": 1,
          "end": 9,
          "name": "Function"
        },
        "property": {
          "type": "Identifier",
          "start": 10,
          "end": 19,
          "name": "prototype"
        },
        "computed": false,
        "optional": false
      },
      "property": {
        "type": "Identifier",
        "start": 20,
        "end": 24,
        "name": "bind"
      },
      "computed": false,
      "optional": false
    },
    "right": {
      "type": "FunctionExpression",
      "start": 27,
      "end": 294,
      "id": null,
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "RestElement",
          "start": 37,
          "end": 45,
          "argument": {
            "type": "Identifier",
            "start": 40,
            "end": 45,
            "name": "args1"
          }
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 47,
        "end": 294,
        "body": [
          {
            "type": "VariableDeclaration",
            "start": 51,
            "end": 70,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 57,
                "end": 69,
                "id": {
                  "type": "Identifier",
                  "start": 57,
                  "end": 62,
                  "name": "_this"
                },
                "init": {
                  "type": "ThisExpression",
                  "start": 65,
                  "end": 69
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "IfStatement",
            "start": 73,
            "end": 207,
            "test": {
              "type": "BinaryExpression",
              "start": 77,
              "end": 104,
              "left": {
                "type": "UnaryExpression",
                "start": 77,
                "end": 89,
                "operator": "typeof",
                "prefix": true,
                "argument": {
                  "type": "Identifier",
                  "start": 84,
                  "end": 89,
                  "name": "_this"
                }
              },
              "operator": "!==",
              "right": {
                "type": "Literal",
                "start": 94,
                "end": 104,
                "value": "function",
                "raw": "'function'"
              }
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 106,
              "end": 207,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 112,
                  "end": 148,
                  "expression": {
                    "type": "CallExpression",
                    "start": 112,
                    "end": 147,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 112,
                      "end": 123,
                      "object": {
                        "type": "Identifier",
                        "start": 112,
                        "end": 119,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 120,
                        "end": 123,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 124,
                        "end": 129,
                        "name": "_this"
                      },
                      {
                        "type": "UnaryExpression",
                        "start": 132,
                        "end": 144,
                        "operator": "typeof",
                        "prefix": true,
                        "argument": {
                          "type": "Identifier",
                          "start": 139,
                          "end": 144,
                          "name": "_this"
                        }
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ThrowStatement",
                  "start": 153,
                  "end": 203,
                  "argument": {
                    "type": "NewExpression",
                    "start": 159,
                    "end": 202,
                    "callee": {
                      "type": "Identifier",
                      "start": 163,
                      "end": 168,
                      "name": "Error"
                    },
                    "arguments": [
                      {
                        "type": "BinaryExpression",
                        "start": 169,
                        "end": 201,
                        "left": {
                          "type": "BinaryExpression",
                          "start": 169,
                          "end": 196,
                          "left": {
                            "type": "Literal",
                            "start": 169,
                            "end": 180,
                            "value": "bind不能作用在",
                            "raw": "'bind不能作用在'"
                          },
                          "operator": "+",
                          "right": {
                            "type": "UnaryExpression",
                            "start": 183,
                            "end": 195,
                            "operator": "typeof",
                            "prefix": true,
                            "argument": {
                              "type": "Identifier",
                              "start": 190,
                              "end": 195,
                              "name": "_this"
                            }
                          }
                        },
                        "operator": "+",
                        "right": {
                          "type": "Literal",
                          "start": 198,
                          "end": 201,
                          "value": "上",
                          "raw": "'上'"
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
            "type": "ReturnStatement",
            "start": 213,
            "end": 292,
            "argument": {
              "type": "FunctionExpression",
              "start": 220,
              "end": 292,
              "id": {
                "type": "Identifier",
                "start": 229,
                "end": 233,
                "name": "bind"
              },
              "expression": false,
              "generator": false,
              "async": false,
              "params": [
                {
                  "type": "RestElement",
                  "start": 234,
                  "end": 242,
                  "argument": {
                    "type": "Identifier",
                    "start": 237,
                    "end": 242,
                    "name": "args2"
                  }
                }
              ],
              "body": {
                "type": "BlockStatement",
                "start": 244,
                "end": 292,
                "body": [
                  {
                    "type": "ReturnStatement",
                    "start": 250,
                    "end": 288,
                    "argument": {
                      "type": "CallExpression",
                      "start": 257,
                      "end": 287,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 257,
                        "end": 267,
                        "object": {
                          "type": "Identifier",
                          "start": 257,
                          "end": 262,
                          "name": "_this"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 263,
                          "end": 267,
                          "name": "call"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "SpreadElement",
                          "start": 268,
                          "end": 276,
                          "argument": {
                            "type": "Identifier",
                            "start": 271,
                            "end": 276,
                            "name": "args1"
                          }
                        },
                        {
                          "type": "SpreadElement",
                          "start": 278,
                          "end": 286,
                          "argument": {
                            "type": "Identifier",
                            "start": 281,
                            "end": 286,
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
    }
  }
}