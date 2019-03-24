# 异步编程及 promise 学习心得

​	异步设计到现在执行模块和将来执行模块之间的关系，当然这是核心。我将从什么是异步、异步机制、回调函数、promise 以及它的设计基础，这几个方面介绍异步编程。JavaScript 从前端到 node以及其它的环境，异步变得越来越重要，也很难学（同步顺序执行往往是我们最喜欢的方式）。

## 什么是异步

​	通常来说程序执行是通过分块来组织的，常用的有 module ，或者一个函数。有些块（函数）是现在执行的，有的是将来执行（充满不确定性，并不是现在的块执行完后就立即执行例如 Ajax ），现在无法完成的任务交给未来某个时刻去完成。 

​	

```javascript
var data  = ajax(/*url*/);

console.log(data);//undefined

```

显然理想的把异步阻塞执行，然而它并不会这样做。简单补充一下 Ajax ，它是一个异步函数 其中主要的一个对象是 `XMLHttpRequest `大多数时候都是异步执行的，当然它可以同步执行（我劝你最好不要这样做，同步执行时它会锁定浏览器 `UI` 所有的按钮，菜单、滚动条、点击事件等都不能产生交互,这是很糟糕的用户体验）。

​	说点题外话，异步控制台。`console.*`  开发中经常使用来做输出调试的个函数族，我说它也是异步的你可能不信，但是它的机制确实是这样的。我们呢很喜欢用它来打印快照（对象快照）

​	

```javascript
var count = 0;

console.log(count);

count++;

```

​	通常我们认为console 了 就得打印出：0，然后再自加1，浏览器实际上到了console这时 会开一个异步 i/o 到后台，等回台执行时 可能 count++ 已经执行掉了。当然这通常使用都不会出问题，因为这是游离不定的没法预测。出现异常时最好结合debugger ，或者`JSON `来将数据（对象转换成字符串）快照下来。至少到这个时候你该意识到这是i/o 异步化造成的。

## 事件循环

​	先来说说 JavaScript引擎 ，一句话来说就是一个按需执行JavaScript代码块的一个环境。事件循环是环境（此时的化境并不是JavaScript引擎提供的环境，而是代码运行的工作化境比如：web浏览器，node服务器）提供来处理程序中多个块的执行，且执行每块时调用JavaScript引擎的一种机制。实际上提供一个事件队列（这儿有个坑，先挖一下），然后死循环这个队列。每次从头部取一个任务执行大概这样简化模拟一下：

​	

```javascript

var EventList;
while(true){
    if(EventList.length>0){
        var event = EventList.shift();
        try{
            event()
        }catch（err）{
            reportErr(err);
            //把错误抛出来
        }
    }
    
}

```

每次取出的 event 叫做一个 tick ，这样借助Ajax 来讲一下。

```javascript
ajax(url,callback);
```

环境执行到这个块时，发现是个异步 块。JavaScript引擎就会停下来转去执行其它的块，然后环境进行侦听当数据请求回来以后把 callback 这个回调函数插入事件队列中排队。说到这儿顺带提一句，大家都很喜欢使用来做定时器的 `setTimeout`  。确实它原本就是一个定时器，但是是给环境定时的。告诉环境多少时间后把回调函数插入事件队列。` setTimeout(cd，1000)`  一秒后把回调函数 `cd` 给排队起来。这时如果事件队列里面还有子项（假如有存在耗时比较长的任务，就会很明显）换句话说不能插进去就立即执行那就对于你来说是超时的（好好想想你想用来干嘛的）。所以它只能保证多少时间前不能执行！！

## 认知的误区（并行与异步、并发）

​	异步是关于现在和将来的存在一个时间空隙，并行是关于同时发生的事。并行通常借助进程和线程来实现计算，可顺序执行也可能并行执行。在一个进程中的线程可以共享资源。与之相对的是，事件循环把任务分为一个一个的执行更细腻的JavaScript引擎也是单线程的。因此我们并不去思考并行带来的很多不确定性（语句顺序级）。竞态会在 generator 中详细解释（挖个坑，肯定会做的）

​	并发，在同一段时间内两个任务同时执行。// 不想做这儿的例举分析，交互（处理竞态）、非交互、协作



##  任务队列

​	这很刺激吧！记得要和事件循环区分开。前面我们说到了事件循环的每一次叫一个 tick，而这个任务队列就是追加在 tick 后面的一个任务列表（通常是异步任务）当然promise 就是基于这样的原理。因此当下一个 tick 执行之前，前一个的任务队列上的任务都已经执行完毕。因此说promise 来做定时器更精准些。有的参考资料上把事件循环和任务队列称呼为宏任务和微任务（有道理）。

//画图分析关系，



## 最基础的异步模式——回调函数

​	在异步编程中，回调是最基础的模式。对于我们初级程序员来说很享受用这种方式来异步编程。但是它存在一些问题（heal）， `ES6`  引入的 `promise `  更高级和复杂的处理异步。但是其抽象机制，稍微有一点儿麻烦（第一次我是很头疼的）假如不了解其真的核心，就很难把握实现的细节（挖个坑，我会介绍到它）。



### 嵌套回调和链式回调

​	太深层的嵌套会带来代码 bug 追踪困难可读性很差（看起来很费劲）不停的切换上下文，有种称呼叫回调地狱。其实信任问题才是更地狱！！

​	

```javascript

listen('click',function handle(){
    setTimeout(function request(){
        ajax(url,function response(data){
            if(data== 'xxx'){
                handle();
            }else{
                request();
            }
        },function (){})
    },100)
})

// 此例 来源 你不知道的JavaScript,

```

这种嵌套还是比较简单了，更疯狂的回调。https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553356279281&di=9556975f4c83f766b2fc475d5ef313d6&imgtype=0&src=http%3A%2F%2Faliyunzixunbucket.oss-cn-beijing.aliyuncs.com%2Fjpg%2F77104c85628acda22441c8a4cb6ca394.jpg%3Fx-oss-process%3Dimage%2Fresize%2Cp_100%2Fauto-orient%2C1%2Fquality%2Cq_90%2Fformat%2Cjpg%2Fwatermark%2Cimage_eXVuY2VzaGk%3D%2Ct_100





### 信任问题 

​	继续使用 `ajax` （也可以使用 `axios` ,`fetch-jsonp`  等等第三方库）来说事，通常这些第三方的库函数执行需要传入回调函数。我们将自己封装的函数执行控制交给第三方（对于你而言这是一个黑盒，当然你也可以查看源码），因此什么时候执行，执行多少次都是不可见的。这通常被称为控制反转。

有这么一些问题值得思考：

 * 调用过早/或过晚
 * 调用次数过多/过少（不执行）
 * 吞掉异常和错误
 * 执行时没有传入环境或者参数

你有办法吗？朋友你一点办法都没有。因此回调最大的问题就是控制反转，完全导致信任链的断裂。

补充一点：Error-first 模式。

## promise 

​	’你能做的我会，你不会的我还是会‘。任何强大的技术都不止于技术本身，promise一样当结合 generator （再挖个坑，有空我会继续写篇关于这方面的心得）时，异常强大。根据问题现在我们需要一个解决 反转控制问题，缺乏顺序性的范式。第三方不再去执行我的回调（因为我们想控制一切），第三方库只需要给我一个了解其任务何时结束的超能力（promise 决议对象）。也就是说，你让我知道你什么时候做完我需要你做的工作，我自己决定我接下来该怎么干。这不是很好么！！现在很多平台新增的API 都是基于Promise 来构建的，赶快跟宏哥一起学吧！

### 什么是promise 

​	先来说一个故事，有一天罗学长心血来潮。打电话给学姐A：“我想去跑步，喝奶茶也行，有空吗？宝贝”，这个学姐呢很地道不管能不能去都会回消息。学姐A：“好的，晚点打给你给你答复”。这时罗学长就拿到一个promise（承诺），高兴的开始写代码。晚上十点，学姐A发来短信：“今晚有空，你来接我吧！”，当然也可能收到“今晚不行，我要学习”。好吧！看出来了，一个resolve，一个reject 。对吧，至少这就是执行情况了（我们称之为决议，总会有的）。因此，带来新的问题，未来的值是什么（有可能是上面的短信），决议后执行的事件（罗学长当场气死也算）。

​	///#### 发布前删掉彩蛋

####  promise 值

​	promise值有三个状态，pending （未决议），resolve（完成），reject （拒绝）。pending  =》 reject /resolve 。一旦决议值就会一直保持，不可修改。通常调用函数`Promise.prototype.*` 函数都会返回一个决议后的promise值。注意：reject 值可能是显示生成的也可能是隐式生成的（事件函数出现异常，出错等）。

#### promise事件

​	现在我们来实现一下如何注册事件（成功或者失败的处理事件）

```javascript
function MyAjax(url){
    //做请求
    var data = ajax(url)
    return new Promise(function (resolve,reject){
        //根据决议来回调
        if (data){
            resolve(data);
        }else{
            reject (new Error)
        }
    });
}

function foo(promiseObj){
    promiseObj && promiseObj.then(function (data){
        console.log(data);
    },
                                  function (err){
        console.log(err);
    })
}

var p = MyAjax(/*url*/);
foo(p);

```

还有另一种常用事件注册：`.then ` `.catch`

​	

```javascript

var p = MyAjax(/*url*/);
p.then(function (){},function (){});




```



### promise 信任问题

​	生来就是干这事的！但仍然有那么一丝遗憾，后ES7 可能会有草案。（出现问题，第三方库实现，开发者拥护，特么就变成草案了）

* 调用过早问题。即使拿到的是一个已经被决议的 promise 仍然会以异步的方式调用（将其放在tick后的任务队列），因此不会出现 `Zalgo`现象 ( `javaScript ` 开发社区将同步异步调用混乱的现象)。所以这个问题是不存在的。

* 调用过晚问题。当Promise 生成对象调用`resolve()`，`reject()`时,这个Promise 的 then（）注册的观察回调会被自动调度。也就是说，再下次异步点（tick）之前这些通过then（）注册的观察回调都会执行完毕。来个列子说一说。

  ```JavaScript
  
  var p =  Promise.resolve();
  
  p.then(function (){
      p.then(function(){console.log("C")});
      console.log("A")
  })
  p.then(function(){console.log("B")})
  
  //A ，B，C 
  
  ```

* 回调未调用问题。Promise决议是没有办法阻止的，语法错误也不行（它会隐式或者说静默失败，reject），为此就像前面说的（学姐很地道）。但是存在一点就是，你注册的观察回调函数中出现语法错误你可能看不到预期的效果（但是依然是执行了的对吧，），补充一点即使这样它也会给出通知（下一次的promise，挖个坑，会有的）因为最后一次返回得到promise总是没办法查看（因为你通过注册观察继续查看它就变成倒数第二个了）。因此不存在未调用问题。但是存在一种一直未决议（pending），此时高级抽象race 设置超时来屏蔽掉。

  ```JavaScript
  function timeout (delay){
      return new Promise(function (resolve,reject){
          setTimeout(function (){
              reject("timeout");
          },delay)
      })
  }
  
  function foo(delay){
      return new Promise(function (resolve,reject){
          setTimeout(function (){
              resolve("fulfil");
          },delay)
      })
  }
  
  var p = Promise.race(foo(1000),timeout(500))
  p.then(function(){
      console.log("没有超时");
  },function(){
      console.log("超时了");
  })
  
  //注意代码中，留了一个坑考考大家
  ```

  

* 回调被调用多次问题。因为promise一旦决议就不能更改，所以`resolve or reject ` 仅仅只能被调一次（有有且仅有一次）。

* 吞掉错误或异常问题。实际上，Promise 在生成决议甚至在查看决议结果时出现语法错误或者异常时（比如`TypeError` ,`ReferenceError`） 这些异常都会被捕捉，然后这个Promise就被拒绝了。接下来看看这两种情况。

  ```javascript
  
  var p = new Promise(function (resolve,reject){
      foo.a();
      resolve(12);
  })
  
  p.then(function(){console.log("fulfil")},
        function(){console.log("reject")})
  
  ```

  我们再看一个

  ```javascript
  
  var p = Promise.resolve(12);
  
  p.then(function (){foo.a(); console.log("fulfil")},
        function(){console.log("reject")})
  
  ```

  是不是很呐闷，假如出现在观察回调函数中的异常呢。此次 promise 决议已经是 resolve（完成状态），且决议一旦发生就不可更改。怎么办？此时会继续返回一个新的 promise （这就是promise可以链式调用的根本原因）决议来源就是 上一个 then 中注册函数中出现的异常。所以异常是不会被吞掉的（除了最后一个）。



### Promise建立信任

​	先说一下 `thenable`   关于`thenable` 鸭子类型（`duck typeing`）,j具有 then 函数的都属于`thenable` 类型，虽然这种判断比较简陋但是一般情况下已经够了。记住，别尝试这样做`Function.prototype.then = function {}` 诸如此类的在原型链上改变 then。（长得像鸭子，并且叫起来也像鸭子俺么它就是鸭子）这显然具有`thenable` 的并不一定就是promise 对象（或者说成值）,因此Promise提供一种高级抽象来避免第三方传来的并不是一个promise值而只是具有`thenable`  的值。`Promise.resolve()`  传入promise值它直接将其返回（并不存在性能问题）如果只是传入一个具有`thenable`的非promise值，那么它会进行解析然后返回一个promise值。因此你总能拿到promise可信任的值。（假如你有点晕，一定是没有说清楚请参考`Promise.resolve()`  官方定义）。  



### 链式流

​	前面或多或少的提了一些，现在认真说一下链式流。调用 `Promise`的then 会自动创建一个新的promise 从调用返回（显示返回则会覆盖，`return new Promise(...)`）。如果完成或者拒绝函数返回一个值或者一个异常，新的promise 都会相应的决议（此时就成为链式流）。顺序流程控制还需与generator 结合使用，  一种更适合逻辑的表达模式（这里不讲，放在生成器中）。

​	

```javascript


//可以写代码 演示


```

### 错误处理

​	同步中错误处理通常借助try{}catch（）{} 就能很好的处理掉错误，但是异步中这完全没有效果。看看代码如下：	

```javascript

function foo (count,delay){
    setTimeout(function (){
        count && count.toString();//未来抛出12.toString()这样的错误
    },delay || 100)
}

try{
    foo(12,100);
}catch(e){
    console.log(e);//到不了这儿，抛出全局错误
}

```

简单说一说 `error-first`  模式，这是回调函数最常用的方式来处理异步出错的情况。

 

```javascript

function foo(callback,count,delay){
    setTimeout(function (){
        try{
            let value = count.toString();
            callback(null,value);
        }catch(err){
            callback(err);
        }
    },delay ||100)
}

foo(function(prop){console.log(prop)},12,100);

```

Promise 采用的另外一种风格，分离回调（split-callback）。Promise 中then（...）第二个参数、catch(..)中传入的参数都是作为处理错误的回调函数。存在一个陷阱当注册回调函数中出现错误时then(...) 中的第二个参数注册的回调函数并不能拿到这个错误（实际上前面提到过）例如：

 

```javascript
var p = Promise.resolve(42);
p.then(function (){
    12.toString();
},function (err){
    console.log(err);//执行不到这儿，
}).catch(function(){
    //这儿就能处理掉前面的错误
})

```

p 已经被42 决议了，不能更改。所以返回新的 promise （使用错误决议的值）来呈现错误，往往可能导致错误被静默掉。所以有开发者提出总是在最后带一个catch来捕获错误（但是catch中的错呢！），这是个坑。这些都是有办法解决的，默认情况下在这个时间点上（该tick内）还未注册错误处理函数，则会在下一个tick之前向终端报告错误。如果想保持这种错误状态，可以使用defer 来推迟报告。

### API介绍移步MDN

​	



### Promise 存在的一些不足

 * 一旦决议不可更改，挂起无法撤销。但是可以借助，超时来处理掉它（前面有提及，这儿不再赘述）。
 * 顺序错误处理。可能会造成一些错误被静默的过掉。

### 写在最后

​	此次学习心得，总结的并不是很完美。也存在很多漏洞，如你能发现请告诉我错误的地方我会做出改正。如有新的技术更新，一起学习，一起分享。[ 2019-3-24]