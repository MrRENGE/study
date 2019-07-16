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