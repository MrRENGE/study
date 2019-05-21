// 简单二分查找算法，所有的值都是唯一的
function bSearch( arr=[],item) {
    let low = 0;
    let hight = arr.length - 1;
    while(low<=hight){
        let mid = low +( (hight-low)>>1 );
        if(arr[mid]>=item){
            hight = mid-1;
        }else{
            low = mid + 1;
        }
    }
    if(low<arr.length &&arr[low] == item){
        return low; 
    }else {
        return -1;
    }
}

// 查找第一个值等于item的元素

function searchFirstItem(arr=[],item){
    let low =0;
    let hight= arr.length-1;
    while(low<=hight){
        let mid = low +((hight-low)>>1);
        if(arr[mid]>item){
            hight = mid-1;
        }else if(arr[mid]<item){
            low = mid +1;
        }else{
            if(mid==0 || arr[mid-1] !=item){
                return mid;
            }else{
                hight = mid+1;
            }
        }
    }
    return -1;
}

// 寻找最后一个等于item的元素
function searchEndItem(arr,item){
    let low = 0;
    let hight = arr.length-1;
    while(low<=hight){
        let mid = low +((hight-low)>>1);
        if(arr[mid]>item){
            hight= mid-1;
        }else if(arr[mid]<item){
            low = mid+1;
        }else{
            if(mid == arr.length-1 || arr[mid+1]!=item){
                return mid;
            }else{
                low = mid+1;
            }
        }
    }
    return -1;
}