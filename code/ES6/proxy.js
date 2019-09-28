var MrRen = /** @class */ (function () {
    function MrRen(name, age) {
        this.name = name;
        this.age = age;
    }
    return MrRen;
}());
var trap = {
    set: function (trapTarget, key, value, receiver) {
        if (!trapTarget.hasOwnProperty(key)) {
            throw new Error("trap set runing ");
            console.log('trap set runing...');
        }
        Reflect.set(trapTarget, key, value, receiver);
    }
};
var ren = new MrRen('ren', 18);
var Ren = new Proxy(ren, trap);
console.log(Ren.name, Ren.age);
ren.name = 'MrRen',
    ren.age = 20;
Ren.ya = 'rrrr';
console.log(Ren.name, Ren.age);
