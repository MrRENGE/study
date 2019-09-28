interface Man {
    name: string,
    age: number,
}

class MrRen implements Man {
    public name:string;
    public age: number;
    constructor(name:string,age:number){
        this.name=name;
        this.age=age;
    }
}

const trap = {
    set(trapTarget, key, value, receiver){
        
        if(!trapTarget.hasOwnProperty(key)){
            throw new Error("trap set runing ");
            console.log('trap set runing...');
        }
        Reflect.set(trapTarget, key, value,receiver);
    }
}
const ren = new MrRen('ren',18);
const Ren = new Proxy(ren,trap);
console.log(Ren.name,Ren.age);

ren.name = 'MrRen',
ren.age=20;
Ren.ya = 'rrrr';
console.log(Ren.name,Ren.age);
