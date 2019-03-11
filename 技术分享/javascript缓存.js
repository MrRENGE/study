function memorize ( fun ) { 
    var cache = {} ;
    return function  ( ) {
        let key = arguments.length + Array.prototype.join.call(arguments,",");
        if ( key in cache ) {
            return cache[key];
        }else{
            return  cache[key] = fun.apply( this , arguments );
        }

    } 
}



function fac (n) {
    return ( n<=2 ? 1:fac(n-2)+fac( n-1 ));
}