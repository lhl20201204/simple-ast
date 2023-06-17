const code = `
function test () {
  // var 没有作用域会提升，所以得先解决这个提升问题。
  // eg: 1 g被提到了这里
  function test () {
  // var 没有作用域会提升，所以得先解决这个提升问题。
  // 这里的g赋值实际上是下面那个var造成的
  console.log(g)
  // 这个g是下面for循环里的g提升
for( g  of [1, 2]){
   const g = 1
   console.log(g) // 1
}
console.log('window.g', window.g) // undefined

} /* function end */

console.log('还未运行', pp, g) // undefined undefined
test ()
console.log('上面的forof 结束后g变成这里的2', pp, g) // undefined 2
  // 这里的g赋值实际上是下面那个var造成的
  // eg: 1
for(var g = 1; g < 6; g++){
  console.log(g, window.g)
  var ffff = 2;
  if (g === 3) {
    continue;
  }
  for(let tt of [1, 2,3]) {
      var dfsd = 1;
     if (tt === 2) {
       continue
     }

      console.log(g, tt, g * tt)
    if (g === 2){
      console.log('本轮只打印一次')
      break;
    }
  }
  if (g === 4) {
    break;
  }
}


if (false) {
  var hhhh = 'fdsfd'
  for(const x of [1]){
    var pp = 0;
  }
} else {
  var gggg = 'dfsdf'
}

} /* function end */


test ()`
export const _ast13 = {
  "type": "Program",
  "start": 0,
  "end": 1036,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 1007,
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
        "end": 1007,
        "body": [
          {
            "type": "FunctionDeclaration",
            "start": 78,
            "end": 321,
            "id": {
              "type": "Identifier",
              "start": 87,
              "end": 91,
              "name": "test"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 95,
              "end": 321,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 163,
                  "end": 177,
                  "expression": {
                    "type": "CallExpression",
                    "start": 163,
                    "end": 177,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 163,
                      "end": 174,
                      "object": {
                        "type": "Identifier",
                        "start": 163,
                        "end": 170,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 171,
                        "end": 174,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 175,
                        "end": 176,
                        "name": "g"
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "ForOfStatement",
                  "start": 204,
                  "end": 269,
                  "await": false,
                  "left": {
                    "type": "Identifier",
                    "start": 209,
                    "end": 210,
                    "name": "g"
                  },
                  "right": {
                    "type": "ArrayExpression",
                    "start": 215,
                    "end": 221,
                    "elements": [
                      {
                        "type": "Literal",
                        "start": 216,
                        "end": 217,
                        "value": 1,
                        "raw": "1"
                      },
                      {
                        "type": "Literal",
                        "start": 219,
                        "end": 220,
                        "value": 2,
                        "raw": "2"
                      }
                    ]
                  },
                  "body": {
                    "type": "BlockStatement",
                    "start": 222,
                    "end": 269,
                    "body": [
                      {
                        "type": "VariableDeclaration",
                        "start": 229,
                        "end": 240,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 235,
                            "end": 240,
                            "id": {
                              "type": "Identifier",
                              "start": 235,
                              "end": 236,
                              "name": "g"
                            },
                            "init": {
                              "type": "Literal",
                              "start": 239,
                              "end": 240,
                              "value": 1,
                              "raw": "1"
                            }
                          }
                        ],
                        "kind": "const"
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 246,
                        "end": 260,
                        "expression": {
                          "type": "CallExpression",
                          "start": 246,
                          "end": 260,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 246,
                            "end": 257,
                            "object": {
                              "type": "Identifier",
                              "start": 246,
                              "end": 253,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 254,
                              "end": 257,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 258,
                              "end": 259,
                              "name": "g"
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
                  "start": 272,
                  "end": 305,
                  "expression": {
                    "type": "CallExpression",
                    "start": 272,
                    "end": 305,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 272,
                      "end": 283,
                      "object": {
                        "type": "Identifier",
                        "start": 272,
                        "end": 279,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 280,
                        "end": 283,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Literal",
                        "start": 284,
                        "end": 294,
                        "value": "window.g",
                        "raw": "'window.g'"
                      },
                      {
                        "type": "MemberExpression",
                        "start": 296,
                        "end": 304,
                        "object": {
                          "type": "Identifier",
                          "start": 296,
                          "end": 302,
                          "name": "window"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 303,
                          "end": 304,
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
          {
            "type": "ExpressionStatement",
            "start": 342,
            "end": 368,
            "expression": {
              "type": "CallExpression",
              "start": 342,
              "end": 368,
              "callee": {
                "type": "MemberExpression",
                "start": 342,
                "end": 353,
                "object": {
                  "type": "Identifier",
                  "start": 342,
                  "end": 349,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 350,
                  "end": 353,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 354,
                  "end": 360,
                  "value": "还未运行",
                  "raw": "'还未运行'"
                },
                {
                  "type": "Identifier",
                  "start": 362,
                  "end": 364,
                  "name": "pp"
                },
                {
                  "type": "Identifier",
                  "start": 366,
                  "end": 367,
                  "name": "g"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 392,
            "end": 399,
            "expression": {
              "type": "CallExpression",
              "start": 392,
              "end": 399,
              "callee": {
                "type": "Identifier",
                "start": 392,
                "end": 396,
                "name": "test"
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 400,
            "end": 441,
            "expression": {
              "type": "CallExpression",
              "start": 400,
              "end": 441,
              "callee": {
                "type": "MemberExpression",
                "start": 400,
                "end": 411,
                "object": {
                  "type": "Identifier",
                  "start": 400,
                  "end": 407,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 408,
                  "end": 411,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 412,
                  "end": 433,
                  "value": "上面的forof 结束后g变成这里的2",
                  "raw": "'上面的forof 结束后g变成这里的2'"
                },
                {
                  "type": "Identifier",
                  "start": 435,
                  "end": 437,
                  "name": "pp"
                },
                {
                  "type": "Identifier",
                  "start": 439,
                  "end": 440,
                  "name": "g"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ForStatement",
            "start": 500,
            "end": 875,
            "init": {
              "type": "VariableDeclaration",
              "start": 504,
              "end": 513,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 508,
                  "end": 513,
                  "id": {
                    "type": "Identifier",
                    "start": 508,
                    "end": 509,
                    "name": "g"
                  },
                  "init": {
                    "type": "Literal",
                    "start": 512,
                    "end": 513,
                    "value": 1,
                    "raw": "1"
                  }
                }
              ],
              "kind": "var"
            },
            "test": {
              "type": "BinaryExpression",
              "start": 515,
              "end": 520,
              "left": {
                "type": "Identifier",
                "start": 515,
                "end": 516,
                "name": "g"
              },
              "operator": "<",
              "right": {
                "type": "Literal",
                "start": 519,
                "end": 520,
                "value": 6,
                "raw": "6"
              }
            },
            "update": {
              "type": "UpdateExpression",
              "start": 522,
              "end": 525,
              "operator": "++",
              "prefix": false,
              "argument": {
                "type": "Identifier",
                "start": 522,
                "end": 523,
                "name": "g"
              }
            },
            "body": {
              "type": "BlockStatement",
              "start": 526,
              "end": 875,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 532,
                  "end": 556,
                  "expression": {
                    "type": "CallExpression",
                    "start": 532,
                    "end": 556,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 532,
                      "end": 543,
                      "object": {
                        "type": "Identifier",
                        "start": 532,
                        "end": 539,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 540,
                        "end": 543,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 544,
                        "end": 545,
                        "name": "g"
                      },
                      {
                        "type": "MemberExpression",
                        "start": 547,
                        "end": 555,
                        "object": {
                          "type": "Identifier",
                          "start": 547,
                          "end": 553,
                          "name": "window"
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 554,
                          "end": 555,
                          "name": "g"
                        },
                        "computed": false,
                        "optional": false
                      }
                    ],
                    "optional": false
                  }
                },
                {
                  "type": "VariableDeclaration",
                  "start": 561,
                  "end": 574,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 565,
                      "end": 573,
                      "id": {
                        "type": "Identifier",
                        "start": 565,
                        "end": 569,
                        "name": "ffff"
                      },
                      "init": {
                        "type": "Literal",
                        "start": 572,
                        "end": 573,
                        "value": 2,
                        "raw": "2"
                      }
                    }
                  ],
                  "kind": "var"
                },
                {
                  "type": "IfStatement",
                  "start": 579,
                  "end": 615,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 583,
                    "end": 590,
                    "left": {
                      "type": "Identifier",
                      "start": 583,
                      "end": 584,
                      "name": "g"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 589,
                      "end": 590,
                      "value": 3,
                      "raw": "3"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 592,
                    "end": 615,
                    "body": [
                      {
                        "type": "ContinueStatement",
                        "start": 600,
                        "end": 609,
                        "label": null
                      }
                    ]
                  },
                  "alternate": null
                },
                {
                  "type": "ForOfStatement",
                  "start": 620,
                  "end": 833,
                  "await": false,
                  "left": {
                    "type": "VariableDeclaration",
                    "start": 624,
                    "end": 630,
                    "declarations": [
                      {
                        "type": "VariableDeclarator",
                        "start": 628,
                        "end": 630,
                        "id": {
                          "type": "Identifier",
                          "start": 628,
                          "end": 630,
                          "name": "tt"
                        },
                        "init": null
                      }
                    ],
                    "kind": "let"
                  },
                  "right": {
                    "type": "ArrayExpression",
                    "start": 634,
                    "end": 642,
                    "elements": [
                      {
                        "type": "Literal",
                        "start": 635,
                        "end": 636,
                        "value": 1,
                        "raw": "1"
                      },
                      {
                        "type": "Literal",
                        "start": 638,
                        "end": 639,
                        "value": 2,
                        "raw": "2"
                      },
                      {
                        "type": "Literal",
                        "start": 640,
                        "end": 641,
                        "value": 3,
                        "raw": "3"
                      }
                    ]
                  },
                  "body": {
                    "type": "BlockStatement",
                    "start": 644,
                    "end": 833,
                    "body": [
                      {
                        "type": "VariableDeclaration",
                        "start": 654,
                        "end": 667,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 658,
                            "end": 666,
                            "id": {
                              "type": "Identifier",
                              "start": 658,
                              "end": 662,
                              "name": "dfsd"
                            },
                            "init": {
                              "type": "Literal",
                              "start": 665,
                              "end": 666,
                              "value": 1,
                              "raw": "1"
                            }
                          }
                        ],
                        "kind": "var"
                      },
                      {
                        "type": "IfStatement",
                        "start": 675,
                        "end": 717,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 679,
                          "end": 687,
                          "left": {
                            "type": "Identifier",
                            "start": 679,
                            "end": 681,
                            "name": "tt"
                          },
                          "operator": "===",
                          "right": {
                            "type": "Literal",
                            "start": 686,
                            "end": 687,
                            "value": 2,
                            "raw": "2"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 689,
                          "end": 717,
                          "body": [
                            {
                              "type": "ContinueStatement",
                              "start": 700,
                              "end": 708,
                              "label": null
                            }
                          ]
                        },
                        "alternate": null
                      },
                      {
                        "type": "ExpressionStatement",
                        "start": 727,
                        "end": 753,
                        "expression": {
                          "type": "CallExpression",
                          "start": 727,
                          "end": 753,
                          "callee": {
                            "type": "MemberExpression",
                            "start": 727,
                            "end": 738,
                            "object": {
                              "type": "Identifier",
                              "start": 727,
                              "end": 734,
                              "name": "console"
                            },
                            "property": {
                              "type": "Identifier",
                              "start": 735,
                              "end": 738,
                              "name": "log"
                            },
                            "computed": false,
                            "optional": false
                          },
                          "arguments": [
                            {
                              "type": "Identifier",
                              "start": 739,
                              "end": 740,
                              "name": "g"
                            },
                            {
                              "type": "Identifier",
                              "start": 742,
                              "end": 744,
                              "name": "tt"
                            },
                            {
                              "type": "BinaryExpression",
                              "start": 746,
                              "end": 752,
                              "left": {
                                "type": "Identifier",
                                "start": 746,
                                "end": 747,
                                "name": "g"
                              },
                              "operator": "*",
                              "right": {
                                "type": "Identifier",
                                "start": 750,
                                "end": 752,
                                "name": "tt"
                              }
                            }
                          ],
                          "optional": false
                        }
                      },
                      {
                        "type": "IfStatement",
                        "start": 760,
                        "end": 827,
                        "test": {
                          "type": "BinaryExpression",
                          "start": 764,
                          "end": 771,
                          "left": {
                            "type": "Identifier",
                            "start": 764,
                            "end": 765,
                            "name": "g"
                          },
                          "operator": "===",
                          "right": {
                            "type": "Literal",
                            "start": 770,
                            "end": 771,
                            "value": 2,
                            "raw": "2"
                          }
                        },
                        "consequent": {
                          "type": "BlockStatement",
                          "start": 772,
                          "end": 827,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 782,
                              "end": 804,
                              "expression": {
                                "type": "CallExpression",
                                "start": 782,
                                "end": 804,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 782,
                                  "end": 793,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 782,
                                    "end": 789,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 790,
                                    "end": 793,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 794,
                                    "end": 803,
                                    "value": "本轮只打印一次",
                                    "raw": "'本轮只打印一次'"
                                  }
                                ],
                                "optional": false
                              }
                            },
                            {
                              "type": "BreakStatement",
                              "start": 813,
                              "end": 819,
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
                  "type": "IfStatement",
                  "start": 838,
                  "end": 871,
                  "test": {
                    "type": "BinaryExpression",
                    "start": 842,
                    "end": 849,
                    "left": {
                      "type": "Identifier",
                      "start": 842,
                      "end": 843,
                      "name": "g"
                    },
                    "operator": "===",
                    "right": {
                      "type": "Literal",
                      "start": 848,
                      "end": 849,
                      "value": 4,
                      "raw": "4"
                    }
                  },
                  "consequent": {
                    "type": "BlockStatement",
                    "start": 851,
                    "end": 871,
                    "body": [
                      {
                        "type": "BreakStatement",
                        "start": 859,
                        "end": 865,
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
            "type": "IfStatement",
            "start": 880,
            "end": 1002,
            "test": {
              "type": "Literal",
              "start": 884,
              "end": 889,
              "value": false,
              "raw": "false"
            },
            "consequent": {
              "type": "BlockStatement",
              "start": 891,
              "end": 968,
              "body": [
                {
                  "type": "VariableDeclaration",
                  "start": 897,
                  "end": 915,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 901,
                      "end": 915,
                      "id": {
                        "type": "Identifier",
                        "start": 901,
                        "end": 905,
                        "name": "hhhh"
                      },
                      "init": {
                        "type": "Literal",
                        "start": 908,
                        "end": 915,
                        "value": "fdsfd",
                        "raw": "'fdsfd'"
                      }
                    }
                  ],
                  "kind": "var"
                },
                {
                  "type": "ForOfStatement",
                  "start": 920,
                  "end": 964,
                  "await": false,
                  "left": {
                    "type": "VariableDeclaration",
                    "start": 924,
                    "end": 931,
                    "declarations": [
                      {
                        "type": "VariableDeclarator",
                        "start": 930,
                        "end": 931,
                        "id": {
                          "type": "Identifier",
                          "start": 930,
                          "end": 931,
                          "name": "x"
                        },
                        "init": null
                      }
                    ],
                    "kind": "const"
                  },
                  "right": {
                    "type": "ArrayExpression",
                    "start": 935,
                    "end": 938,
                    "elements": [
                      {
                        "type": "Literal",
                        "start": 936,
                        "end": 937,
                        "value": 1,
                        "raw": "1"
                      }
                    ]
                  },
                  "body": {
                    "type": "BlockStatement",
                    "start": 939,
                    "end": 964,
                    "body": [
                      {
                        "type": "VariableDeclaration",
                        "start": 947,
                        "end": 958,
                        "declarations": [
                          {
                            "type": "VariableDeclarator",
                            "start": 951,
                            "end": 957,
                            "id": {
                              "type": "Identifier",
                              "start": 951,
                              "end": 953,
                              "name": "pp"
                            },
                            "init": {
                              "type": "Literal",
                              "start": 956,
                              "end": 957,
                              "value": 0,
                              "raw": "0"
                            }
                          }
                        ],
                        "kind": "var"
                      }
                    ]
                  }
                }
              ]
            },
            "alternate": {
              "type": "BlockStatement",
              "start": 974,
              "end": 1002,
              "body": [
                {
                  "type": "VariableDeclaration",
                  "start": 980,
                  "end": 998,
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "start": 984,
                      "end": 998,
                      "id": {
                        "type": "Identifier",
                        "start": 984,
                        "end": 988,
                        "name": "gggg"
                      },
                      "init": {
                        "type": "Literal",
                        "start": 991,
                        "end": 998,
                        "value": "dfsdf",
                        "raw": "'dfsdf'"
                      }
                    }
                  ],
                  "kind": "var"
                }
              ]
            }
          }
        ]
      }
    },
    {
      "type": "ExpressionStatement",
      "start": 1029,
      "end": 1036,
      "expression": {
        "type": "CallExpression",
        "start": 1029,
        "end": 1036,
        "callee": {
          "type": "Identifier",
          "start": 1029,
          "end": 1033,
          "name": "test"
        },
        "arguments": [],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}