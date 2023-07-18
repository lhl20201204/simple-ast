const code = `
function test30 () {
  // function person(name) {
  //    this.name = name;
  // }
  // var p1 = new Person('foo')
  // var p2 = new Person('bar')
  
  (() => {
    console.log(this)
  })();
  
  // console.log( )
    // 1，自执行函数将类的定义包起来。
    // 1, class 先找出所有计算属性，执行一遍。
    // 2, 找出所有静态属性，执行一遍，挂载到prototype。
    // 3，找出所有定义属性，将其置于构造函数前面。
  
  
  
    this.w = '4'
    const fn = '1'
    let b = 'temp'
    const arr = []
    class A {
      ff = 'tt'
      test(){
        
      }
      hh = this.ff + A.ff() + (() => {
        console.log('runA1')
      })();
  
      [(() => {
        console.log(this, 'runA6');
        return '---'
      })()] = 'ppp'
  
      static [(() => {
        console.log('static runA7')
        return 'jijio'
      })()] = (() => {
        console.log('挂载A.prototype_1', this)
        return () => {
        return this.g
       };
      })(); 
    
      static ['kkkkkkk']
  
      static ff = (() => {
        console.log('挂载A.prototype_2', this)
        return () => {
        return this.g
       };
      })(); 
      static g = function() {
        return (this);
      };
  
      static [ fn + '2' + (() => {
        console.log('static runA4')
        return this.w 
      })()] = (() => {
        console.log('挂载A.prototype_3', this)
        return this.ff;
      })(); 
      z = 4;
      [4 + 'kkkk']
      'jkkkk'
      constructor(x){
        console.log('runA2')
        this.x = x;
      }
  
      jfg = (() => {
        console.log('runA3')
      })();
  
      ['run'] = function() {
        console.log('y自己的', this.ff + 'self')
      };
  
      static ['run2' + (() => {
        console.log('static runA5')
        return this.w;
      })()] =  (function () {
        console.log('挂载A.prototype_4', this)
        return function() {
        console.log('y自己的2', this.ff + 'self')
      };
      })();
  
      exc = arr[0]= function () {
        console.log(this, '->')
        // console.log(this.ff)
      }
  
      static run(...args){
        console.log('A类的属性this', this, ...args)
      }
    }
  
     console.log('A定义完毕')
    const obj = {
      test(flag) {
        console.log(this)
        ;(()=>{
          console.log(this)
        })();
  
        ;((function gggg(){
          console.log(this)
        }))()
  
        if (!flag) {
          const t = obj.test;
          t(true)
        }
      }
    }
  
    console.log('00000')
  
    obj.test();
    
    // A = class C{} 
  
    Function.prototype.run2 = ()=> {
      return 'this is Function prototype'
    }
  
    class B extends A{
      hf = (() => {
        console.log('runB1')
      })();
      constructor(x, y){
        super(x)
        console.log('runB2')
        this.y = y;
      }
  
      hf2 = (() => {
        console.log('runB3')
      })();
      
      static fn(){
        return this.x * this.y
      }
      
      static [fn] = b = function *(){
        yield 1;
        console.log(this)
      };
  
      [fn + fn] = async () => {
        await 2;
        console.log(this)
      }
    }
    console.log('----start---class--')
    console.log(arr[0])
    const x = new B(1, 2);
  
    const x1 = new B(3, 4);
    // 说明在new 完后， 才会执行 ast；
    console.log(arr[0])
    console.log('---------')
    console.log(x)
    const y = new A(3)
    console.log(y)
    const rrr = A.g;
    console.log('----1111-----', rrr())
    console.log('statics', A['124']())
    y.run()
    console.log('----2222-----')
    console.log(A.run2(), y.exc)
    y.exc()
    console.log('----333-----')
    const g = y.exc
    g()
    console.log('---444-----')
    A.run('1111')
    console.log('y.run2', y.run2)
  
  } /* function end */
  test30.call({test: '111'});
`

export const _ast16 = {
  "type": "Program",
  "start": 0,
  "end": 3326,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 3279,
      "id": {
        "type": "Identifier",
        "start": 9,
        "end": 15,
        "name": "test30"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 19,
        "end": 3279,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 138,
            "end": 172,
            "expression": {
              "type": "CallExpression",
              "start": 138,
              "end": 171,
              "callee": {
                "type": "ArrowFunctionExpression",
                "start": 139,
                "end": 168,
                "id": null,
                "expression": false,
                "generator": false,
                "async": false,
                "params": [],
                "body": {
                  "type": "BlockStatement",
                  "start": 145,
                  "end": 168,
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "start": 149,
                      "end": 166,
                      "expression": {
                        "type": "CallExpression",
                        "start": 149,
                        "end": 166,
                        "callee": {
                          "type": "MemberExpression",
                          "start": 149,
                          "end": 160,
                          "object": {
                            "type": "Identifier",
                            "start": 149,
                            "end": 156,
                            "name": "console"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 157,
                            "end": 160,
                            "name": "log"
                          },
                          "computed": false,
                          "optional": false
                        },
                        "arguments": [
                          {
                            "type": "ThisExpression",
                            "start": 161,
                            "end": 165
                          }
                        ],
                        "optional": false
                      }
                    }
                  ]
                }
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 313,
            "end": 325,
            "expression": {
              "type": "AssignmentExpression",
              "start": 313,
              "end": 325,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 313,
                "end": 319,
                "object": {
                  "type": "ThisExpression",
                  "start": 313,
                  "end": 317
                },
                "property": {
                  "type": "Identifier",
                  "start": 318,
                  "end": 319,
                  "name": "w"
                },
                "computed": false,
                "optional": false
              },
              "right": {
                "type": "Literal",
                "start": 322,
                "end": 325,
                "value": "4",
                "raw": "'4'"
              }
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 328,
            "end": 342,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 334,
                "end": 342,
                "id": {
                  "type": "Identifier",
                  "start": 334,
                  "end": 336,
                  "name": "fn"
                },
                "init": {
                  "type": "Literal",
                  "start": 339,
                  "end": 342,
                  "value": "1",
                  "raw": "'1'"
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 345,
            "end": 359,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 349,
                "end": 359,
                "id": {
                  "type": "Identifier",
                  "start": 349,
                  "end": 350,
                  "name": "b"
                },
                "init": {
                  "type": "Literal",
                  "start": 353,
                  "end": 359,
                  "value": "temp",
                  "raw": "'temp'"
                }
              }
            ],
            "kind": "let"
          },
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
            "type": "ClassDeclaration",
            "start": 379,
            "end": 1858,
            "id": {
              "type": "Identifier",
              "start": 385,
              "end": 386,
              "name": "A"
            },
            "superClass": null,
            "body": {
              "type": "ClassBody",
              "start": 387,
              "end": 1858,
              "body": [
                {
                  "type": "PropertyDefinition",
                  "start": 393,
                  "end": 402,
                  "static": false,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 393,
                    "end": 395,
                    "name": "ff"
                  },
                  "value": {
                    "type": "Literal",
                    "start": 398,
                    "end": 402,
                    "value": "tt",
                    "raw": "'tt'"
                  }
                },
                {
                  "type": "MethodDefinition",
                  "start": 407,
                  "end": 427,
                  "static": false,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 407,
                    "end": 411,
                    "name": "test"
                  },
                  "kind": "method",
                  "value": {
                    "type": "FunctionExpression",
                    "start": 411,
                    "end": 427,
                    "id": null,
                    "expression": false,
                    "generator": false,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "start": 413,
                      "end": 427,
                      "body": []
                    }
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 432,
                  "end": 501,
                  "static": false,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 432,
                    "end": 434,
                    "name": "hh"
                  },
                  "value": {
                    "type": "BinaryExpression",
                    "start": 437,
                    "end": 500,
                    "left": {
                      "type": "BinaryExpression",
                      "start": 437,
                      "end": 453,
                      "left": {
                        "type": "MemberExpression",
                        "start": 437,
                        "end": 444,
                        "object": {
                          "type": "ThisExpression",
                          "start": 437,
                          "end": 441
                        },
                        "property": {
                          "type": "Identifier",
                          "start": 442,
                          "end": 444,
                          "name": "ff"
                        },
                        "computed": false,
                        "optional": false
                      },
                      "operator": "+",
                      "right": {
                        "type": "CallExpression",
                        "start": 447,
                        "end": 453,
                        "callee": {
                          "type": "MemberExpression",
                          "start": 447,
                          "end": 451,
                          "object": {
                            "type": "Identifier",
                            "start": 447,
                            "end": 448,
                            "name": "A"
                          },
                          "property": {
                            "type": "Identifier",
                            "start": 449,
                            "end": 451,
                            "name": "ff"
                          },
                          "computed": false,
                          "optional": false
                        },
                        "arguments": [],
                        "optional": false
                      }
                    },
                    "operator": "+",
                    "right": {
                      "type": "CallExpression",
                      "start": 456,
                      "end": 500,
                      "callee": {
                        "type": "ArrowFunctionExpression",
                        "start": 457,
                        "end": 497,
                        "id": null,
                        "expression": false,
                        "generator": false,
                        "async": false,
                        "params": [],
                        "body": {
                          "type": "BlockStatement",
                          "start": 463,
                          "end": 497,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 471,
                              "end": 491,
                              "expression": {
                                "type": "CallExpression",
                                "start": 471,
                                "end": 491,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 471,
                                  "end": 482,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 471,
                                    "end": 478,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 479,
                                    "end": 482,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 483,
                                    "end": 490,
                                    "value": "runA1",
                                    "raw": "'runA1'"
                                  }
                                ],
                                "optional": false
                              }
                            }
                          ]
                        }
                      },
                      "arguments": [],
                      "optional": false
                    }
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 507,
                  "end": 587,
                  "static": false,
                  "computed": true,
                  "key": {
                    "type": "CallExpression",
                    "start": 508,
                    "end": 578,
                    "callee": {
                      "type": "ArrowFunctionExpression",
                      "start": 509,
                      "end": 575,
                      "id": null,
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "start": 515,
                        "end": 575,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 523,
                            "end": 550,
                            "expression": {
                              "type": "CallExpression",
                              "start": 523,
                              "end": 549,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 523,
                                "end": 534,
                                "object": {
                                  "type": "Identifier",
                                  "start": 523,
                                  "end": 530,
                                  "name": "console"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 531,
                                  "end": 534,
                                  "name": "log"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "ThisExpression",
                                  "start": 535,
                                  "end": 539
                                },
                                {
                                  "type": "Literal",
                                  "start": 541,
                                  "end": 548,
                                  "value": "runA6",
                                  "raw": "'runA6'"
                                }
                              ],
                              "optional": false
                            }
                          },
                          {
                            "type": "ReturnStatement",
                            "start": 557,
                            "end": 569,
                            "argument": {
                              "type": "Literal",
                              "start": 564,
                              "end": 569,
                              "value": "---",
                              "raw": "'---'"
                            }
                          }
                        ]
                      }
                    },
                    "arguments": [],
                    "optional": false
                  },
                  "value": {
                    "type": "Literal",
                    "start": 582,
                    "end": 587,
                    "value": "ppp",
                    "raw": "'ppp'"
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 593,
                  "end": 787,
                  "static": true,
                  "computed": true,
                  "key": {
                    "type": "CallExpression",
                    "start": 601,
                    "end": 673,
                    "callee": {
                      "type": "ArrowFunctionExpression",
                      "start": 602,
                      "end": 670,
                      "id": null,
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "start": 608,
                        "end": 670,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 616,
                            "end": 643,
                            "expression": {
                              "type": "CallExpression",
                              "start": 616,
                              "end": 643,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 616,
                                "end": 627,
                                "object": {
                                  "type": "Identifier",
                                  "start": 616,
                                  "end": 623,
                                  "name": "console"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 624,
                                  "end": 627,
                                  "name": "log"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 628,
                                  "end": 642,
                                  "value": "static runA7",
                                  "raw": "'static runA7'"
                                }
                              ],
                              "optional": false
                            }
                          },
                          {
                            "type": "ReturnStatement",
                            "start": 650,
                            "end": 664,
                            "argument": {
                              "type": "Literal",
                              "start": 657,
                              "end": 664,
                              "value": "jijio",
                              "raw": "'jijio'"
                            }
                          }
                        ]
                      }
                    },
                    "arguments": [],
                    "optional": false
                  },
                  "value": {
                    "type": "CallExpression",
                    "start": 677,
                    "end": 786,
                    "callee": {
                      "type": "ArrowFunctionExpression",
                      "start": 678,
                      "end": 783,
                      "id": null,
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "start": 684,
                        "end": 783,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 692,
                            "end": 728,
                            "expression": {
                              "type": "CallExpression",
                              "start": 692,
                              "end": 728,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 692,
                                "end": 703,
                                "object": {
                                  "type": "Identifier",
                                  "start": 692,
                                  "end": 699,
                                  "name": "console"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 700,
                                  "end": 703,
                                  "name": "log"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 704,
                                  "end": 721,
                                  "value": "挂载A.prototype_1",
                                  "raw": "'挂载A.prototype_1'"
                                },
                                {
                                  "type": "ThisExpression",
                                  "start": 723,
                                  "end": 727
                                }
                              ],
                              "optional": false
                            }
                          },
                          {
                            "type": "ReturnStatement",
                            "start": 735,
                            "end": 777,
                            "argument": {
                              "type": "ArrowFunctionExpression",
                              "start": 742,
                              "end": 776,
                              "id": null,
                              "expression": false,
                              "generator": false,
                              "async": false,
                              "params": [],
                              "body": {
                                "type": "BlockStatement",
                                "start": 748,
                                "end": 776,
                                "body": [
                                  {
                                    "type": "ReturnStatement",
                                    "start": 756,
                                    "end": 769,
                                    "argument": {
                                      "type": "MemberExpression",
                                      "start": 763,
                                      "end": 769,
                                      "object": {
                                        "type": "ThisExpression",
                                        "start": 763,
                                        "end": 767
                                      },
                                      "property": {
                                        "type": "Identifier",
                                        "start": 768,
                                        "end": 769,
                                        "name": "g"
                                      },
                                      "computed": false,
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
                    "arguments": [],
                    "optional": false
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 796,
                  "end": 814,
                  "static": true,
                  "computed": true,
                  "key": {
                    "type": "Literal",
                    "start": 804,
                    "end": 813,
                    "value": "kkkkkkk",
                    "raw": "'kkkkkkk'"
                  },
                  "value": null
                },
                {
                  "type": "PropertyDefinition",
                  "start": 820,
                  "end": 942,
                  "static": true,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 827,
                    "end": 829,
                    "name": "ff"
                  },
                  "value": {
                    "type": "CallExpression",
                    "start": 832,
                    "end": 941,
                    "callee": {
                      "type": "ArrowFunctionExpression",
                      "start": 833,
                      "end": 938,
                      "id": null,
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "start": 839,
                        "end": 938,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 847,
                            "end": 883,
                            "expression": {
                              "type": "CallExpression",
                              "start": 847,
                              "end": 883,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 847,
                                "end": 858,
                                "object": {
                                  "type": "Identifier",
                                  "start": 847,
                                  "end": 854,
                                  "name": "console"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 855,
                                  "end": 858,
                                  "name": "log"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 859,
                                  "end": 876,
                                  "value": "挂载A.prototype_2",
                                  "raw": "'挂载A.prototype_2'"
                                },
                                {
                                  "type": "ThisExpression",
                                  "start": 878,
                                  "end": 882
                                }
                              ],
                              "optional": false
                            }
                          },
                          {
                            "type": "ReturnStatement",
                            "start": 890,
                            "end": 932,
                            "argument": {
                              "type": "ArrowFunctionExpression",
                              "start": 897,
                              "end": 931,
                              "id": null,
                              "expression": false,
                              "generator": false,
                              "async": false,
                              "params": [],
                              "body": {
                                "type": "BlockStatement",
                                "start": 903,
                                "end": 931,
                                "body": [
                                  {
                                    "type": "ReturnStatement",
                                    "start": 911,
                                    "end": 924,
                                    "argument": {
                                      "type": "MemberExpression",
                                      "start": 918,
                                      "end": 924,
                                      "object": {
                                        "type": "ThisExpression",
                                        "start": 918,
                                        "end": 922
                                      },
                                      "property": {
                                        "type": "Identifier",
                                        "start": 923,
                                        "end": 924,
                                        "name": "g"
                                      },
                                      "computed": false,
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
                    "arguments": [],
                    "optional": false
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 948,
                  "end": 999,
                  "static": true,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 955,
                    "end": 956,
                    "name": "g"
                  },
                  "value": {
                    "type": "FunctionExpression",
                    "start": 959,
                    "end": 998,
                    "id": null,
                    "expression": false,
                    "generator": false,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "start": 970,
                      "end": 998,
                      "body": [
                        {
                          "type": "ReturnStatement",
                          "start": 978,
                          "end": 992,
                          "argument": {
                            "type": "ThisExpression",
                            "start": 986,
                            "end": 990
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 1005,
                  "end": 1184,
                  "static": true,
                  "computed": true,
                  "key": {
                    "type": "BinaryExpression",
                    "start": 1014,
                    "end": 1097,
                    "left": {
                      "type": "BinaryExpression",
                      "start": 1014,
                      "end": 1022,
                      "left": {
                        "type": "Identifier",
                        "start": 1014,
                        "end": 1016,
                        "name": "fn"
                      },
                      "operator": "+",
                      "right": {
                        "type": "Literal",
                        "start": 1019,
                        "end": 1022,
                        "value": "2",
                        "raw": "'2'"
                      }
                    },
                    "operator": "+",
                    "right": {
                      "type": "CallExpression",
                      "start": 1025,
                      "end": 1097,
                      "callee": {
                        "type": "ArrowFunctionExpression",
                        "start": 1026,
                        "end": 1094,
                        "id": null,
                        "expression": false,
                        "generator": false,
                        "async": false,
                        "params": [],
                        "body": {
                          "type": "BlockStatement",
                          "start": 1032,
                          "end": 1094,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 1040,
                              "end": 1067,
                              "expression": {
                                "type": "CallExpression",
                                "start": 1040,
                                "end": 1067,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 1040,
                                  "end": 1051,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 1040,
                                    "end": 1047,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 1048,
                                    "end": 1051,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 1052,
                                    "end": 1066,
                                    "value": "static runA4",
                                    "raw": "'static runA4'"
                                  }
                                ],
                                "optional": false
                              }
                            },
                            {
                              "type": "ReturnStatement",
                              "start": 1074,
                              "end": 1087,
                              "argument": {
                                "type": "MemberExpression",
                                "start": 1081,
                                "end": 1087,
                                "object": {
                                  "type": "ThisExpression",
                                  "start": 1081,
                                  "end": 1085
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 1086,
                                  "end": 1087,
                                  "name": "w"
                                },
                                "computed": false,
                                "optional": false
                              }
                            }
                          ]
                        }
                      },
                      "arguments": [],
                      "optional": false
                    }
                  },
                  "value": {
                    "type": "CallExpression",
                    "start": 1101,
                    "end": 1183,
                    "callee": {
                      "type": "ArrowFunctionExpression",
                      "start": 1102,
                      "end": 1180,
                      "id": null,
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "start": 1108,
                        "end": 1180,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 1116,
                            "end": 1152,
                            "expression": {
                              "type": "CallExpression",
                              "start": 1116,
                              "end": 1152,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 1116,
                                "end": 1127,
                                "object": {
                                  "type": "Identifier",
                                  "start": 1116,
                                  "end": 1123,
                                  "name": "console"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 1124,
                                  "end": 1127,
                                  "name": "log"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 1128,
                                  "end": 1145,
                                  "value": "挂载A.prototype_3",
                                  "raw": "'挂载A.prototype_3'"
                                },
                                {
                                  "type": "ThisExpression",
                                  "start": 1147,
                                  "end": 1151
                                }
                              ],
                              "optional": false
                            }
                          },
                          {
                            "type": "ReturnStatement",
                            "start": 1159,
                            "end": 1174,
                            "argument": {
                              "type": "MemberExpression",
                              "start": 1166,
                              "end": 1173,
                              "object": {
                                "type": "ThisExpression",
                                "start": 1166,
                                "end": 1170
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 1171,
                                "end": 1173,
                                "name": "ff"
                              },
                              "computed": false,
                              "optional": false
                            }
                          }
                        ]
                      }
                    },
                    "arguments": [],
                    "optional": false
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 1190,
                  "end": 1196,
                  "static": false,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 1190,
                    "end": 1191,
                    "name": "z"
                  },
                  "value": {
                    "type": "Literal",
                    "start": 1194,
                    "end": 1195,
                    "value": 4,
                    "raw": "4"
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 1201,
                  "end": 1213,
                  "static": false,
                  "computed": true,
                  "key": {
                    "type": "BinaryExpression",
                    "start": 1202,
                    "end": 1212,
                    "left": {
                      "type": "Literal",
                      "start": 1202,
                      "end": 1203,
                      "value": 4,
                      "raw": "4"
                    },
                    "operator": "+",
                    "right": {
                      "type": "Literal",
                      "start": 1206,
                      "end": 1212,
                      "value": "kkkk",
                      "raw": "'kkkk'"
                    }
                  },
                  "value": null
                },
                {
                  "type": "PropertyDefinition",
                  "start": 1218,
                  "end": 1225,
                  "static": false,
                  "computed": false,
                  "key": {
                    "type": "Literal",
                    "start": 1218,
                    "end": 1225,
                    "value": "jkkkk",
                    "raw": "'jkkkk'"
                  },
                  "value": null
                },
                {
                  "type": "MethodDefinition",
                  "start": 1230,
                  "end": 1296,
                  "static": false,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 1230,
                    "end": 1241,
                    "name": "constructor"
                  },
                  "kind": "constructor",
                  "value": {
                    "type": "FunctionExpression",
                    "start": 1241,
                    "end": 1296,
                    "id": null,
                    "expression": false,
                    "generator": false,
                    "async": false,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 1242,
                        "end": 1243,
                        "name": "x"
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 1244,
                      "end": 1296,
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "start": 1252,
                          "end": 1272,
                          "expression": {
                            "type": "CallExpression",
                            "start": 1252,
                            "end": 1272,
                            "callee": {
                              "type": "MemberExpression",
                              "start": 1252,
                              "end": 1263,
                              "object": {
                                "type": "Identifier",
                                "start": 1252,
                                "end": 1259,
                                "name": "console"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 1260,
                                "end": 1263,
                                "name": "log"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "arguments": [
                              {
                                "type": "Literal",
                                "start": 1264,
                                "end": 1271,
                                "value": "runA2",
                                "raw": "'runA2'"
                              }
                            ],
                            "optional": false
                          }
                        },
                        {
                          "type": "ExpressionStatement",
                          "start": 1279,
                          "end": 1290,
                          "expression": {
                            "type": "AssignmentExpression",
                            "start": 1279,
                            "end": 1289,
                            "operator": "=",
                            "left": {
                              "type": "MemberExpression",
                              "start": 1279,
                              "end": 1285,
                              "object": {
                                "type": "ThisExpression",
                                "start": 1279,
                                "end": 1283
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 1284,
                                "end": 1285,
                                "name": "x"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "right": {
                              "type": "Identifier",
                              "start": 1288,
                              "end": 1289,
                              "name": "x"
                            }
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 1302,
                  "end": 1353,
                  "static": false,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 1302,
                    "end": 1305,
                    "name": "jfg"
                  },
                  "value": {
                    "type": "CallExpression",
                    "start": 1308,
                    "end": 1352,
                    "callee": {
                      "type": "ArrowFunctionExpression",
                      "start": 1309,
                      "end": 1349,
                      "id": null,
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "start": 1315,
                        "end": 1349,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 1323,
                            "end": 1343,
                            "expression": {
                              "type": "CallExpression",
                              "start": 1323,
                              "end": 1343,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 1323,
                                "end": 1334,
                                "object": {
                                  "type": "Identifier",
                                  "start": 1323,
                                  "end": 1330,
                                  "name": "console"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 1331,
                                  "end": 1334,
                                  "name": "log"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 1335,
                                  "end": 1342,
                                  "value": "runA3",
                                  "raw": "'runA3'"
                                }
                              ],
                              "optional": false
                            }
                          }
                        ]
                      }
                    },
                    "arguments": [],
                    "optional": false
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 1359,
                  "end": 1432,
                  "static": false,
                  "computed": true,
                  "key": {
                    "type": "Literal",
                    "start": 1360,
                    "end": 1365,
                    "value": "run",
                    "raw": "'run'"
                  },
                  "value": {
                    "type": "FunctionExpression",
                    "start": 1369,
                    "end": 1431,
                    "id": null,
                    "expression": false,
                    "generator": false,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "start": 1380,
                      "end": 1431,
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "start": 1388,
                          "end": 1425,
                          "expression": {
                            "type": "CallExpression",
                            "start": 1388,
                            "end": 1425,
                            "callee": {
                              "type": "MemberExpression",
                              "start": 1388,
                              "end": 1399,
                              "object": {
                                "type": "Identifier",
                                "start": 1388,
                                "end": 1395,
                                "name": "console"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 1396,
                                "end": 1399,
                                "name": "log"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "arguments": [
                              {
                                "type": "Literal",
                                "start": 1400,
                                "end": 1406,
                                "value": "y自己的",
                                "raw": "'y自己的'"
                              },
                              {
                                "type": "BinaryExpression",
                                "start": 1408,
                                "end": 1424,
                                "left": {
                                  "type": "MemberExpression",
                                  "start": 1408,
                                  "end": 1415,
                                  "object": {
                                    "type": "ThisExpression",
                                    "start": 1408,
                                    "end": 1412
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 1413,
                                    "end": 1415,
                                    "name": "ff"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "operator": "+",
                                "right": {
                                  "type": "Literal",
                                  "start": 1418,
                                  "end": 1424,
                                  "value": "self",
                                  "raw": "'self'"
                                }
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
                  "type": "PropertyDefinition",
                  "start": 1438,
                  "end": 1677,
                  "static": true,
                  "computed": true,
                  "key": {
                    "type": "BinaryExpression",
                    "start": 1446,
                    "end": 1527,
                    "left": {
                      "type": "Literal",
                      "start": 1446,
                      "end": 1452,
                      "value": "run2",
                      "raw": "'run2'"
                    },
                    "operator": "+",
                    "right": {
                      "type": "CallExpression",
                      "start": 1455,
                      "end": 1527,
                      "callee": {
                        "type": "ArrowFunctionExpression",
                        "start": 1456,
                        "end": 1524,
                        "id": null,
                        "expression": false,
                        "generator": false,
                        "async": false,
                        "params": [],
                        "body": {
                          "type": "BlockStatement",
                          "start": 1462,
                          "end": 1524,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 1470,
                              "end": 1497,
                              "expression": {
                                "type": "CallExpression",
                                "start": 1470,
                                "end": 1497,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 1470,
                                  "end": 1481,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 1470,
                                    "end": 1477,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 1478,
                                    "end": 1481,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "start": 1482,
                                    "end": 1496,
                                    "value": "static runA5",
                                    "raw": "'static runA5'"
                                  }
                                ],
                                "optional": false
                              }
                            },
                            {
                              "type": "ReturnStatement",
                              "start": 1504,
                              "end": 1518,
                              "argument": {
                                "type": "MemberExpression",
                                "start": 1511,
                                "end": 1517,
                                "object": {
                                  "type": "ThisExpression",
                                  "start": 1511,
                                  "end": 1515
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 1516,
                                  "end": 1517,
                                  "name": "w"
                                },
                                "computed": false,
                                "optional": false
                              }
                            }
                          ]
                        }
                      },
                      "arguments": [],
                      "optional": false
                    }
                  },
                  "value": {
                    "type": "CallExpression",
                    "start": 1532,
                    "end": 1676,
                    "callee": {
                      "type": "FunctionExpression",
                      "start": 1533,
                      "end": 1673,
                      "id": null,
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "start": 1545,
                        "end": 1673,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 1553,
                            "end": 1589,
                            "expression": {
                              "type": "CallExpression",
                              "start": 1553,
                              "end": 1589,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 1553,
                                "end": 1564,
                                "object": {
                                  "type": "Identifier",
                                  "start": 1553,
                                  "end": 1560,
                                  "name": "console"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 1561,
                                  "end": 1564,
                                  "name": "log"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 1565,
                                  "end": 1582,
                                  "value": "挂载A.prototype_4",
                                  "raw": "'挂载A.prototype_4'"
                                },
                                {
                                  "type": "ThisExpression",
                                  "start": 1584,
                                  "end": 1588
                                }
                              ],
                              "optional": false
                            }
                          },
                          {
                            "type": "ReturnStatement",
                            "start": 1596,
                            "end": 1667,
                            "argument": {
                              "type": "FunctionExpression",
                              "start": 1603,
                              "end": 1666,
                              "id": null,
                              "expression": false,
                              "generator": false,
                              "async": false,
                              "params": [],
                              "body": {
                                "type": "BlockStatement",
                                "start": 1614,
                                "end": 1666,
                                "body": [
                                  {
                                    "type": "ExpressionStatement",
                                    "start": 1622,
                                    "end": 1660,
                                    "expression": {
                                      "type": "CallExpression",
                                      "start": 1622,
                                      "end": 1660,
                                      "callee": {
                                        "type": "MemberExpression",
                                        "start": 1622,
                                        "end": 1633,
                                        "object": {
                                          "type": "Identifier",
                                          "start": 1622,
                                          "end": 1629,
                                          "name": "console"
                                        },
                                        "property": {
                                          "type": "Identifier",
                                          "start": 1630,
                                          "end": 1633,
                                          "name": "log"
                                        },
                                        "computed": false,
                                        "optional": false
                                      },
                                      "arguments": [
                                        {
                                          "type": "Literal",
                                          "start": 1634,
                                          "end": 1641,
                                          "value": "y自己的2",
                                          "raw": "'y自己的2'"
                                        },
                                        {
                                          "type": "BinaryExpression",
                                          "start": 1643,
                                          "end": 1659,
                                          "left": {
                                            "type": "MemberExpression",
                                            "start": 1643,
                                            "end": 1650,
                                            "object": {
                                              "type": "ThisExpression",
                                              "start": 1643,
                                              "end": 1647
                                            },
                                            "property": {
                                              "type": "Identifier",
                                              "start": 1648,
                                              "end": 1650,
                                              "name": "ff"
                                            },
                                            "computed": false,
                                            "optional": false
                                          },
                                          "operator": "+",
                                          "right": {
                                            "type": "Literal",
                                            "start": 1653,
                                            "end": 1659,
                                            "value": "self",
                                            "raw": "'self'"
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
                    "arguments": [],
                    "optional": false
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 1683,
                  "end": 1776,
                  "static": false,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 1683,
                    "end": 1686,
                    "name": "exc"
                  },
                  "value": {
                    "type": "AssignmentExpression",
                    "start": 1689,
                    "end": 1776,
                    "operator": "=",
                    "left": {
                      "type": "MemberExpression",
                      "start": 1689,
                      "end": 1695,
                      "object": {
                        "type": "Identifier",
                        "start": 1689,
                        "end": 1692,
                        "name": "arr"
                      },
                      "property": {
                        "type": "Literal",
                        "start": 1693,
                        "end": 1694,
                        "value": 0,
                        "raw": "0"
                      },
                      "computed": true,
                      "optional": false
                    },
                    "right": {
                      "type": "FunctionExpression",
                      "start": 1697,
                      "end": 1776,
                      "id": null,
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "start": 1709,
                        "end": 1776,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 1717,
                            "end": 1740,
                            "expression": {
                              "type": "CallExpression",
                              "start": 1717,
                              "end": 1740,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 1717,
                                "end": 1728,
                                "object": {
                                  "type": "Identifier",
                                  "start": 1717,
                                  "end": 1724,
                                  "name": "console"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 1725,
                                  "end": 1728,
                                  "name": "log"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "ThisExpression",
                                  "start": 1729,
                                  "end": 1733
                                },
                                {
                                  "type": "Literal",
                                  "start": 1735,
                                  "end": 1739,
                                  "value": "->",
                                  "raw": "'->'"
                                }
                              ],
                              "optional": false
                            }
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  "type": "MethodDefinition",
                  "start": 1782,
                  "end": 1854,
                  "static": true,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 1789,
                    "end": 1792,
                    "name": "run"
                  },
                  "kind": "method",
                  "value": {
                    "type": "FunctionExpression",
                    "start": 1792,
                    "end": 1854,
                    "id": null,
                    "expression": false,
                    "generator": false,
                    "async": false,
                    "params": [
                      {
                        "type": "RestElement",
                        "start": 1793,
                        "end": 1800,
                        "argument": {
                          "type": "Identifier",
                          "start": 1796,
                          "end": 1800,
                          "name": "args"
                        }
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 1801,
                      "end": 1854,
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "start": 1809,
                          "end": 1848,
                          "expression": {
                            "type": "CallExpression",
                            "start": 1809,
                            "end": 1848,
                            "callee": {
                              "type": "MemberExpression",
                              "start": 1809,
                              "end": 1820,
                              "object": {
                                "type": "Identifier",
                                "start": 1809,
                                "end": 1816,
                                "name": "console"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 1817,
                                "end": 1820,
                                "name": "log"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "arguments": [
                              {
                                "type": "Literal",
                                "start": 1821,
                                "end": 1832,
                                "value": "A类的属性this",
                                "raw": "'A类的属性this'"
                              },
                              {
                                "type": "ThisExpression",
                                "start": 1834,
                                "end": 1838
                              },
                              {
                                "type": "SpreadElement",
                                "start": 1840,
                                "end": 1847,
                                "argument": {
                                  "type": "Identifier",
                                  "start": 1843,
                                  "end": 1847,
                                  "name": "args"
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
          {
            "type": "ExpressionStatement",
            "start": 1863,
            "end": 1883,
            "expression": {
              "type": "CallExpression",
              "start": 1863,
              "end": 1883,
              "callee": {
                "type": "MemberExpression",
                "start": 1863,
                "end": 1874,
                "object": {
                  "type": "Identifier",
                  "start": 1863,
                  "end": 1870,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 1871,
                  "end": 1874,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 1875,
                  "end": 1882,
                  "value": "A定义完毕",
                  "raw": "'A定义完毕'"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 1886,
            "end": 2139,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 1892,
                "end": 2139,
                "id": {
                  "type": "Identifier",
                  "start": 1892,
                  "end": 1895,
                  "name": "obj"
                },
                "init": {
                  "type": "ObjectExpression",
                  "start": 1898,
                  "end": 2139,
                  "properties": [
                    {
                      "type": "Property",
                      "start": 1904,
                      "end": 2135,
                      "method": true,
                      "shorthand": false,
                      "computed": false,
                      "key": {
                        "type": "Identifier",
                        "start": 1904,
                        "end": 1908,
                        "name": "test"
                      },
                      "kind": "init",
                      "value": {
                        "type": "FunctionExpression",
                        "start": 1908,
                        "end": 2135,
                        "id": null,
                        "expression": false,
                        "generator": false,
                        "async": false,
                        "params": [
                          {
                            "type": "Identifier",
                            "start": 1909,
                            "end": 1913,
                            "name": "flag"
                          }
                        ],
                        "body": {
                          "type": "BlockStatement",
                          "start": 1915,
                          "end": 2135,
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 1923,
                              "end": 1948,
                              "expression": {
                                "type": "CallExpression",
                                "start": 1923,
                                "end": 1940,
                                "callee": {
                                  "type": "MemberExpression",
                                  "start": 1923,
                                  "end": 1934,
                                  "object": {
                                    "type": "Identifier",
                                    "start": 1923,
                                    "end": 1930,
                                    "name": "console"
                                  },
                                  "property": {
                                    "type": "Identifier",
                                    "start": 1931,
                                    "end": 1934,
                                    "name": "log"
                                  },
                                  "computed": false,
                                  "optional": false
                                },
                                "arguments": [
                                  {
                                    "type": "ThisExpression",
                                    "start": 1935,
                                    "end": 1939
                                  }
                                ],
                                "optional": false
                              }
                            },
                            {
                              "type": "ExpressionStatement",
                              "start": 1948,
                              "end": 1992,
                              "expression": {
                                "type": "CallExpression",
                                "start": 1948,
                                "end": 1991,
                                "callee": {
                                  "type": "ArrowFunctionExpression",
                                  "start": 1949,
                                  "end": 1988,
                                  "id": null,
                                  "expression": false,
                                  "generator": false,
                                  "async": false,
                                  "params": [],
                                  "body": {
                                    "type": "BlockStatement",
                                    "start": 1953,
                                    "end": 1988,
                                    "body": [
                                      {
                                        "type": "ExpressionStatement",
                                        "start": 1963,
                                        "end": 1980,
                                        "expression": {
                                          "type": "CallExpression",
                                          "start": 1963,
                                          "end": 1980,
                                          "callee": {
                                            "type": "MemberExpression",
                                            "start": 1963,
                                            "end": 1974,
                                            "object": {
                                              "type": "Identifier",
                                              "start": 1963,
                                              "end": 1970,
                                              "name": "console"
                                            },
                                            "property": {
                                              "type": "Identifier",
                                              "start": 1971,
                                              "end": 1974,
                                              "name": "log"
                                            },
                                            "computed": false,
                                            "optional": false
                                          },
                                          "arguments": [
                                            {
                                              "type": "ThisExpression",
                                              "start": 1975,
                                              "end": 1979
                                            }
                                          ],
                                          "optional": false
                                        }
                                      }
                                    ]
                                  }
                                },
                                "arguments": [],
                                "optional": false
                              }
                            },
                            {
                              "type": "EmptyStatement",
                              "start": 2000,
                              "end": 2001
                            },
                            {
                              "type": "ExpressionStatement",
                              "start": 2001,
                              "end": 2057,
                              "expression": {
                                "type": "CallExpression",
                                "start": 2001,
                                "end": 2057,
                                "callee": {
                                  "type": "FunctionExpression",
                                  "start": 2003,
                                  "end": 2053,
                                  "id": {
                                    "type": "Identifier",
                                    "start": 2012,
                                    "end": 2016,
                                    "name": "gggg"
                                  },
                                  "expression": false,
                                  "generator": false,
                                  "async": false,
                                  "params": [],
                                  "body": {
                                    "type": "BlockStatement",
                                    "start": 2018,
                                    "end": 2053,
                                    "body": [
                                      {
                                        "type": "ExpressionStatement",
                                        "start": 2028,
                                        "end": 2045,
                                        "expression": {
                                          "type": "CallExpression",
                                          "start": 2028,
                                          "end": 2045,
                                          "callee": {
                                            "type": "MemberExpression",
                                            "start": 2028,
                                            "end": 2039,
                                            "object": {
                                              "type": "Identifier",
                                              "start": 2028,
                                              "end": 2035,
                                              "name": "console"
                                            },
                                            "property": {
                                              "type": "Identifier",
                                              "start": 2036,
                                              "end": 2039,
                                              "name": "log"
                                            },
                                            "computed": false,
                                            "optional": false
                                          },
                                          "arguments": [
                                            {
                                              "type": "ThisExpression",
                                              "start": 2040,
                                              "end": 2044
                                            }
                                          ],
                                          "optional": false
                                        }
                                      }
                                    ]
                                  }
                                },
                                "arguments": [],
                                "optional": false
                              }
                            },
                            {
                              "type": "IfStatement",
                              "start": 2065,
                              "end": 2129,
                              "test": {
                                "type": "UnaryExpression",
                                "start": 2069,
                                "end": 2074,
                                "operator": "!",
                                "prefix": true,
                                "argument": {
                                  "type": "Identifier",
                                  "start": 2070,
                                  "end": 2074,
                                  "name": "flag"
                                }
                              },
                              "consequent": {
                                "type": "BlockStatement",
                                "start": 2076,
                                "end": 2129,
                                "body": [
                                  {
                                    "type": "VariableDeclaration",
                                    "start": 2086,
                                    "end": 2105,
                                    "declarations": [
                                      {
                                        "type": "VariableDeclarator",
                                        "start": 2092,
                                        "end": 2104,
                                        "id": {
                                          "type": "Identifier",
                                          "start": 2092,
                                          "end": 2093,
                                          "name": "t"
                                        },
                                        "init": {
                                          "type": "MemberExpression",
                                          "start": 2096,
                                          "end": 2104,
                                          "object": {
                                            "type": "Identifier",
                                            "start": 2096,
                                            "end": 2099,
                                            "name": "obj"
                                          },
                                          "property": {
                                            "type": "Identifier",
                                            "start": 2100,
                                            "end": 2104,
                                            "name": "test"
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
                                    "start": 2114,
                                    "end": 2121,
                                    "expression": {
                                      "type": "CallExpression",
                                      "start": 2114,
                                      "end": 2121,
                                      "callee": {
                                        "type": "Identifier",
                                        "start": 2114,
                                        "end": 2115,
                                        "name": "t"
                                      },
                                      "arguments": [
                                        {
                                          "type": "Literal",
                                          "start": 2116,
                                          "end": 2120,
                                          "value": true,
                                          "raw": "true"
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
                    }
                  ]
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 2143,
            "end": 2163,
            "expression": {
              "type": "CallExpression",
              "start": 2143,
              "end": 2163,
              "callee": {
                "type": "MemberExpression",
                "start": 2143,
                "end": 2154,
                "object": {
                  "type": "Identifier",
                  "start": 2143,
                  "end": 2150,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 2151,
                  "end": 2154,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 2155,
                  "end": 2162,
                  "value": "00000",
                  "raw": "'00000'"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 2167,
            "end": 2178,
            "expression": {
              "type": "CallExpression",
              "start": 2167,
              "end": 2177,
              "callee": {
                "type": "MemberExpression",
                "start": 2167,
                "end": 2175,
                "object": {
                  "type": "Identifier",
                  "start": 2167,
                  "end": 2170,
                  "name": "obj"
                },
                "property": {
                  "type": "Identifier",
                  "start": 2171,
                  "end": 2175,
                  "name": "test"
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
            "start": 2205,
            "end": 2281,
            "expression": {
              "type": "AssignmentExpression",
              "start": 2205,
              "end": 2281,
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "start": 2205,
                "end": 2228,
                "object": {
                  "type": "MemberExpression",
                  "start": 2205,
                  "end": 2223,
                  "object": {
                    "type": "Identifier",
                    "start": 2205,
                    "end": 2213,
                    "name": "Function"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 2214,
                    "end": 2223,
                    "name": "prototype"
                  },
                  "computed": false,
                  "optional": false
                },
                "property": {
                  "type": "Identifier",
                  "start": 2224,
                  "end": 2228,
                  "name": "run2"
                },
                "computed": false,
                "optional": false
              },
              "right": {
                "type": "ArrowFunctionExpression",
                "start": 2231,
                "end": 2281,
                "id": null,
                "expression": false,
                "generator": false,
                "async": false,
                "params": [],
                "body": {
                  "type": "BlockStatement",
                  "start": 2236,
                  "end": 2281,
                  "body": [
                    {
                      "type": "ReturnStatement",
                      "start": 2242,
                      "end": 2277,
                      "argument": {
                        "type": "Literal",
                        "start": 2249,
                        "end": 2277,
                        "value": "this is Function prototype",
                        "raw": "'this is Function prototype'"
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            "type": "ClassDeclaration",
            "start": 2285,
            "end": 2728,
            "id": {
              "type": "Identifier",
              "start": 2291,
              "end": 2292,
              "name": "B"
            },
            "superClass": {
              "type": "Identifier",
              "start": 2301,
              "end": 2302,
              "name": "A"
            },
            "body": {
              "type": "ClassBody",
              "start": 2302,
              "end": 2728,
              "body": [
                {
                  "type": "PropertyDefinition",
                  "start": 2308,
                  "end": 2358,
                  "static": false,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 2308,
                    "end": 2310,
                    "name": "hf"
                  },
                  "value": {
                    "type": "CallExpression",
                    "start": 2313,
                    "end": 2357,
                    "callee": {
                      "type": "ArrowFunctionExpression",
                      "start": 2314,
                      "end": 2354,
                      "id": null,
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "start": 2320,
                        "end": 2354,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 2328,
                            "end": 2348,
                            "expression": {
                              "type": "CallExpression",
                              "start": 2328,
                              "end": 2348,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 2328,
                                "end": 2339,
                                "object": {
                                  "type": "Identifier",
                                  "start": 2328,
                                  "end": 2335,
                                  "name": "console"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 2336,
                                  "end": 2339,
                                  "name": "log"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 2340,
                                  "end": 2347,
                                  "value": "runB1",
                                  "raw": "'runB1'"
                                }
                              ],
                              "optional": false
                            }
                          }
                        ]
                      }
                    },
                    "arguments": [],
                    "optional": false
                  }
                },
                {
                  "type": "MethodDefinition",
                  "start": 2363,
                  "end": 2447,
                  "static": false,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 2363,
                    "end": 2374,
                    "name": "constructor"
                  },
                  "kind": "constructor",
                  "value": {
                    "type": "FunctionExpression",
                    "start": 2374,
                    "end": 2447,
                    "id": null,
                    "expression": false,
                    "generator": false,
                    "async": false,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 2375,
                        "end": 2376,
                        "name": "x"
                      },
                      {
                        "type": "Identifier",
                        "start": 2378,
                        "end": 2379,
                        "name": "y"
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 2380,
                      "end": 2447,
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "start": 2388,
                          "end": 2396,
                          "expression": {
                            "type": "CallExpression",
                            "start": 2388,
                            "end": 2396,
                            "callee": {
                              "type": "Super",
                              "start": 2388,
                              "end": 2393
                            },
                            "arguments": [
                              {
                                "type": "Identifier",
                                "start": 2394,
                                "end": 2395,
                                "name": "x"
                              }
                            ],
                            "optional": false
                          }
                        },
                        {
                          "type": "ExpressionStatement",
                          "start": 2403,
                          "end": 2423,
                          "expression": {
                            "type": "CallExpression",
                            "start": 2403,
                            "end": 2423,
                            "callee": {
                              "type": "MemberExpression",
                              "start": 2403,
                              "end": 2414,
                              "object": {
                                "type": "Identifier",
                                "start": 2403,
                                "end": 2410,
                                "name": "console"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 2411,
                                "end": 2414,
                                "name": "log"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "arguments": [
                              {
                                "type": "Literal",
                                "start": 2415,
                                "end": 2422,
                                "value": "runB2",
                                "raw": "'runB2'"
                              }
                            ],
                            "optional": false
                          }
                        },
                        {
                          "type": "ExpressionStatement",
                          "start": 2430,
                          "end": 2441,
                          "expression": {
                            "type": "AssignmentExpression",
                            "start": 2430,
                            "end": 2440,
                            "operator": "=",
                            "left": {
                              "type": "MemberExpression",
                              "start": 2430,
                              "end": 2436,
                              "object": {
                                "type": "ThisExpression",
                                "start": 2430,
                                "end": 2434
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 2435,
                                "end": 2436,
                                "name": "y"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "right": {
                              "type": "Identifier",
                              "start": 2439,
                              "end": 2440,
                              "name": "y"
                            }
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 2453,
                  "end": 2504,
                  "static": false,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 2453,
                    "end": 2456,
                    "name": "hf2"
                  },
                  "value": {
                    "type": "CallExpression",
                    "start": 2459,
                    "end": 2503,
                    "callee": {
                      "type": "ArrowFunctionExpression",
                      "start": 2460,
                      "end": 2500,
                      "id": null,
                      "expression": false,
                      "generator": false,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "start": 2466,
                        "end": 2500,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 2474,
                            "end": 2494,
                            "expression": {
                              "type": "CallExpression",
                              "start": 2474,
                              "end": 2494,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 2474,
                                "end": 2485,
                                "object": {
                                  "type": "Identifier",
                                  "start": 2474,
                                  "end": 2481,
                                  "name": "console"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 2482,
                                  "end": 2485,
                                  "name": "log"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "Literal",
                                  "start": 2486,
                                  "end": 2493,
                                  "value": "runB3",
                                  "raw": "'runB3'"
                                }
                              ],
                              "optional": false
                            }
                          }
                        ]
                      }
                    },
                    "arguments": [],
                    "optional": false
                  }
                },
                {
                  "type": "MethodDefinition",
                  "start": 2514,
                  "end": 2561,
                  "static": true,
                  "computed": false,
                  "key": {
                    "type": "Identifier",
                    "start": 2521,
                    "end": 2523,
                    "name": "fn"
                  },
                  "kind": "method",
                  "value": {
                    "type": "FunctionExpression",
                    "start": 2523,
                    "end": 2561,
                    "id": null,
                    "expression": false,
                    "generator": false,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "start": 2525,
                      "end": 2561,
                      "body": [
                        {
                          "type": "ReturnStatement",
                          "start": 2533,
                          "end": 2555,
                          "argument": {
                            "type": "BinaryExpression",
                            "start": 2540,
                            "end": 2555,
                            "left": {
                              "type": "MemberExpression",
                              "start": 2540,
                              "end": 2546,
                              "object": {
                                "type": "ThisExpression",
                                "start": 2540,
                                "end": 2544
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 2545,
                                "end": 2546,
                                "name": "x"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "operator": "*",
                            "right": {
                              "type": "MemberExpression",
                              "start": 2549,
                              "end": 2555,
                              "object": {
                                "type": "ThisExpression",
                                "start": 2549,
                                "end": 2553
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 2554,
                                "end": 2555,
                                "name": "y"
                              },
                              "computed": false,
                              "optional": false
                            }
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 2571,
                  "end": 2648,
                  "static": true,
                  "computed": true,
                  "key": {
                    "type": "Identifier",
                    "start": 2579,
                    "end": 2581,
                    "name": "fn"
                  },
                  "value": {
                    "type": "AssignmentExpression",
                    "start": 2585,
                    "end": 2647,
                    "operator": "=",
                    "left": {
                      "type": "Identifier",
                      "start": 2585,
                      "end": 2586,
                      "name": "b"
                    },
                    "right": {
                      "type": "FunctionExpression",
                      "start": 2589,
                      "end": 2647,
                      "id": null,
                      "expression": false,
                      "generator": true,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "start": 2601,
                        "end": 2647,
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "start": 2609,
                            "end": 2617,
                            "expression": {
                              "type": "YieldExpression",
                              "start": 2609,
                              "end": 2616,
                              "delegate": false,
                              "argument": {
                                "type": "Literal",
                                "start": 2615,
                                "end": 2616,
                                "value": 1,
                                "raw": "1"
                              }
                            }
                          },
                          {
                            "type": "ExpressionStatement",
                            "start": 2624,
                            "end": 2641,
                            "expression": {
                              "type": "CallExpression",
                              "start": 2624,
                              "end": 2641,
                              "callee": {
                                "type": "MemberExpression",
                                "start": 2624,
                                "end": 2635,
                                "object": {
                                  "type": "Identifier",
                                  "start": 2624,
                                  "end": 2631,
                                  "name": "console"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "start": 2632,
                                  "end": 2635,
                                  "name": "log"
                                },
                                "computed": false,
                                "optional": false
                              },
                              "arguments": [
                                {
                                  "type": "ThisExpression",
                                  "start": 2636,
                                  "end": 2640
                                }
                              ],
                              "optional": false
                            }
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  "type": "PropertyDefinition",
                  "start": 2654,
                  "end": 2724,
                  "static": false,
                  "computed": true,
                  "key": {
                    "type": "BinaryExpression",
                    "start": 2655,
                    "end": 2662,
                    "left": {
                      "type": "Identifier",
                      "start": 2655,
                      "end": 2657,
                      "name": "fn"
                    },
                    "operator": "+",
                    "right": {
                      "type": "Identifier",
                      "start": 2660,
                      "end": 2662,
                      "name": "fn"
                    }
                  },
                  "value": {
                    "type": "ArrowFunctionExpression",
                    "start": 2666,
                    "end": 2724,
                    "id": null,
                    "expression": false,
                    "generator": false,
                    "async": true,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "start": 2678,
                      "end": 2724,
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "start": 2686,
                          "end": 2694,
                          "expression": {
                            "type": "AwaitExpression",
                            "start": 2686,
                            "end": 2693,
                            "argument": {
                              "type": "Literal",
                              "start": 2692,
                              "end": 2693,
                              "value": 2,
                              "raw": "2"
                            }
                          }
                        },
                        {
                          "type": "ExpressionStatement",
                          "start": 2701,
                          "end": 2718,
                          "expression": {
                            "type": "CallExpression",
                            "start": 2701,
                            "end": 2718,
                            "callee": {
                              "type": "MemberExpression",
                              "start": 2701,
                              "end": 2712,
                              "object": {
                                "type": "Identifier",
                                "start": 2701,
                                "end": 2708,
                                "name": "console"
                              },
                              "property": {
                                "type": "Identifier",
                                "start": 2709,
                                "end": 2712,
                                "name": "log"
                              },
                              "computed": false,
                              "optional": false
                            },
                            "arguments": [
                              {
                                "type": "ThisExpression",
                                "start": 2713,
                                "end": 2717
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
          {
            "type": "ExpressionStatement",
            "start": 2731,
            "end": 2765,
            "expression": {
              "type": "CallExpression",
              "start": 2731,
              "end": 2765,
              "callee": {
                "type": "MemberExpression",
                "start": 2731,
                "end": 2742,
                "object": {
                  "type": "Identifier",
                  "start": 2731,
                  "end": 2738,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 2739,
                  "end": 2742,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 2743,
                  "end": 2764,
                  "value": "----start---class--",
                  "raw": "'----start---class--'"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 2768,
            "end": 2787,
            "expression": {
              "type": "CallExpression",
              "start": 2768,
              "end": 2787,
              "callee": {
                "type": "MemberExpression",
                "start": 2768,
                "end": 2779,
                "object": {
                  "type": "Identifier",
                  "start": 2768,
                  "end": 2775,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 2776,
                  "end": 2779,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "MemberExpression",
                  "start": 2780,
                  "end": 2786,
                  "object": {
                    "type": "Identifier",
                    "start": 2780,
                    "end": 2783,
                    "name": "arr"
                  },
                  "property": {
                    "type": "Literal",
                    "start": 2784,
                    "end": 2785,
                    "value": 0,
                    "raw": "0"
                  },
                  "computed": true,
                  "optional": false
                }
              ],
              "optional": false
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 2790,
            "end": 2812,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 2796,
                "end": 2811,
                "id": {
                  "type": "Identifier",
                  "start": 2796,
                  "end": 2797,
                  "name": "x"
                },
                "init": {
                  "type": "NewExpression",
                  "start": 2800,
                  "end": 2811,
                  "callee": {
                    "type": "Identifier",
                    "start": 2804,
                    "end": 2805,
                    "name": "B"
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "start": 2806,
                      "end": 2807,
                      "value": 1,
                      "raw": "1"
                    },
                    {
                      "type": "Literal",
                      "start": 2809,
                      "end": 2810,
                      "value": 2,
                      "raw": "2"
                    }
                  ]
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "VariableDeclaration",
            "start": 2816,
            "end": 2839,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 2822,
                "end": 2838,
                "id": {
                  "type": "Identifier",
                  "start": 2822,
                  "end": 2824,
                  "name": "x1"
                },
                "init": {
                  "type": "NewExpression",
                  "start": 2827,
                  "end": 2838,
                  "callee": {
                    "type": "Identifier",
                    "start": 2831,
                    "end": 2832,
                    "name": "B"
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "start": 2833,
                      "end": 2834,
                      "value": 3,
                      "raw": "3"
                    },
                    {
                      "type": "Literal",
                      "start": 2836,
                      "end": 2837,
                      "value": 4,
                      "raw": "4"
                    }
                  ]
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 2868,
            "end": 2887,
            "expression": {
              "type": "CallExpression",
              "start": 2868,
              "end": 2887,
              "callee": {
                "type": "MemberExpression",
                "start": 2868,
                "end": 2879,
                "object": {
                  "type": "Identifier",
                  "start": 2868,
                  "end": 2875,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 2876,
                  "end": 2879,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "MemberExpression",
                  "start": 2880,
                  "end": 2886,
                  "object": {
                    "type": "Identifier",
                    "start": 2880,
                    "end": 2883,
                    "name": "arr"
                  },
                  "property": {
                    "type": "Literal",
                    "start": 2884,
                    "end": 2885,
                    "value": 0,
                    "raw": "0"
                  },
                  "computed": true,
                  "optional": false
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 2890,
            "end": 2914,
            "expression": {
              "type": "CallExpression",
              "start": 2890,
              "end": 2914,
              "callee": {
                "type": "MemberExpression",
                "start": 2890,
                "end": 2901,
                "object": {
                  "type": "Identifier",
                  "start": 2890,
                  "end": 2897,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 2898,
                  "end": 2901,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 2902,
                  "end": 2913,
                  "value": "---------",
                  "raw": "'---------'"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 2917,
            "end": 2931,
            "expression": {
              "type": "CallExpression",
              "start": 2917,
              "end": 2931,
              "callee": {
                "type": "MemberExpression",
                "start": 2917,
                "end": 2928,
                "object": {
                  "type": "Identifier",
                  "start": 2917,
                  "end": 2924,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 2925,
                  "end": 2928,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 2929,
                  "end": 2930,
                  "name": "x"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 2934,
            "end": 2952,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 2940,
                "end": 2952,
                "id": {
                  "type": "Identifier",
                  "start": 2940,
                  "end": 2941,
                  "name": "y"
                },
                "init": {
                  "type": "NewExpression",
                  "start": 2944,
                  "end": 2952,
                  "callee": {
                    "type": "Identifier",
                    "start": 2948,
                    "end": 2949,
                    "name": "A"
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "start": 2950,
                      "end": 2951,
                      "value": 3,
                      "raw": "3"
                    }
                  ]
                }
              }
            ],
            "kind": "const"
          },
          {
            "type": "ExpressionStatement",
            "start": 2955,
            "end": 2969,
            "expression": {
              "type": "CallExpression",
              "start": 2955,
              "end": 2969,
              "callee": {
                "type": "MemberExpression",
                "start": 2955,
                "end": 2966,
                "object": {
                  "type": "Identifier",
                  "start": 2955,
                  "end": 2962,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 2963,
                  "end": 2966,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Identifier",
                  "start": 2967,
                  "end": 2968,
                  "name": "y"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 2972,
            "end": 2988,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 2978,
                "end": 2987,
                "id": {
                  "type": "Identifier",
                  "start": 2978,
                  "end": 2981,
                  "name": "rrr"
                },
                "init": {
                  "type": "MemberExpression",
                  "start": 2984,
                  "end": 2987,
                  "object": {
                    "type": "Identifier",
                    "start": 2984,
                    "end": 2985,
                    "name": "A"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 2986,
                    "end": 2987,
                    "name": "g"
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
            "start": 2991,
            "end": 3026,
            "expression": {
              "type": "CallExpression",
              "start": 2991,
              "end": 3026,
              "callee": {
                "type": "MemberExpression",
                "start": 2991,
                "end": 3002,
                "object": {
                  "type": "Identifier",
                  "start": 2991,
                  "end": 2998,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 2999,
                  "end": 3002,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 3003,
                  "end": 3018,
                  "value": "----1111-----",
                  "raw": "'----1111-----'"
                },
                {
                  "type": "CallExpression",
                  "start": 3020,
                  "end": 3025,
                  "callee": {
                    "type": "Identifier",
                    "start": 3020,
                    "end": 3023,
                    "name": "rrr"
                  },
                  "arguments": [],
                  "optional": false
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 3029,
            "end": 3063,
            "expression": {
              "type": "CallExpression",
              "start": 3029,
              "end": 3063,
              "callee": {
                "type": "MemberExpression",
                "start": 3029,
                "end": 3040,
                "object": {
                  "type": "Identifier",
                  "start": 3029,
                  "end": 3036,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 3037,
                  "end": 3040,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 3041,
                  "end": 3050,
                  "value": "statics",
                  "raw": "'statics'"
                },
                {
                  "type": "CallExpression",
                  "start": 3052,
                  "end": 3062,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 3052,
                    "end": 3060,
                    "object": {
                      "type": "Identifier",
                      "start": 3052,
                      "end": 3053,
                      "name": "A"
                    },
                    "property": {
                      "type": "Literal",
                      "start": 3054,
                      "end": 3059,
                      "value": "124",
                      "raw": "'124'"
                    },
                    "computed": true,
                    "optional": false
                  },
                  "arguments": [],
                  "optional": false
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 3066,
            "end": 3073,
            "expression": {
              "type": "CallExpression",
              "start": 3066,
              "end": 3073,
              "callee": {
                "type": "MemberExpression",
                "start": 3066,
                "end": 3071,
                "object": {
                  "type": "Identifier",
                  "start": 3066,
                  "end": 3067,
                  "name": "y"
                },
                "property": {
                  "type": "Identifier",
                  "start": 3068,
                  "end": 3071,
                  "name": "run"
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
            "start": 3076,
            "end": 3104,
            "expression": {
              "type": "CallExpression",
              "start": 3076,
              "end": 3104,
              "callee": {
                "type": "MemberExpression",
                "start": 3076,
                "end": 3087,
                "object": {
                  "type": "Identifier",
                  "start": 3076,
                  "end": 3083,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 3084,
                  "end": 3087,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 3088,
                  "end": 3103,
                  "value": "----2222-----",
                  "raw": "'----2222-----'"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 3107,
            "end": 3135,
            "expression": {
              "type": "CallExpression",
              "start": 3107,
              "end": 3135,
              "callee": {
                "type": "MemberExpression",
                "start": 3107,
                "end": 3118,
                "object": {
                  "type": "Identifier",
                  "start": 3107,
                  "end": 3114,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 3115,
                  "end": 3118,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "CallExpression",
                  "start": 3119,
                  "end": 3127,
                  "callee": {
                    "type": "MemberExpression",
                    "start": 3119,
                    "end": 3125,
                    "object": {
                      "type": "Identifier",
                      "start": 3119,
                      "end": 3120,
                      "name": "A"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 3121,
                      "end": 3125,
                      "name": "run2"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "arguments": [],
                  "optional": false
                },
                {
                  "type": "MemberExpression",
                  "start": 3129,
                  "end": 3134,
                  "object": {
                    "type": "Identifier",
                    "start": 3129,
                    "end": 3130,
                    "name": "y"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 3131,
                    "end": 3134,
                    "name": "exc"
                  },
                  "computed": false,
                  "optional": false
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 3138,
            "end": 3145,
            "expression": {
              "type": "CallExpression",
              "start": 3138,
              "end": 3145,
              "callee": {
                "type": "MemberExpression",
                "start": 3138,
                "end": 3143,
                "object": {
                  "type": "Identifier",
                  "start": 3138,
                  "end": 3139,
                  "name": "y"
                },
                "property": {
                  "type": "Identifier",
                  "start": 3140,
                  "end": 3143,
                  "name": "exc"
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
            "start": 3148,
            "end": 3175,
            "expression": {
              "type": "CallExpression",
              "start": 3148,
              "end": 3175,
              "callee": {
                "type": "MemberExpression",
                "start": 3148,
                "end": 3159,
                "object": {
                  "type": "Identifier",
                  "start": 3148,
                  "end": 3155,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 3156,
                  "end": 3159,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 3160,
                  "end": 3174,
                  "value": "----333-----",
                  "raw": "'----333-----'"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "VariableDeclaration",
            "start": 3178,
            "end": 3193,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "start": 3184,
                "end": 3193,
                "id": {
                  "type": "Identifier",
                  "start": 3184,
                  "end": 3185,
                  "name": "g"
                },
                "init": {
                  "type": "MemberExpression",
                  "start": 3188,
                  "end": 3193,
                  "object": {
                    "type": "Identifier",
                    "start": 3188,
                    "end": 3189,
                    "name": "y"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 3190,
                    "end": 3193,
                    "name": "exc"
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
            "start": 3196,
            "end": 3199,
            "expression": {
              "type": "CallExpression",
              "start": 3196,
              "end": 3199,
              "callee": {
                "type": "Identifier",
                "start": 3196,
                "end": 3197,
                "name": "g"
              },
              "arguments": [],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 3202,
            "end": 3228,
            "expression": {
              "type": "CallExpression",
              "start": 3202,
              "end": 3228,
              "callee": {
                "type": "MemberExpression",
                "start": 3202,
                "end": 3213,
                "object": {
                  "type": "Identifier",
                  "start": 3202,
                  "end": 3209,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 3210,
                  "end": 3213,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 3214,
                  "end": 3227,
                  "value": "---444-----",
                  "raw": "'---444-----'"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 3231,
            "end": 3244,
            "expression": {
              "type": "CallExpression",
              "start": 3231,
              "end": 3244,
              "callee": {
                "type": "MemberExpression",
                "start": 3231,
                "end": 3236,
                "object": {
                  "type": "Identifier",
                  "start": 3231,
                  "end": 3232,
                  "name": "A"
                },
                "property": {
                  "type": "Identifier",
                  "start": 3233,
                  "end": 3236,
                  "name": "run"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 3237,
                  "end": 3243,
                  "value": "1111",
                  "raw": "'1111'"
                }
              ],
              "optional": false
            }
          },
          {
            "type": "ExpressionStatement",
            "start": 3247,
            "end": 3276,
            "expression": {
              "type": "CallExpression",
              "start": 3247,
              "end": 3276,
              "callee": {
                "type": "MemberExpression",
                "start": 3247,
                "end": 3258,
                "object": {
                  "type": "Identifier",
                  "start": 3247,
                  "end": 3254,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 3255,
                  "end": 3258,
                  "name": "log"
                },
                "computed": false,
                "optional": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 3259,
                  "end": 3267,
                  "value": "y.run2",
                  "raw": "'y.run2'"
                },
                {
                  "type": "MemberExpression",
                  "start": 3269,
                  "end": 3275,
                  "object": {
                    "type": "Identifier",
                    "start": 3269,
                    "end": 3270,
                    "name": "y"
                  },
                  "property": {
                    "type": "Identifier",
                    "start": 3271,
                    "end": 3275,
                    "name": "run2"
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
      "start": 3299,
      "end": 3326,
      "expression": {
        "type": "CallExpression",
        "start": 3299,
        "end": 3325,
        "callee": {
          "type": "MemberExpression",
          "start": 3299,
          "end": 3310,
          "object": {
            "type": "Identifier",
            "start": 3299,
            "end": 3305,
            "name": "test30"
          },
          "property": {
            "type": "Identifier",
            "start": 3306,
            "end": 3310,
            "name": "call"
          },
          "computed": false,
          "optional": false
        },
        "arguments": [
          {
            "type": "ObjectExpression",
            "start": 3311,
            "end": 3324,
            "properties": [
              {
                "type": "Property",
                "start": 3312,
                "end": 3323,
                "method": false,
                "shorthand": false,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 3312,
                  "end": 3316,
                  "name": "test"
                },
                "value": {
                  "type": "Literal",
                  "start": 3318,
                  "end": 3323,
                  "value": "111",
                  "raw": "'111'"
                },
                "kind": "init"
              }
            ]
          }
        ],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
};