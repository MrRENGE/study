function strParse(str){
    let result = [];
    const operators = ['+','*','-','/'];
    let item ;
    let prev ;// 用来表示上一个操作数
    let next;//用来表示下个个操作数
    let num;
    for (let i =0;i<str.length;i++){
        prev = str[i-1];
        item = str[i];
        next = str[i+1];
        console.log(''+prev+''+item+''+next);
        // 左边为空或者为( ，则表示负号
        if ( (prev == undefined||prev =='(') && item=='-' ){
            item = '#';//#表示负数符号，运算时替换为 -1 计算
            result.push(item);
            continue;
        }else if ( (operators.indexOf(prev)>0) &&!Number.isNaN(next*1)&&item=='-'){
        // 左边为运算符，且右边为数字则表示负数
            item = '#';//#表示负数符号，运算时替换为 -1 计算
            result.push(item);
            continue;
        }else if (!Number.isNaN(item*1)){
            // 如果当前为数字，并且前一个非数字那么 num = item
            // 如果当前为数字，并且下一个非数字 ，那么 num = num*10 +item; 并且把num 入栈
            // 其他则下一个是数字那么 ，num = num *10 + item ;
            if( Number.isNaN(prev*1)){
               num = parseInt(item);
               if(Number.isNaN(next*1)){
                   result.push(item);
               }
            }else if(Number.isNaN(next*1)){
                num = parseInt(num)*10 +parseInt(item);
                result.push(num);
            }else{
                num = parseInt(num)*10 +parseInt(item);
            }
            
        }else{
            result.push(item);
            continue;
        }
    }
    return result;
}

// 测试解析函数
let str = '-(-(-212*30+15))+6/2--4+115';
let arr = str.split('');
console.log(strParse(arr))


// 计算函数
function Calculation(arr){
    const stack=[];
    const small; //保存临时弹出的 左括号
    const operators =['+','-','(','#']
    let result;//表示运算结果
    while(arr.length){
        let item = arr.shift();
        // 如果item 是数字或者，+，-，# 、( 则压入栈中
        // 负数也压入栈中，因为负号是修饰后面弹出的结果
        if( !Number.isNaN(item*1) ||operators.indexOf(item)>0){
            stack.push(item);
        }
        // 遇见 * / 先进性计算后压栈
        if(item=='*'||item=='/'){
            // 左边栈中取，右边数组arr 中取
            let left = stack.pop();// 左操作数
            let negativeLeft = stack.pop();
            let negativeRight = arr.shift();//又操作数可能存在的负数负号
            let right = arr.shift();//右操作数
            
            // 不是负号进行还原，负号则修改左右操作数值
            if(!Number.isNaN(left*1)&&!Number.isNaN(right*1)){
                if(negative=='#'){
                    left = parseInt(left)*(-1);
                }else{
                    stack.push(negativeLeft);
                    left = parseInt(left);
                }
                if(negativeRight=='#'){
                    right = parseInt(right)*(-1);
                }else{
                    arr.unshift(negativeRight);
                    right = parseInt(right);
                }

                // 判断乘除运算
                if(item=='*'){
                    result = left*parseInt(right);
                }
                if(item =='/'){
                    result = left/parseInt(right);
                }
                stack.push(result);
            }else{
                return new Error('表达式错误');
            }
        }

        // 遇见 ) 进行迭代弹栈计算
        if(item==')'){
            let small =1;
            while(small){
                let right = stack.pop();//右操作数
                let negativeRight = stack.pop();//又操作数可能存在的负数负号
                let left ,
                    negativeLeft ,
                    op;
                // 如果右操作数为负数，进行如下操作 
                if(negativeRight=='#'){
                    op = stack.pop();
                    right =  parseInt(right)*(-1);
                    // 如果出现左括号，表示此次括号计算结束
                    if(op=='('){
                        small-=1;
                        result =  right
                        stack.push(result);
                        continue;
                        // 如果op为运算符，则是正常计算
                    }else if(op=='+'||op=='-'){
                        left = stack.pop();
                        negativeLeft = stack.pop();
                        if(negativeLeft!='#'){
                            stack.push(negativeLeft);
                        }else{
                            left = parseInt(left)*(-1);
                        }
                        // 判断运算符进行计算
                        if(op=='+'){
                            result = left + right;
                        }
                        if(op=='-'){
                            result = left - right;
                        }
                    }else{
                        // todo 嵌套太深，可读性降低，需要抽离做成递归匹配计算
                    }
                // 右操作数不为负数
                }else{
                    op = negativeRight;
                    // 待实现，其他判断
                }
            }

        }
    }
}