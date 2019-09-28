var person = {
    name:'ren',
    age:'12'
}

function ren(worke){
    console.log(this.name);
    console.log(this.age);
    console.log(worke);
}

let fun = ren.bind(person,'coding');
console.log('------标准库函数执行结果----')
fun();
console.log('new 调用')
new fun();

Function.prototype._bind = function (context){
    let self = this;
    let args = Array.prototype.slice.call(arguments,1);
    return function (){
        let argu = Array.prototype.slice.call(arguments)
        self.apply(context,args.concat(argu))
    }
}

console.log('-------------第一版bind-----------')
let fun_my = ren._bind(person,'fucking');

fun_my();
console.log('new 调用fun_my')
new fun_my();

// 优化bind后的this指向问题，当使用new  调用的时候constructor 指向 的原型不对

Function.prototype._bind2 = function (context){
    let self = this;
    let agu = Array.prototype.slice.call(arguments,1);

    function binFun(){
        let agum = Array.prototype.slice.call(arguments);
        self.apply(this instanceof binFun?this:context,agu.concat(agum))
    }
    binFun.prototype = this.prototype;
    return binFun;
}

console.log('-------------优化constructor 指向');
let fun1 = ren._bind2(person,'lazy');
fun1();
console.log('new 调用');
new fun1();


// 注意非函数不能使用bind
// 注意使用中间函数来中转原型，解决new调用时this的指向问题
// 

Function.prototype._bind3 =function (context){
    // 只有函数才能绑定
    if(typeof this !=='function'){
        throw new Error('this is not function');
    }
    let self = this;
    let arg = Array.prototype.slice.call(arguments,1);
    function FTemp (){}
    FTemp.prototype = this.prototype;
    function bindFun(){
        let argu = Array.prototype.slice.call(arguments);
        // 判断 new 调用时候是使用this ，正常调用使用 context 对象作为this指向
        self.apply(this instanceof FTemp?this:context,arg.concat(argu))
    }
    bindFun.prototype = new FTemp();
    return bindFun;
}


// console.log('-------------高仿------------');
// let f = ren._bind3(person,'code');
// f();
// console.log('new -');
// new f();



// 模拟call /apply
//思路：
//  1.获取上下文context，call的第一个参数传入是null 的时候默认绑定到window，非引用类型上下文则进行装箱调用
//  2. 截取参数，
//  3. 调用函数，并获取返回值
//  4.删除context上的函数

Function.prototype.call2 = function (context) {
    var ctx = (context==null ? window : context);
    ctx.fn = this;
    var arg = [];
    for (var i = 1; i < arguments.length; i++){
        arg.push('arguments['+i+']');
    }
    arg = arg.join(',');
    var result = eval('ctx.fn('+arg+')');
    delete ctx.fn;
    return result;
}

function test(name,age) {
    console.log(name);
    console.log(age);
    console.log(this);
    return 'handsome boy';
}

const ctx = { msg: 'call test' };
const ctx1 = { msg: 'call test' };
console.log('call runing');
console.log(test.call('', 'ren', 12));
console.log('call2 runing');
console.log(test.call2('', 'wang', 66));