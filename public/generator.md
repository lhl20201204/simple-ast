待解决问题
1，循环block （while）结束后，要把其包含的所有ast的config全部重置。
2，什么时候使用cache， 什么时候使用new。
      如果astConfig 为 空，说明当前需要新建new。
      其他情况说明非第一次运行。需要使用parent缓存的 env （按顺序取推出去？待验证）。
      
      如果是缓存的env => 记得添加标志符, 处理预备提升的let，const，class声明语句。

      什么时候往parent push, env。
      执行的时候。新建env 就往parent的stack挂上去。
      什么时候往parent pop, env。

3， 需要保存block的return 值 或者 throw 值， 并在运行前检查是否需要抛出，并提前终止。（跳过执行的语句其env如何处理）
4, 像for 语句这种，需要把它编译成 while语句。

next()
gen 
    -> if 运行完毕，没抛出异常，if正常卸载。
    <-
    -> while yield gen [while] -> 只有进没有出。  blockStatement的时候，start的时候对  env的父亲的缓存env进行push， end就pop();
next()
    -> while 缓存。gen [while], 使用 while缓存。标记env为使用缓存
      -> try yield     while[try]
next()
    -> while 缓存 gen [while]
      -> try 缓存      while[try].
         -> try throw       try[try(保存e)]
         -> catch yield     try[try(保存e), catch] 
next()
    -> while 缓存 gen [while]
      -> try 缓存      while[try].
         -> try 缓存         try[try(保存e)], 检测到有 e保存，在运行前直接抛出
         -> catch 缓存       
         -> catch throw      try[try(保存e), catch(保存e)]，
         -> finally yield    try[try(保存e), catch(保存e), finally]，
next()
    -> while 缓存 gen [while]
      -> try 缓存      while[try].
         -> try 缓存         try[try(保存e)], 检测到有 e保存，在运行前直接抛出
         -> catch 缓存       try[try(保存e),catch(保存e)] 检测到有 e保存，在运行前直接抛出
         -> finally 缓存     try[try(保存e),catch(保存e)]，
         -> finally throw   try[try(保存e),catch(保存e),finally(保存e)]，
      -> catch throw   while[try,catch(保存e)].
      -> finally yield while[try,catch(保存e),finally].

next()
    -> while 缓存 gen [while]
      -> try 缓存      while[try].
         -> try 缓存         try[try(保存e)], 检测到有 e保存，在运行前直接抛出
         -> catch 缓存       try[try(保存e),catch(保存e)] 检测到有 e保存，在运行前直接抛出
         -> finally 缓存     try[try(保存e),catch(保存e),finally(保存e)]，检测到有 e保存，在运行前直接抛出
      -> catch 缓存    while[try,catch(保存e)]. 检测到有 e保存，在运行前直接抛出
      -> finally 缓存  while[try,catch(保存e),finally].
    -> while


function* gen() {
        if (true) {

        }
        let i = 1;
        const e = new Error('主动抛出错误’);   1, 新建 whileEnv。  2， 有config， 使用缓存。
        while (i++ < 2) {
          yield 1;
          try {
            yield 2
            try {
              throw e;
              yield
            } catch (e) { // 这里怎么处理重复e的问题？
              yield 3
              throw e;
            } finally {
              yield 4;
              throw e;
            }
            yield
          } catch (e) {
            throw e;
            return
          } finally {
            yield 5
          }
        }
   }

next()
A -> while 
next()
A -> 拿while缓存 -> try 
next()
A -> 拿while缓存 ->拿 try缓存 -> try -> catch
next()
A -> 拿while缓存 -> 拿try缓存 -> 拿try缓存 -> 拿catch缓存
next()
A -> 拿while缓存 -> 拿try缓存 -> 拿try缓存 -> 拿catch缓存->finally
next()
A -> 拿while缓存 -> 拿try缓存 -> 拿try缓存 -> 拿catch缓存-> 拿finally缓存 -> catch -> finally
next()
A -> 拿while缓存 -> 拿try缓存 -> 拿try缓存 -> 拿catch缓存-> 拿finally缓存 -> 拿catch 缓存-> 拿finally