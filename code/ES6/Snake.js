function SnakeTree(tree){
    let stackL=[],stackR=[];
    stackL.push(tree);
    while(true){
        if(stackL.length==0&&stackR.length==0){
            break;
        }
        while(stackL.length>0){
            let node = stackL.pop();
            console.log(node.value);
            if(node.left){
                stackR.push(node.left);
            }
            if(node.right){
                stackR.push(node.right);
            }
        }
        while(stackR.length>0){
            let node = stackR.pop();
            console.log(node.value)
            if(node.right){
                stackL.push(node.right);
            }
            if(node.left){
                stackL.push(node.left)
            }
        }
    }
}

let tree = {
    left:{
        left:{
            left:null,right:null,value:4,
        },right:{
            left:null,right:null,value:5,
        },value:2,
    },
    right:{
        left:{
            left:null,right:null,value:6,
        },right:{
            left:null,right:null,value:7,
        },value:3
    },
    value:1
}

 SnakeTree(tree)
