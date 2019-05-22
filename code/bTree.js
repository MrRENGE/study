
// 先序遍历
function preorder(tree={}){
    console.log(tree.data);
    if(tree.left)preorder(tree.left);
    if(tree.right)preorder(tree.right);
    return ;
    
}

//中序遍历
function inorder(tree){
    if(tree.left)inorder(tree.left);
    console.log(tree.data);
    if(tree.right)inorder(tree.right);
    return ;
}

//后序遍历
function postOrder(){
    
    if(tree.left)postOrder(tree.left);
    if(tree.right)postOrder(tree.right);
    console.log(tree.data);
    return ;
}


// 二叉索搜树

function BtreeSearch(tree,item){
    if(item<tree.data){
        BtreeSearch(tree.left,item);
    }
    if(item>tree.data){
        BtreeSearch(tree.right,item);
    }
    if(tree == null){
        tree = createNode(item);
        return ;
    } 
}
function createNode(item){
    return {
        data:item,
        left:null,
        right:null,
    }
}