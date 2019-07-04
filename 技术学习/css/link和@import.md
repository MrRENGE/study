

### CSS中的link和@import的区别

* link属于XHTML标签，除了加载css之外还能用来定义RSS（基于XML的简易内容聚合），@import是css提供的用于加载css。

* link在页面被加载的时候同时被加载，而@import引用的css会延迟到页面加载结束后再加载。

* link属于标签引用css,因此可以在js中动态引用，而@import则不支持。

