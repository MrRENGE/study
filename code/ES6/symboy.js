function fun(str) {
    let stack = [];
    let temp = str.toString().split('');
    console.log(temp);
    if (str == '') { return false };
    for (let i = 0; i < temp.length; i++){
        switch (temp[i]) {
            case '(': {
                stack.push('(');
                break;
            };
            case '[': {
                stack.push('[');
                break;
            };
            case '{': {
                stack.push('{');
                break;
            };
            case '{': {
                stack.push('{');
                break;
            };
            case ')': {
                let st = stack.pop();
                if (st != '(') { return false; };
                break;
            };
            case ']': {
                let st = stack.pop();
                if (st != '[') { return false; };
                break;
            };
            case '}': {
                let st = stack.pop();
                if (st != '{') { return false; };
                break;
            };
            default: {
                continue;
            }
        }
    }
    if (stack.length !== 0) { return false };
    return true;
}
