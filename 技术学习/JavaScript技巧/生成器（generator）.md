# generator 学习笔记

​	普通函数的执行都是那顺序执行，从函数执行开始到结束顺序执行（不中断，不接受函数或外部影响）。generator 生成器使用 yield 关键字可以达到中断函数执行（暂停但是保活更加类似的是并发）。

## 生成器的声明及其相关的语法

​	语法：借助 * 符号。 这样就申明了一个生成器函数，和普通函数不样（*号 位置可不同）

* `function *foo(){} ` (这点是社区比较推荐的方式)
* `function* foo(){}  `
*  甚至省掉中间的空格  ` function*foo(){}`。

调用方式和运行机制：

```javascript
function *foo(x){

    x++;

    console.log(x);

    x+=(yield 'helow');

    console.log(x);

    return x;

}
var it = foo(1);
var res = it.next();//{value:'hellow'}


```



  * 第一步需要获取一个迭代器来控制生成器的执行步骤。` var it = foo(/* 根据生成器的申明要求传入参数*/); `

  * 第二步 启动迭代器  ` it.next();` 然后 foo 开始执行直到出现 yield 关键字就暂停。

  * 假如出现 yield 关键字则函数执行会被暂停，此时你可以使用线程去执行其他的代码。当再次从暂停处启动函数时也需要使用迭代器的next函数  ` it.next()` 来继续执行。

    yield ：关键字可进行双向通信，可以从 yield 处 给外部（迭代器）返回数据，也可以接受 `it.next（data）` 传递数据（注意yield 和next 之间存在一个匹配的机制，第一个next 用于启动执行，之后的next 匹配到前一个 yield 语句）

* 返回值之间的关系，第一个next（）执行的返回值由第一个 yield 传递，因为next 总是会比 yield 多一个最后一个next的返回值由 return 传递（注意隐式 return undefined）。

注意：通信是以对象的形式，数据保存在 value上面。

## 多迭代器模拟多线程中的竟态

​	当使用多个迭代器控制生成器时，其实每个迭代器都是控制一个生成器的实例化对象（这儿把生成器看作一个构造函数，那么每一个迭代器就类似的控制一个构造函数生成的对象）因此他们之间是互不影响的（生成器内部）共享整个上下文对象。实际上此时可以通过调用顺序结合yield暂停模拟多线程竞态。

例：

```javascript

function *foo(){
    a++;
    yield a;
    a +=b;
} 

function *bar(){
    b++;
    yield b;
    b +=a;
}

var a=0,
	b=0;




var it1 = foo();
var it11 = foo();
//此时这是两个不同的迭代控制器，对 it1 和 it11 来说


var it2 = bar();

//使用不同的迭代器调用顺序会出现不同的值，对于 foo 迭代器和 bar 迭代器来说


```





