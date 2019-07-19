function BF (origin,target){
    // BF 算法是一个暴力的字符串匹配算法
    var index = -1;
    if (origin.length<target.length){
        console.log('模式串比目标串长')
        return -1;
    }else {
        for (let i = 0;i<origin.length-target.length+1;i++){
            for (let j = 0;j<target.length;j++){
                if(origin[i+j]!==target[j]){
                    break;
                }else if(j==target.length-1){
                    index = i;
                    return index;
                }
            }
        }
    }
}

console.log(BF('abcdefffedrrfregvssdfghjkl;lkjhgf','gf'))