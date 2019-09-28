// 模仿 new 的工作原理
function newFun(){
    let obj = Object.create(null),
    // 第一个参数为new 执行的函数名，也是它自身的构造函数
    Constructor = [].shift.call(arguments);
    // new 执行的时候需要拷贝原型，构造函数的原型通过_proto_进行访问
    obj.__proto__ = Constructor.prototype;
    // 执行构造函数
    let ret = Constructor.apply(obj,arguments);
    return typeof ret === 'object'? ret : obj;
}

function Person(name,age){
    this.name =name;
    this.age = age;
}
let ren = new Person('ren',12);
console.log(ren.name,ren.age,ren.__proto__.__proto__);
let luo = newFun(Person,'luowen',13);
 console.log(luo.name,luo.age,luo.__proto__.__proto__);