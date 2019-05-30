# width和height的作用细节

 **作用位置 ** ：width和height都是作用在容器盒子上的。

## width

width的默认值是auto，根据元素不同的盒子组合类型包含四种特性。

* 充分利用可用空间，比如 ` div 、p` 这些元素宽度默认就是父元素的100%。
* 收缩与包裹，典型代表就是浮动、绝对定位、inline-block、table 等元素表现。
* 收缩到最小，在table-layout 为auto表格中，每一列空间都不够的时候，文字能断就断，断了换行。中文每个字端，英文则不一样（需要设定特殊规则）
* 超出容器限制，子元素内容宽度超过父元素宽度限制。在设定换行为  nowrap 或者英文很长的特殊情况下。会突破父容器限制。

盒尺寸组成：margin、border、padding、content。（内在盒子，也就是容器盒子的组成部分）对应的盒子是，margin box、border box 、padding box 、content box。margin-box 关键字不存在因为实际上没有场景需要使用这个盒子。



### 外部尺寸（元素的尺寸由外部盒子决定）与流体性

水平流默认为父元素的100%，也就是上面的第一条。所以不用设置width，width有四部分组成分别是margin、border、padding、content。不设置我width是为了让content能够被自动分配。注意理解为`display：block flow`  虽然这儿是作用在容器盒子上的宽高，但是只有在外部盒子为block时才适用这一规则。

### 格式化宽度

格式化仅出现在绝对定位模型中，position为absolute或者fixed 的元素，默认情况下是表现为包裹性。当对于非替换元素的绝对定位模型中出现的对立定位方向。如：top/bottom 和left/right这两种情况下，元素的宽度大小相对于最近的定位祖先元素（position不是static）的元素计算。宽度 = 祖先元素宽度-left-right 。

### 内部尺寸（尺寸由内部容器盒子决定的）与流体性

表现为包裹性，使用例如：button 是个典型的inline-block元素。元素的大小确实是由内部容器盒子决定的，因此随着button中的文字慢慢增多，button宽度会慢慢的变大，当到外部尺寸大小时。文字继续增多就会换行显示而不会超出。相当于有一层max-width覆盖着。

### width 作用细节

内在盒子由四个部分的盒子尺寸组成，从外到内依次是margin、border、padding、content。默认情况下设置width是直接作用在content-box 上的。因此这时元素的实际宽度等于 width + padding-left + padding-right + border-left + border-right。此时元素内部的流体性就缺失了。 css3 引入`box-sizing:content-box` 默认值是content-box ，这时width作用的和尺寸就是content盒子上。另一个值是 border-box ，此时width定义的是元素的border盒子为界限，当设定了 border的宽度和padding占用的空间尺寸后，剩下的就是content盒子的尺寸。换句话说此时的内容区是适配的。



### min-*  和 max-* 系列

min-height 和min-width的默认值是auto，因此设置 `transition：min-height  .3s;` 不会出现动画的原因是，默认值为自动而不是零因此会出现图文瀑布下落现象(改进方法是将 `min-height：0`  ) 。而 max-* 系列默认值是none。

覆盖规则：

* max-height 会覆盖 height的值，当发生冲突时。即使height 属性处于 !important 环境下也不好使。
* 当min-* 和 max-* 发生冲突时，min-* 会超越最大。

### 任意高度的收起，下拉菜单

使用max-height 借助 overflow：hidden，以及transition ，实现下拉菜单。

![1559202631256](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1559202631256.png)

### 幽灵空白节点的出现

在HTML5 中 内联元素的前端会出现一个宽度为零的字符节点。