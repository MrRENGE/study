// 防抖函数

function debounce(func,defer,immediate){
    let timeout,result;
    return function (){
        let context =this;
        let arg =arguments;
        let callNow;
        if(timeout){
            clearTimeout(timeout);
        }
        if(immediate){
            callNow = !timeout;
            if(callNow){
                result = func.apply(context,arg);
            }
            timeout = setTimeout(function (){
                result = func.apply(context,arg);
            },defer)
        }else{
            timeout = setTimeout(function(){
                result = func.apply(context,arg);
            },defer)
        }
        return result;
    }
}