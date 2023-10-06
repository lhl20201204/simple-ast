// throw 1;

const onlyTestLastly = false;
const closeTest = true;

const originLog = console.log
// const Promise = MyPromise;
// 抛出错误的地方不对， 正版的捕获不到。
const diffCount = Number(Boolean(Promise === MyPromise));
let consoleLogArr = [];
const result = [];
// const originDebounce = () => {
//   let flag = null;
//   return (x) => {
//     if (flag) {
//       clearTimeout(flag)
//     }
//     flag = setTimeout(() => {
//       x();
//     }, 200)
//   }

// }
// const run = originDebounce()
console.log = (a, ...args) => {
  if (typeof a !== 'number') {
    if (a === 'Live reload enabled.') {
      return;
    }
    throw new Error('第一个必须是数字')
  }
  if (a !== currentLogId) {
    console.error(consoleLogArr)
    throw new Error('输出顺序有误')
  }
  originLog(...args)
  consoleLogArr.push([...args])
  currentLogId++
}

// function expect(res) {
//   return {
//     toBeTrue(cb = (a, b) => JSON.stringify(a) === JSON.stringify(b)) {
//       if (res.length !== consoleLogArr.length) {
//         console.error(res, consoleLogArr)
//         throw new Error('长度输出不等');
//       }
//       while (res.length && consoleLogArr.length) {
//         const f = res.shift()
//         const s = consoleLogArr.shift()
//         if (f.length !== s.length) {
//           console.error(f, s)
//           throw new Error('当前console.log接受的个数不等于')
//         }
//         while (f.length && s.length) {
//           const a = f.shift()
//           const b = s.shift()
//           originLog('值判断', a, b)
//           if (a !== b || !cb(a, b)) {
//             console.error(a, b)
//             throw new Error('值不匹配')
//           }
//         }
//       }
//     }
//   }
// }
window.onerror = (e) => {
  originLog('window捕获到错误', e)
  currentNum++;
}

const task = []
let currentLogId = 0;
let currentNum = 0;
setTimeout(() => {
  let next
  let id = 0;
  const run = () => {
    if (!task.length) {
      return;
    }
    const current = new OldPromise((res) => {
      next = res
    })
    const [fn, flag] = task.shift();
    if (!flag) {
      try {
        fn(next)
      } catch (e) {
        originLog('run方法捕获到错误', e)
        currentNum++;
        throw e;
      }
    }
    current.then((res) => {
      // originLog('开始判断')
      let ret = res ?? 0;
      // if (flag && !Array.isArray(res)) {
      //   ret = res.ret
      // }
      // if (flag) {
      //   expect(ret).toBeTrue(res.cb);
      // }
      if (ret !== currentNum) {
        console.error(ret, currentNum)
        throw new Error('不匹')
      }
      originLog(fn.toString())
      consoleLogArr = []
      currentLogId = 0;
      currentNum = 0;
      originLog(`-------第${id++}个测试用例通过--------`)
      run();
    })
  }
  if (onlyTestLastly) {
    task.splice(0, task.length - 1)
  }
  if (closeTest) {
    // TODO test
    console.log = originLog;
    function test() {
      const promise1 = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('success')
        }, 1000)
      })
      const promise2 = promise1.then(() => {
        throw new Error('error!!!')
      })
      console.log(0, 'promise1', promise1)
      console.log(1, 'promise2', promise2)
      setTimeout(() => {
        console.log(2, 'promise1', promise1)
        console.log(3, 'promise2', promise2)
        // next(diffCount)
      }, 2000)
    }

    function test1() {
      // const promise = Promise.resolve().then(() => {
      //   throw 2 
      // }) 
      queueMicrotask(() => {
        console.log(0)
      })
      const p = new Promise(() => { throw 2 })
      queueMicrotask(() => {
        console.log(1)
      })
      console.log(-1)
      //  setTimeout(() => {
      //   p.catch(() => {})
      //  }, 4000)
      // promise.catch(console.error)
    }

    function test2() {
      queueMicrotask(() => {
        console.log(1)
        setTimeout(() =>{
          queueMicrotask(() => {
            console.log(4)
            setTimeout(() => {
              queueMicrotask(() => {
                console.log(6)
              })
            })
            
          })
        })
      })
      queueMicrotask(() => {
        console.log(2)  
      })
      queueMicrotask(() => {
        console.log(3)
        queueMicrotask(() => {
          setTimeout(() => {
            queueMicrotask(() => {
              console.log(5)
            })
          })
        })
        
        
      })
    }
    
    function test3() {
      queueMicrotask(() => {
        console.log(2)
      })
      new Promise(() => {
        console.log(0)
        throw 3
      }).catch(console.error)
      setTimeout(() => {
        p2.catch(console.log)
        console.log(8)
        p.catch(console.error)
      }, 0)
      const p = new Promise(() => {
        throw 10
      }).then().then().then()
      Promise.reject(4).catch(console.error)
      setTimeout(() => {
        console.log(7)
      }, 0)
      Promise.resolve(5).then(console.log)
      const p2 = Promise.reject(9)
      queueMicrotask(() => {
        console.log(6)
      })
      console.log(1)
      setTimeout(() => {
        throw -1
      }, 2000)
    }

    test3()

  } else {
    run();
  }
})


test((next) => {
  const promise1 = new Promise((resolve, reject) => {
    console.log(0, 'promise1')
  })
  console.log(1, '1', promise1);
  next(
    // [['promise1'], ['1', promise1]]
  )
})

test((next) => {
  const promise = new Promise((resolve, reject) => {
    console.log(0, 1);
    resolve('success')
    console.log(1, 2);
  });
  promise.then(() => {
    console.log(3, 3);
    next()
  });
  console.log(2, 4);

})

test((next) => {
  const promise = new Promise((resolve, reject) => {
    console.log(0, 1);
    console.log(1, 2);
  });
  promise.then(() => {
    console.log(3);
  });
  console.log(2, 4);
  next()
})

test((next) => {
  const promise1 = new Promise((resolve, reject) => {
    console.log(0, 'promise1')
    resolve('resolve1')
  })
  const promise2 = promise1.then(res => {
    console.log(3, res)
    next()
  })
  console.log(1, '1', promise1);
  console.log(2, '2', promise2);
})

test((next) => {
  const fn = () => (new Promise((resolve, reject) => {
    console.log(0, 1);
    resolve('success')
  }))
  fn().then(res => {
    console.log(2, res)
    next()
  })
  console.log(1, 'start')
})

test((next) => {
  const fn = () =>
    new Promise((resolve, reject) => {
      console.log(1, 1);
      resolve("success");
    });
  console.log(0, "start");
  fn().then(res => {
    console.log(2, res);
    next()
  });
})


test((next) => {
  console.log(0, 'start')
  setTimeout(() => {
    console.log(3, 'time')
    next()
  })
  Promise.resolve().then(() => {
    console.log(2, 'resolve')
  })
  console.log(1, 'end')

})


test((next) => {
  const promise = new Promise((resolve, reject) => {
    console.log(0, 1);
    setTimeout(() => {
      console.log(3, "timerStart");
      resolve("success");
      console.log(4, "timerEnd");
    }, 0);
    console.log(1, 2);
  });
  promise.then((res) => {
    console.log(5, res);
    next()
  });
  console.log(2, 4);
})

test((next) => {
  setTimeout(() => {
    console.log(1, 'timer1');
    setTimeout(() => {
      console.log(3, 'timer3')
      next()
    }, 0)
  }, 0)
  setTimeout(() => {
    console.log(2, 'timer2')
  }, 0)
  console.log(0, 'start')
})

test((next) => {
  setTimeout(() => {
    console.log(1, 'timer1');
    Promise.resolve().then(() => {
      console.log(2, 'promise')
    })
  }, 0)
  setTimeout(() => {
    console.log(3, 'timer2')
    next()
  }, 0)
  console.log(0, 'start')

})


test((next) => {
  Promise.resolve().then(() => {
    console.log(1, 'promise1');
    const timer2 = setTimeout(() => {
      console.log(4, 'timer2')
      next()
    }, 0)
  });
  const timer1 = setTimeout(() => {
    console.log(2, 'timer1')
    Promise.resolve().then(() => {
      console.log(3, 'promise2')
    })
  }, 0)
  console.log(0, 'start');

})

test((next) => {
  const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('success')
    }, 1000)
  })
  const promise2 = promise1.then(() => {
    throw new Error('error!!!')
  })
  console.log(0, 'promise1', promise1)
  console.log(1, 'promise2', promise2)
  setTimeout(() => {
    console.log(2, 'promise1', promise1)
    console.log(3, 'promise2', promise2)
    next(diffCount)
  }, 2000)
  //   
})

test((next) => {
  const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("success");
      console.log(3, "timer1");
    }, 1000);
    console.log(0, "promise1里的内容");
  });
  const promise2 = promise1.then(() => {
    throw new Error("error!!!");
  });
  console.log(1, "promise1", promise1);
  console.log(2, "promise2", promise2);
  setTimeout(() => {
    console.log(4, "timer2");
    console.log(5, "promise1", promise1);
    console.log(6, "promise2", promise2);
    next(diffCount)
  }, 2000);

})

test((next) => {
  const promise = new Promise((resolve, reject) => {
    resolve("success1");
    reject("error");
    resolve("success2");
  });
  promise
    .then(res => {
      console.log(0, "then: ", res);
      next()
    }).catch(err => {
      console.log("catch: ", err);
    })
})

test((next) => {
  const promise = new Promise((resolve, reject) => {
    reject("error");
    resolve("success2");
  });
  promise
    .then(res => {
      console.log("then1: ", res);
    }).then(res => {
      console.log("then2: ", res);
    }).catch(err => {
      console.log(0, "catch: ", err);
    }).then(res => {
      console.log(1, "then3: ", res);
      next()
    })
})

test((next) => {
  Promise.resolve(1)
    .then(res => {
      console.log(0, res);
      return 2;
    })
    .catch(err => {
      return 3;
    })
    .then(res => {
      console.log(1, res);
      next()
    });
})

test((next) => {
  Promise.reject(1)
    .then(res => {
      console.log(res);
      return 2;
    })
    .catch(err => {
      console.log(0, err);
      return 3
    })
    .then(res => {
      console.log(1, res);
      next()
    });

})

test((next) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(0, 'timer')
      resolve('success')
    }, 1000)
  })
  const start = Date.now();
  promise.then(res => {
    console.log(1, res, Date.now() - start)
  })
  promise.then(res => {
    console.log(2, res, Date.now() - start)
    next()
  })

})

test((next) => {
  Promise.resolve().then(() => {
    return new Error('error!!!')
  }).then(res => {
    console.log(0, "then: ", res)
    next()
  }).catch(err => {
    console.log("catch: ", err)
  })
})

test((next) => {          // 0 // then -> 1,
  const promise = Promise.resolve().then(() => {
    return promise;
  })
  promise.catch(console.error)
  promise.catch(() => next())

})

test((next) => {
  Promise.resolve(1)
    .then(2)
    .then(Promise.resolve(3))
    .then(x => console.log(0, x))
    .then(() => next())
})

test((next) => {
  Promise.reject('err!!!')
    .then((res) => {
      console.log('success', res)
    }, (err) => {
      console.log(0, 'error', err)
      next()
    }).catch(err => {
      console.log('catch', err)
    })

})

test((next) => {
  Promise.reject('error!!!')
    .then((res) => {
      console.log('success', res)
    }).catch(err => {
      console.log(0, 'catch', err)
      next()
    })
})

test((next) => {
  Promise.resolve()
    .then(function success(res) {
      throw new Error('error!!!')
    }, function fail1(err) {
      console.log('fail1', err)
    }).catch(function fail2(err) {
      console.log(0, 'fail2', err)
      next()
    })
})

test((next) => {
  Promise.resolve('1')
    .then(res => {
      console.log(0, res)
    })
    .finally(() => {
      console.log(2, 'finally')
    })
  Promise.resolve('2')
    .finally(() => {
      console.log(1, 'finally2')
      return '我是finally2返回的值'
    })
    .then(res => {
      console.log(3, 'finally2后面的then函数', res)
      next()
    })

})

test((next) => {
  Promise.resolve('1')
    .finally(() => {
      console.log(0, 'finally1')
      throw new Error('我是finally中抛出的异常')
    })
    .then(res => {
      console.log('finally后面的then函数', res)
    })
    .catch(err => {
      console.log(1, '捕获错误', err)
      next()
    })
})

test((next) => {
  function promise1() {
    let p = new Promise((resolve) => {
      console.log(0, 'promise1');
      resolve('1')
    })
    return p;
  }
  function promise2() {
    return new Promise((resolve, reject) => {
      reject('error')
    })
  }
  promise1()
    .then(res => console.log(1, res))
    .catch(err => console.log(err))
    .finally(() => console.log(3, 'finally1'))

  promise2()
    .then(res => console.log(res))
    .catch(err => console.log(2, err))
    .finally(() => {
      console.log(4, 'finally2')
      next()
    })

})

test((next) => {
  function runAsync(d, x) {
    const p = new Promise(r => setTimeout(() => r(x, console.log(d, x)), 1000))
    return p
  }
  Promise.all([runAsync(0, 1), runAsync(1, 2), runAsync(2, 3)])
    .then(res => {
      console.log(3, res)
      next()
    })

})

test((next) => {
  function runAsync(d, x) {
    const p = new Promise(r => setTimeout(() => r(x, console.log(d, x)), 1000))
    return p
  }
  function runReject(d, x) {
    const p = new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(d, x), d === 4 && next()), 1000 * x))
    return p
  }
  Promise.all([runAsync(0, 1), runReject(4, 2), runAsync(1, 3), runReject(2, 1.5)])
    .then(res => console.log(res))
    .catch(err => {
      console.log(3, err)
    })
})

test((next) => {
  function runAsync(d, x) {
    const p = new Promise(r => setTimeout(() => r(x, console.log(d, x), d === 3 && next()), 1000))
    return p
  }
  Promise.race([runAsync(0, 1), runAsync(2, 2), runAsync(3, 3)])
    .then(res => {
      console.log(1, 'result: ', res)
    })
    .catch(err => console.log(err))

})

test((next) => {
  function runAsync(d, x) {
    const p = new Promise(r =>
      setTimeout(() => r(x, console.log(d, x), d === 4 && next()), 0)
    );
    return p;
  }
  function runReject(d, x) {
    const p = new Promise((res, rej) =>
      setTimeout(() => rej(`Error: ${x}`, console.log(d, x)), 1000 * x)
    );
    return p;
  }
  Promise.race([runReject(0, 0), runAsync(2, 1), runAsync(3, 2), runAsync(4, 3)])
    .then(res => console.log("result: ", res))
    .catch(err => console.log(1, err));

})

test((next) => {
  Promise.allSettled([Promise.reject(0), Promise.resolve(1)])
    .catch(console.log)
    .then((r) => {
      console.log(0, r)
      next()
    })
})



function test(fn, flag) {
  task.push([fn, flag])
}