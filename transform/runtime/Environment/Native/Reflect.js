// 后续优化生成ast性能后，直接仿照原生js的eval函数，不用写ast，现在暂时用ast替代
const code = `
class Reflect extends Object{
  static _superPropBase(object, property) {
      while (!object.hasOwnProperty(property)) {
          object = object.__proto__;
          if (object === null) {
            break;
          } 
      }
      return object;
  }
  
  static set (target, property, value, receiver) {
    receiver = receiver || target;
    const base = Reflect._superPropBase(target, property);
	 let desc;
	 if (base) {
	 	desc = Reflect.getOwnPropertyDescriptor(base, property);
	 	if (desc.set) {
	 		desc.set.call(receiver, value);
	 		return true;
	 	} else if (!desc.writable) {
	 		return false;
	 	}
	 }
	 desc = Reflect.getOwnPropertyDescriptor(receiver, property);
	 if (desc) {
	 	if (!desc.writable) {
	 		return false;
	 	}
	 	desc.value = value;
	 	Reflect.defineProperty(receiver, property, desc);
	 } else {
	 	receiver[property] = value;
	 }
	 return true;
   }
   
  static get (target, property, receiver) {
            const base = Reflect._superPropBase(target, property);
			if (!base) {
              return void 0;
            }
			const desc = Reflect.getOwnPropertyDescriptor(base, property);
			if (desc.get) {
			  return desc.get.call(receiver || target);
			}
		  return desc.value;
  }
   
  static deleteProperty (target, propertyKey) {
       delete target[propertyKey]
  }
 }
`

export const _reflectAst =  {
  "type": "ClassDeclaration",
  "start": 1,
  "end": 1321,
  "id": {
    "type": "Identifier",
    "start": 7,
    "end": 14,
    "name": "Reflect"
  },
  "superClass": {
    "type": "Identifier",
    "start": 23,
    "end": 29,
    "name": "Object"
  },
  "body": {
    "type": "ClassBody",
    "start": 29,
    "end": 1321,
    "body": [
      {
        "type": "MethodDefinition",
        "start": 33,
        "end": 258,
        "static": true,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 40,
          "end": 54,
          "name": "_superPropBase"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 54,
          "end": 258,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "Identifier",
              "start": 55,
              "end": 61,
              "name": "object"
            },
            {
              "type": "Identifier",
              "start": 63,
              "end": 71,
              "name": "property"
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 73,
            "end": 258,
            "body": [
              {
                "type": "WhileStatement",
                "start": 81,
                "end": 233,
                "test": {
                  "type": "UnaryExpression",
                  "start": 88,
                  "end": 120,
                  "operator": "!",
                  "prefix": true,
                  "argument": {
                    "type": "CallExpression",
                    "start": 89,
                    "end": 120,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 89,
                      "end": 110,
                      "object": {
                        "type": "Identifier",
                        "start": 89,
                        "end": 95,
                        "name": "object"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 96,
                        "end": 110,
                        "name": "hasOwnProperty"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 111,
                        "end": 119,
                        "name": "property"
                      }
                    ],
                    "optional": false
                  }
                },
                "body": {
                  "type": "BlockStatement",
                  "start": 122,
                  "end": 233,
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "start": 134,
                      "end": 160,
                      "expression": {
                        "type": "AssignmentExpression",
                        "start": 134,
                        "end": 159,
                        "operator": "=",
                        "left": {
                          "type": "Identifier",
                          "start": 134,
                          "end": 140,
                          "name": "object"
                        },
                        "right": {
                          "type": "MemberExpression",
                          "start": 143,
                          "end": 159,
                          "object": {
                            "type": "Identifier",
                            "start": 143,
                            "end": 149,
                            "name": "object"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 150,
                            "end": 159,
                            "name": "__proto__"
                          },
                          "computed": false,
                          "optional": false
                        }
                      }
                    },
                    {
                      "type": "IfStatement",
                      "start": 171,
                      "end": 224,
                      "test": {
                        "type": "BinaryExpression",
                        "start": 175,
                        "end": 190,
                        "left": {
                          "type": "Identifier",
                          "start": 175,
                          "end": 181,
                          "name": "object"
                        },
                        "operator": "===",
                        "right": {
                          "type": "Literal",
                          "start": 186,
                          "end": 190,
                          "value": null,
                          "raw": "null"
                        }
                      },
                      "consequent": {
                        "type": "BlockStatement",
                        "start": 192,
                        "end": 224,
                        "body": [
                          {
                            "type": "BreakStatement",
                            "start": 206,
                            "end": 212,
                            "label": null
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
                "start": 240,
                "end": 254,
                "argument": {
                  "type": "Identifier",
                  "start": 247,
                  "end": 253,
                  "name": "object"
                }
              }
            ]
          }
        }
      },
      {
        "type": "MethodDefinition",
        "start": 264,
        "end": 890,
        "static": true,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 271,
          "end": 274,
          "name": "set"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 275,
          "end": 890,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "Identifier",
              "start": 276,
              "end": 282,
              "name": "target"
            },
            {
              "type": "Identifier",
              "start": 284,
              "end": 292,
              "name": "property"
            },
            {
              "type": "Identifier",
              "start": 294,
              "end": 299,
              "name": "value"
            },
            {
              "type": "Identifier",
              "start": 301,
              "end": 309,
              "name": "receiver"
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 311,
            "end": 890,
            "body": [
              {
                "type": "ExpressionStatement",
                "start": 317,
                "end": 347,
                "expression": {
                  "type": "AssignmentExpression",
                  "start": 317,
                  "end": 346,
                  "operator": "=",
                  "left": {
                    "type": "Identifier",
                    "start": 317,
                    "end": 325,
                    "name": "receiver"
                  },
                  "right": {
                    "type": "LogicalExpression",
                    "start": 328,
                    "end": 346,
                    "left": {
                      "type": "Identifier",
                      "start": 328,
                      "end": 336,
                      "name": "receiver"
                    },
                    "operator": "||",
                    "right": {
                      "type": "Identifier",
                      "start": 340,
                      "end": 346,
                      "name": "target"
                    }
                  }
                }
              },
              {
                "type": "VariableDeclaration",
                "start": 352,
                "end": 406,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 358,
                    "end": 405,
                    "id": {
                      "type": "Identifier",
                      "start": 358,
                      "end": 362,
                      "name": "base"
                    },
                    "init": {
                      "type": "CallExpression",
                      "start": 365,
                      "end": 405,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 365,
                        "end": 387,
                        "object": {
                          "type": "Identifier",
                          "start": 365,
                          "end": 372,
                          "name": "Reflect"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 373,
                          "end": 387,
                          "name": "_superPropBase"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "Identifier",
                          "start": 388,
                          "end": 394,
                          "name": "target"
                        },
                        {
                          "type": "Identifier",
                          "start": 396,
                          "end": 404,
                          "name": "property"
                        }
                      ],
                      "optional": false
                    }
                  }
                ],
                "kind": "const"
              },
              {
                "type": "VariableDeclaration",
                "start": 409,
                "end": 418,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 413,
                    "end": 417,
                    "id": {
                      "type": "Identifier",
                      "start": 413,
                      "end": 417,
                      "name": "desc"
                    },
                    "init": null
                  }
                ],
                "kind": "let"
              },
              {
                "type": "IfStatement",
                "start": 421,
                "end": 623,
                "test": {
                  "type": "Identifier",
                  "start": 425,
                  "end": 429,
                  "name": "base"
                },
                "consequent": {
                  "type": "BlockStatement",
                  "start": 431,
                  "end": 623,
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "start": 436,
                      "end": 492,
                      "expression": {
                        "type": "AssignmentExpression",
                        "start": 436,
                        "end": 491,
                        "operator": "=",
                        "left": {
                          "type": "Identifier",
                          "start": 436,
                          "end": 440,
                          "name": "desc"
                        },
                        "right": {
                          "type": "CallExpression",
                          "start": 443,
                          "end": 491,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 443,
                            "end": 475,
                            "object": {
                              "type": "Identifier",
                              "start": 443,
                              "end": 450,
                              "name": "Reflect"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 451,
                              "end": 475,
                              "name": "getOwnPropertyDescriptor"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 476,
                              "end": 480,
                              "name": "base"
                            },
                            {
                              "type": "Identifier",
                              "start": 482,
                              "end": 490,
                              "name": "property"
                            }
                          ],
                          "optional": false
                        }
                      }
                    },
                    {
                      "type": "IfStatement",
                      "start": 496,
                      "end": 619,
                      "test": {
                        "type": "MemberExpression",
                        "start": 500,
                        "end": 508,
                        "object": {
                          "type": "Identifier",
                          "start": 500,
                          "end": 504,
                          "name": "desc"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 505,
                          "end": 508,
                          "name": "set"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "consequent": {
                        "type": "BlockStatement",
                        "start": 510,
                        "end": 569,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 516,
                            "end": 547,
                            "expression": {
                              "type": "CallExpression",
                              "start": 516,
                              "end": 546,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 516,
                                "end": 529,
                                "object": {
                                  "type": "MemberExpression",
                                  "start": 516,
                                  "end": 524,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 516,
                                    "end": 520,
                                    "name": "desc"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 521,
                                    "end": 524,
                                    "name": "set"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 525,
                                  "end": 529,
                                  "name": "call"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Identifier",
                                  "start": 530,
                                  "end": 538,
                                  "name": "receiver"
                                },
                                {
                                  "type": "Identifier",
                                  "start": 540,
                                  "end": 545,
                                  "name": "value"
                                }
                              ],
                              "optional": false
                            }
                          },
                          {
                            "type": "ReturnStatement",
                            "start": 552,
                            "end": 564,
                            "argument": {
                              "type": "Literal",
                              "start": 559,
                              "end": 563,
                              "value": true,
                              "raw": "true"
                            }
                          }
                        ]
                      },
                      "alternate": {
                        "type": "IfStatement",
                        "start": 575,
                        "end": 619,
                        "test": {
                          "type": "UnaryExpression",
                          "start": 579,
                          "end": 593,
                          "operator": "!",
                          "prefix": true,
                          "argument": {
                            "type": "MemberExpression",
                            "start": 580,
                            "end": 593,
                            "object": {
                              "type": "Identifier",
                              "start": 580,
                              "end": 584,
                              "name": "desc"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 585,
                              "end": 593,
                              "name": "writable"
                            },
                            "computed": false,
                            "optional": false
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 595,
                          "end": 619,
                          "body": [
                            {
                              "type": "ReturnStatement",
                              "start": 601,
                              "end": 614,
                              "argument": {
                                "type": "Literal",
                                "start": 608,
                                "end": 613,
                                "value": false,
                                "raw": "false"
                              }
                            }
                          ]
                        },
                        "alternate": null
                      }
                    }
                  ]
                },
                "alternate": null
              },
              {
                "type": "ExpressionStatement",
                "start": 626,
                "end": 686,
                "expression": {
                  "type": "AssignmentExpression",
                  "start": 626,
                  "end": 685,
                  "operator": "=",
                  "left": {
                    "type": "Identifier",
                    "start": 626,
                    "end": 630,
                    "name": "desc"
                  },
                  "right": {
                    "type": "CallExpression",
                    "start": 633,
                    "end": 685,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 633,
                      "end": 665,
                      "object": {
                        "type": "Identifier",
                        "start": 633,
                        "end": 640,
                        "name": "Reflect"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 641,
                        "end": 665,
                        "name": "getOwnPropertyDescriptor"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 666,
                        "end": 674,
                        "name": "receiver"
                      },
                      {
                        "type": "Identifier",
                        "start": 676,
                        "end": 684,
                        "name": "property"
                      }
                    ],
                    "optional": false
                  }
                }
              },
              {
                "type": "IfStatement",
                "start": 689,
                "end": 870,
                "test": {
                  "type": "Identifier",
                  "start": 693,
                  "end": 697,
                  "name": "desc"
                },
                "consequent": {
                  "type": "BlockStatement",
                  "start": 699,
                  "end": 828,
                  "body": [
                    {
                      "type": "IfStatement",
                      "start": 704,
                      "end": 748,
                      "test": {
                        "type": "UnaryExpression",
                        "start": 708,
                        "end": 722,
                        "operator": "!",
                        "prefix": true,
                        "argument": {
                          "type": "MemberExpression",
                          "start": 709,
                          "end": 722,
                          "object": {
                            "type": "Identifier",
                            "start": 709,
                            "end": 713,
                            "name": "desc"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 714,
                            "end": 722,
                            "name": "writable"
                          },
                          "computed": false,
                          "optional": false
                        }
                      },
                      "consequent": {
                        "type": "BlockStatement",
                        "start": 724,
                        "end": 748,
                        "body": [
                          {
                            "type": "ReturnStatement",
                            "start": 730,
                            "end": 743,
                            "argument": {
                              "type": "Literal",
                              "start": 737,
                              "end": 742,
                              "value": false,
                              "raw": "false"
                            }
                          }
                        ]
                      },
                      "alternate": null
                    },
                    {
                      "type": "ExpressionStatement",
                      "start": 752,
                      "end": 771,
                      "expression": {
                        "type": "AssignmentExpression",
                        "start": 752,
                        "end": 770,
                        "operator": "=",
                        "left": {
                          "type": "MemberExpression",
                          "start": 752,
                          "end": 762,
                          "object": {
                            "type": "Identifier",
                            "start": 752,
                            "end": 756,
                            "name": "desc"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 757,
                            "end": 762,
                            "name": "value"
                          },
                          "computed": false,
                          "optional": false
                        },
                        "right": {
                          "type": "Identifier",
                          "start": 765,
                          "end": 770,
                          "name": "value"
                        }
                      }
                    },
                    {
                      "type": "ExpressionStatement",
                      "start": 775,
                      "end": 824,
                      "expression": {
                        "type": "CallExpression",
                        "start": 775,
                        "end": 823,
                        "callee": {
                          "type": "MemberExpression",
                          "start": 775,
                          "end": 797,
                          "object": {
                            "type": "Identifier",
                            "start": 775,
                            "end": 782,
                            "name": "Reflect"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 783,
                            "end": 797,
                            "name": "defineProperty"
                          },
                          "computed": false,
                          "optional": false
                        },
                        "arguments": [
                          {
                            "type": "Identifier",
                            "start": 798,
                            "end": 806,
                            "name": "receiver"
                          },
                          {
                            "type": "Identifier",
                            "start": 808,
                            "end": 816,
                            "name": "property"
                          },
                          {
                            "type": "Identifier",
                            "start": 818,
                            "end": 822,
                            "name": "desc"
                          }
                        ],
                        "optional": false
                      }
                    }
                  ]
                },
                "alternate": {
                  "type": "BlockStatement",
                  "start": 834,
                  "end": 870,
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "start": 839,
                      "end": 866,
                      "expression": {
                        "type": "AssignmentExpression",
                        "start": 839,
                        "end": 865,
                        "operator": "=",
                        "left": {
                          "type": "MemberExpression",
                          "start": 839,
                          "end": 857,
                          "object": {
                            "type": "Identifier",
                            "start": 839,
                            "end": 847,
                            "name": "receiver"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 848,
                            "end": 856,
                            "name": "property"
                          },
                          "computed": true,
                          "optional": false
                        },
                        "right": {
                          "type": "Identifier",
                          "start": 860,
                          "end": 865,
                          "name": "value"
                        }
                      }
                    }
                  ]
                }
              },
              {
                "type": "ReturnStatement",
                "start": 873,
                "end": 885,
                "argument": {
                  "type": "Literal",
                  "start": 880,
                  "end": 884,
                  "value": true,
                  "raw": "true"
                }
              }
            ]
          }
        }
      },
      {
        "type": "MethodDefinition",
        "start": 897,
        "end": 1228,
        "static": true,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 904,
          "end": 907,
          "name": "get"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 908,
          "end": 1228,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "Identifier",
              "start": 909,
              "end": 915,
              "name": "target"
            },
            {
              "type": "Identifier",
              "start": 917,
              "end": 925,
              "name": "property"
            },
            {
              "type": "Identifier",
              "start": 927,
              "end": 935,
              "name": "receiver"
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 937,
            "end": 1228,
            "body": [
              {
                "type": "VariableDeclaration",
                "start": 951,
                "end": 1005,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 957,
                    "end": 1004,
                    "id": {
                      "type": "Identifier",
                      "start": 957,
                      "end": 961,
                      "name": "base"
                    },
                    "init": {
                      "type": "CallExpression",
                      "start": 964,
                      "end": 1004,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 964,
                        "end": 986,
                        "object": {
                          "type": "Identifier",
                          "start": 964,
                          "end": 971,
                          "name": "Reflect"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 972,
                          "end": 986,
                          "name": "_superPropBase"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "Identifier",
                          "start": 987,
                          "end": 993,
                          "name": "target"
                        },
                        {
                          "type": "Identifier",
                          "start": 995,
                          "end": 1003,
                          "name": "property"
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
                "start": 1009,
                "end": 1064,
                "test": {
                  "type": "UnaryExpression",
                  "start": 1013,
                  "end": 1018,
                  "operator": "!",
                  "prefix": true,
                  "argument": {
                    "type": "Identifier",
                    "start": 1014,
                    "end": 1018,
                    "name": "base"
                  }
                },
                "consequent": {
                  "type": "BlockStatement",
                  "start": 1020,
                  "end": 1064,
                  "body": [
                    {
                      "type": "ReturnStatement",
                      "start": 1036,
                      "end": 1050,
                      "argument": {
                        "type": "UnaryExpression",
                        "start": 1043,
                        "end": 1049,
                        "operator": "void",
                        "prefix": true,
                        "argument": {
                          "type": "Literal",
                          "start": 1048,
                          "end": 1049,
                          "value": 0,
                          "raw": "0"
                        }
                      }
                    }
                  ]
                },
                "alternate": null
              },
              {
                "type": "VariableDeclaration",
                "start": 1068,
                "end": 1130,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 1074,
                    "end": 1129,
                    "id": {
                      "type": "Identifier",
                      "start": 1074,
                      "end": 1078,
                      "name": "desc"
                    },
                    "init": {
                      "type": "CallExpression",
                      "start": 1081,
                      "end": 1129,
                      "callee": {
                        "type": "MemberExpression",
                        "start": 1081,
                        "end": 1113,
                        "object": {
                          "type": "Identifier",
                          "start": 1081,
                          "end": 1088,
                          "name": "Reflect"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 1089,
                          "end": 1113,
                          "name": "getOwnPropertyDescriptor"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "arguments": [
                        {
                          "type": "Identifier",
                          "start": 1114,
                          "end": 1118,
                          "name": "base"
                        },
                        {
                          "type": "Identifier",
                          "start": 1120,
                          "end": 1128,
                          "name": "property"
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
                "start": 1134,
                "end": 1201,
                "test": {
                  "type": "MemberExpression",
                  "start": 1138,
                  "end": 1146,
                  "object": {
                    "type": "Identifier",
                    "start": 1138,
                    "end": 1142,
                    "name": "desc"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 1143,
                    "end": 1146,
                    "name": "get"
                  },
                  "computed": false,
                  "optional": false
                },
                "consequent": {
                  "type": "BlockStatement",
                  "start": 1148,
                  "end": 1201,
                  "body": [
                    {
                      "type": "ReturnStatement",
                      "start": 1155,
                      "end": 1196,
                      "argument": {
                        "type": "CallExpression",
                        "start": 1162,
                        "end": 1195,
                        "callee": {
                          "type": "MemberExpression",
                          "start": 1162,
                          "end": 1175,
                          "object": {
                            "type": "MemberExpression",
                            "start": 1162,
                            "end": 1170,
                            "object": {
                              "type": "Identifier",
                              "start": 1162,
                              "end": 1166,
                              "name": "desc"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 1167,
                              "end": 1170,
                              "name": "get"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 1171,
                            "end": 1175,
                            "name": "call"
                          },
                          "computed": false,
                          "optional": false
                        },
                        "arguments": [
                          {
                            "type": "LogicalExpression",
                            "start": 1176,
                            "end": 1194,
                            "left": {
                              "type": "Identifier",
                              "start": 1176,
                              "end": 1184,
                              "name": "receiver"
                            },
                            "operator": "||",
                            "right": {
                              "type": "Identifier",
                              "start": 1188,
                              "end": 1194,
                              "name": "target"
                            }
                          }
                        ],
                        "optional": false
                      }
                    }
                  ]
                },
                "alternate": null
              },
              {
                "type": "ReturnStatement",
                "start": 1206,
                "end": 1224,
                "argument": {
                  "type": "MemberExpression",
                  "start": 1213,
                  "end": 1223,
                  "object": {
                    "type": "Identifier",
                    "start": 1213,
                    "end": 1217,
                    "name": "desc"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 1218,
                    "end": 1223,
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
        "start": 1235,
        "end": 1318,
        "static": true,
        "computed": false,
        "key": {
          "type": "Identifier",
          "start": 1242,
          "end": 1256,
          "name": "deleteProperty"
        },
        "kind": "method",
        "value": {
          "type": "FunctionExpression",
          "start": 1257,
          "end": 1318,
          "id": null,
          "expression": false,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "Identifier",
              "start": 1258,
              "end": 1264,
              "name": "target"
            },
            {
              "type": "Identifier",
              "start": 1266,
              "end": 1277,
              "name": "propertyKey"
            }
          ],
          "body": {
            "type": "BlockStatement",
            "start": 1279,
            "end": 1318,
            "body": [
              {
                "type": "ExpressionStatement",
                "start": 1288,
                "end": 1314,
                "expression": {
                  "type": "UnaryExpression",
                  "start": 1288,
                  "end": 1314,
                  "operator": "delete",
                  "prefix": true,
                  "argument": {
                    "type": "MemberExpression",
                    "start": 1295,
                    "end": 1314,
                    "object": {
                      "type": "Identifier",
                      "start": 1295,
                      "end": 1301,
                      "name": "target"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 1302,
                      "end": 1313,
                      "name": "propertyKey"
                    },
                    "computed": true,
                    "optional": false
                  }
                }
              }
            ]
          }
        }
      }
    ]
  }
}