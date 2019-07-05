# ES6 中Set 和Map

目录结构：

 * Set 
 * weakSet
 * Map
 * WeakMap

## Set

es6 引入 Set，是一种无重复值得有序列表。可以存储对象（引用）基本类型值，使用如下：

* 实例化 ` let set = new Set(prams)`  prams 可以是单个的值，也可以是一个数组，它会自动过滤重复值。
* 新增选项 ` set.add(item)` 
* 判断是否存在子项，使用` set.has(item)` 返回一个bool值
* 删除子项使用 `set.delete(item)` 
* 全部清空使用 ` set.clear()`
* 子项数目使用 `set.size` 属性而不是方法
* 遍历使用 `set.forEach( (value,key,ownSet)=》{...}，this)` 方法

可以借助Set快速的实现数组去重，（数组去重）

```javascript
function duplicateRemoval (item){
    return ([...new Set(item)]);
}
```

Set 的使用场景是在，不使用对象作为子项的情况下。使用对象会保存一个新的引用，不利于垃圾回收机制清理。

 ## WeakSet 

Set 类型存储对象引用的方式导致的问题，可以轻松使用WeakSet来 处理掉。WeakSet存储的是对象的弱引用，而不能存储基本类型的值。

使用和Set基本相同。没有size方法，没有 forEach、也不能使用 for of 中使用。

## Map

Map 是键值对的有序列表，键和值可以是任意类型。键的比较使用的是`Object.js()`  ,es5 使用类来模仿Map就存在不一样。因为` Object.is()`  比较规则类似 “===” 需要判断类型和值，不同的是NaN 等于NaN。

![1558006221873](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1558006221873.png)

使用方法：

* 初始化 ` let map = new Map(prams) ` prams 可以是个二项数组，也可以是个以二项数组为子项的数组。

  `['title','JavaScript']或 [['nbame','Tom'],['age',22]]` 

* 增加子项，使用` map.add(key,value)` 增加使用键值得形式依顺序传参。

* 取值，` map.get(key)`

* 同Set一样拥有，`has 、delete、clear` 方法

* 遍历 `map.forEach( (value,key.ownMap)=>{...} )`  

##　WeakMap

weakMap 是键值对的无序列表，键值只能是非空对象，值则可以是任意类型。也是对象的弱引用，有利于垃圾回收机制。

例：使用weakMap实现私有数据（结合闭包，因为闭包会存在内存泄漏，只能手动复制null来回收内部数据对象）

 

```javascript
var Person =(function(){
    let privateData = new WeakMap();
    function Person(name){
        privateData.set(this,{name});
    }
    Person.prototype.getName = function (){
        return privateData.get(this).name;
    }
    return Person;
}());

// 使用立即执行函数以及闭包生成一个函数，内部使用 this 去作为 key 值保存数据，当外部函数引用别释放后，weakMap 对象自动释放。
```

