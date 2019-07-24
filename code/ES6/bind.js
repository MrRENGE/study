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


console.log('-------------高仿------------');
let f = ren._bind3(person,'code');
f();
console.log('new -');
new f();

