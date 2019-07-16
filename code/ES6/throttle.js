function throttle(func,defer){
    let now,prev=0;
      return function (){
          now = +new Date();
          if(now-prev>defer){
              func.apply(this,arguments);
          }
      }
}


function throttle1(func,defer){
    let timeout , context,result;
    return function (){
        context = this;
        let arg = arguments;
        if(!timeout){
            timeout = setTimeout(function(){
                result = func.apply(context,arg);
                setTimeout(timeout);
            },defer)
        }
        return result;
    }
}