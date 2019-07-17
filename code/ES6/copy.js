// 耍赖使用JSON 
function deepCopy(target){
    return JSON.parse(JSON.stringify(target));
}



// 递归实现
function deepCopy (target){
    // 根据目标数据的类型来定义新对象
    let newObj = target instanceof Array?[]:{};
    if(target==null){
        return target;
    }
    if(typeof target !=='object'){
        return ;
    }else{
        for(let key in target){
            if(target.hasOwnProperty(key)){
                newObj[key] = typeof target[key] ==='object'? deepCopy(target[key]):target[key];
            }
        }
    }
    return newObj;
}

let person = {
    name:'yarn',
    fun:null
}
console.log(person);

let ren = deepCopy(person);
ren.age=12
console.log(ren);