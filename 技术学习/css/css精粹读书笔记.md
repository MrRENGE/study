#  css揭秘读书笔记



* [ 2018-12-28 ]  

##  半透明边框下看原背景图

当使用默认使用背景色时，边框下图层被背景色延伸进去。例如：

样式：

```css





```



![1546006591247](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546006591247.png)

效果如上图白色背景色铺满整个边框以内,这是因为默认情况下background-clip属性字段设置如下：。

```css

```

将该字段的值修改为：padding-box，就能达到预期效果。代码修改如下：

```css

```

效果如下图：

![1546007156478](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546007156478.png)



## 在css中使用的相对单位 （ 相对于浏览器视口viewport 不包含工具栏，底边等）

* vw (viewport width ) 表示相对于视口的宽度百分比例如：下面代码表示相对于视口大小的10%

  ```css
  height:10vw
  ```

* vh (viewport hight) 表示相对视口的高度百分比。


## currentColor css中的第一个变量保存color的初始色值

```css
html{
    color:#6b0;
}
p{
    background-color:currentColor;
}
```

上述代码将字体颜色同步到p标签的背景色，当初始字体颜色修改时current Color值同样被修改。



* [ 2018-21-29 ]

## 多重边框

	### 	box-shadow 属性生成多重边框

​	通过box-shadow 属性生成多重边框的效果，通过该方式生成的边框效果在背景之上。而且可以通过“,”连续设置多个边框，但生成的边框依次从上往下堆（第一个在最上面）。默认生成的边框在元素外围，不会改变元素的盒模型大小。使用insert可在元素和模型内部区域生成类似的边框效果。注意边框的形状跟随边框的形状设置border-radius属性时依然同样生成圆角边框。

如图生成两个边框最上层是红色透明边框遮住下面绿色边框的10像素的因此显示出来10px红色5px绿色。注（当红色和绿色复合成为棕色效果）

```css
border: 10px solid  rgba(161, 142, 142, 0.5);
background-clip: padding-box;
box-shadow:  0 0 0 10px rgba(255,0,0,.5),
			 0 0 0 15px rgb(0,255,0,.5);
```

效果图：

![1546094884053](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546094884053.png)

###  outline 属性设置多边框或缝线效果

语法格式：

```css
outline: 5px solid rgba(0,0,0,.5);
```

注意outline属性不会描边，当边框形状为圆形时依然生成的矩形边框。通常结合box-shadow属性 border属性生成一个内容部分圆形边框同时元素外边框为矩形的效果。如图：

![1546099768698](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546099768698.png)

只需依赖一个元素即可完成：

```css

```

注意：由于圆角边框外部与outline生成的矩形边框会形成四个空白区，由此需要根据三角形的勾股定理来计算box-shadow 生成的边框效果宽度大小。

[^outline 属性宽度大小]: 设r表示圆角边框的半径大小。 ![1546100813071](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546100813071.png)

* 第二种解决上诉问题的方案使用两个嵌套元素

  ```css
  .father1{
      background:tan;
      padding: 0.8em;
  }
  .father1>.son1{
      padding:1em;
      background:#655;
      border-radius: 0.8em;
  }
  ```

  css：

  ```css
  text-align:center center;
  height:40vw;
  widows: 50vh;
  padding:10px;
  background:#715;
  border-radius:.8em;
  outline:5em solid red;
  box-shadow:0 0 0 .5em red;
  ```

  效果如图：![1546101240266](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546101240266.png)

  这种方案的好处在于利用了背景色的遮掩，但是额外需要套一层节点。



## 灵活的背景定位

​	需要关注两个属性一个时background-position另一个是background-origin。他们的运用在css精粹中让我大开眼界。background-position指定背景需要偏移的位置例如：

```css
background-position:calc(100% + 10px) calc(100% - 20px);
```

背景偏移右边边框20px，偏移底边10px。

​	另外一个字段是background-origin 通常表示背景开始于什么地方默认是border-box，此时如果设置边框为透明边框则能看见背景图在边框的下面。padding-box 值则背景不会延伸到边框之下，另外content-box则只在内容去开始渲染背景。

#### calc 函数

​	这是一个新引进的函数，用来计算数值。可计算如：100% - 20px这种不确定的大小，适用于响应式布局。注意一点calc(100% - 20px) 函数使用的计算符号两边需要各留一个空格，这是为预留在未来可能传参时附带运算符的一种处理方式。代码示例：

```css
background-size:calc(100% - 20px);
```

## 连续的图像边框

问题描述：使用一副图像给元素设置边框背景，当内容大小（heigh，width）改变时，背景图像同比例的改变。区别border-image的工作原理。border-image：将图片分割成9块然后将其按位置渲染到边框上，由此造成一部分图片固定在某个角落。

效果图：![1546309844427](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546309844427.png)



### 方案一：嵌套元素，两层背景内层元素撑大外部元素

​	双层元素嵌套，外层元素背景使用图片cover，使用 padding 撑开内层元素造成边框既视感。内层元素使用纯色背景（white），但是这种解决方案不够好。移植性真的差，能用一个元素完成的事情那我们就用一个元素实现它。

​        ==.border{==

​        background: url(background.jpg);

​        background-size: cover;

​        padding: 2em;

​    }

​    .border > div{

​        background: white;

​        padding: 1em;

​    ==}==





​	

```css

```



### 方案二：两层背景，采用不同的clip位置以及背景图的origin来实现

​	单个元素两层背景，因为；inear-gradient总是第一层在上面因此它采用纯色（white），背景图在它的下面。两层背景开始的地方稍微错开（背景图从border-box开始，纯色渐变从padding-box开始），然后背景开始的地方 origin 默认 padding-box 改为 border-box 依次来实现效果。

​    ==.border_auto{==

​        margin-top: 50px;

​        padding: 1em;

​        border: 3em solid transparent;

​        background: linear-gradient(white,white),

​                    url(background.jpg);

​        background-clip: padding-box,border-box;

​        background-size: cover;

​        background-origin: border-box;

​    ==}==



## 圆角边框

​	关于圆角边框border-radius 是一个简写属性，其实包括 border-top-left-radius、border-top-right-radius、border-bottom-right-radius 、border-bottom-left-radius 四个属性。每个属性包含两个值用 "/" 隔开，两值相同可简写为一个值。

例：border-top-left: 50% /50%; 左上角圆形边框

## 平行四边形——由矩形skew可得

​	平行四边形有一种动态的美感，可作为按钮、链接等的矩形边框。宿主元素相对定位，伪元素绝对定位再把伪元素skew一下，此时伪元素背景会遮挡宿主内容因此需要设置z-index属性。最后把宿主元素背景设置为transparent让伪元素背景穿透上来。

样式代码：

​    ==.skew_rect{==

​        position: relative;

​        border: 1px solid transparent;

​        background: transparent;

​        color: #f85;

​    }

​    .skew_rect::before{

​        content: '';

​        position: absolute;

​        top: 0;right: 0; left: 0;bottom: 0;

​        transform: skew(-20deg);

​        background: #58a;

​        z-index: -1;

​    ==}==

注意：伪元素选择器需要添加content：“‘；字段样式才有效

![1546325207709](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546325207709.png)



##  切角及其linear-gradient 角度的计算问题

通常将矩形的边角切掉做成菱形边框（图片），又或者切出圆角、三角形等效果。使用属性linear-gradient和radial-gradient属性完成这个challenge，另外一个点角度的开始是y轴开始的逆时针转的具体如图：

![1546410663440](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546410663440.png)

在 linear-gradient 中角度的变化及其零角度的选区是这样的方式（规律）。

矩形切掉三角型：

![1546414682842](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546414682842.png)



css 代码：

 ==.linear_corner{==

​        height: 250px;

​        width: 250px;

​        background: #5588aa;

​        background: linear-gradient(135deg,transparent 20% ,#58a 0 ) top left,

​                    linear-gradient(45deg,transparent 20%,#58a 0) bottom left,

​                    linear-gradient(-45deg,transparent 20%,#5588aa 0) bottom right,

​                    linear-gradient(-135deg,transparent 20%,#5588aa 0) top right; 

​        background-size: 50% 50%;

​        background-repeat: no-repeat;

​    ==}==

矩形切掉圆角：

![1546414756088](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546414756088.png)



css代码：

 ==.radial_corner{==

​        height: 250px;

​        width: 250px;

​         background: #f85;

​         background: radial-gradient(circle at top right,transparent 20%,#f85 0) top right,

​                     radial-gradient(circle at top left ,transparent 20%,#5588aa 0) top left,

​                     radial-gradient(circle at bottom left,transparent 20% ,#ff8855 0) bottom left,

​                     radial-gradient( circle at bottom right,transparent 20% ,#5588aa 0) bottom right;

​        overflow: hidden;  

​         background-size: 50% 50%;

​         background-repeat: no-repeat;

​     ==}==

## 实现梯形标签页

transform 下的 perspective（） scaleY（）rotate（）三个主要属性再结合伪元素（before）和宿主元素间的定位问题。宿主元素相对定位，伪元素绝对定位。根据需求加上其他样式满足你的好奇心。

基本样式解读：

perspective（）：perspective英文原意为（透视、透镜、观点）距离屏幕视角多远（Z轴）

ratate(deg): 按角度绕X轴旋转。

scaleY(): 延Y轴放大多少倍，>1放大反之<1收缩。

注意：使用transform 属性的时候一定要指定旋转的相对位置默认是元素中心位置，有时候我们并不适合默认情况因为它会带来一些难以预料的结果，因此还是自己指定 origin 的值。transform-origin：。

代码：

​     .==nav > a{==

​        position: relative;

​        display: inline-block;

​        padding: .5em 1em .35em;

​        color: white;

​        background: transparent;

​     }

​     .nav >a::before{

​         content: '';

​         position: absolute;

​         top: 0;right: 0;left: 0;bottom: 0;

​         z-index: -1;

​         background: #5588aa;

​         transform: scaleY(1.3) perspective(.5em) rotateX(5deg);

​         transform-origin: bottom;

​         border: 1px solid rgba(0, 0, 0, .4);

​         border-bottom: none;

​         border-radius: 0.5em .5em 0 0 ;

​         box-shadow: 0 .15em #f85 inset;

​     ==}==

效果图：

![1546439515776](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546439515776.png)



## box-shadow 

默认在边框外形成阴影，使用关键字 inset 可在边框内部生成阴影，



![1546567391686](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546567391686.png)

## 毛玻璃（磨砂）效果

技术要点：filter 、blur（模糊函数）

​	通常使用透明背景会增加网页内容的不可读性，通常使用blur（）来将背景模糊。具体的用法：外层容器背景图和内容元素的伪元素（::before）背景图设置为相同。然后再使用 filter：blur（xx px）样式对伪元素进行模糊化，最后将其z-index：-1 （注意此时使用z-index 设置负值后，将会排在在所有设置背景的祖先元素之后）。blur中的像素值越大越模糊，为保证只在指定内容区进行背景磨砂化需要在内容元素样式中加入 overflow：hidden，在伪元素（::before）中加入margin：-YY px( 注意此时的满足 YY>XX)。

效果图：

![1546782387827](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546782387827.png)

代码：

​        ==body,blur_image::before{==

​            background: url("blur.jpg") 0 /cover fixed;

​        }

​       .blur_image{

​        background: hsla(0, 0%, 100%, .2);

​        position: relative;

​        border: 20% solid transparent;

​        margin: 4em;

​        padding: 2em;

​        overflow:hidden;

​     }

​     .blur_image::before{

​         content: '';

​         position: absolute;

​         top: 0;

​         right: 0;

​         bottom: 0;

​         left: 0;

​         z-index: -1;

​         filter: blur(20px);

​         margin: -30px;

​      ==}==

## 实现背景这叫效果（css揭秘 第19个）

​	就像在书的一角将一个角折叠起来，使用linear-gradient两层渐变实现重叠按层在上（渐变时指定的大小一般是沿着渐变轴的，当渐变轴不再水平或竖直方向时注意按照角度转换两个渐变长度的关系）。

45deg折角效果如图：

![1546823294922](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546823294922.png)

样式代码;

​        ==.folded_corner{==

​            background: #5588aa;

​            background: linear-gradient(to right bottom ,transparent 50%,rgba(0,0,0,.4) 0) no-repeat 0 0  / 2.12em  2.12em,

​                        	    linear-gradient(135deg,transparent 1.5em ,#5588aa 0);

​        ==}==

注：1.5em 何2.12em这是勾股定理转化关系，第一个渐变三角形在上层渐变轴为45deg(斜线)，第二个渐变为下层渐变（no-repeat 后面的两个值用于指定背景应用的位置）。

当然我们迎来了一个问题，非45deg 折角的时候，情况变得很复杂不再是简单的渐变角之间的相互遮掩，将涉及到简单的几何长度转化、平移、旋转一系列复杂的计算此时使用简单的css代码很难 即dry又清晰的表达出来这种代码之间的联系，使用一波预处理器。

 @mixin folded_corner($background,$size,$angel:30deg){

​            position:relative;

​            background:$background;

​            background:linear-gradient($angel-180deg,transparent $size,$background 0);

​            border-radius:.5em;

​            $X:$size/sin($angel);

​            $Y:$size/cos($angel);

​            &:::before{

​                content:'';

​                position:absolute;

​                top:0;

​                right:0;

​                background:linear-gradient(to left bottom,transparent 50%,rgba(0,0,0,.2) 0 ,rgba(0,0,0,.4)) 100% 0 no-repeat;

​                width:$Y;

​                height:$X;

​                transform:translateY($Y-$X) rotate(2*$angel - 90deg);

​                transform-origin:bottom right;

​                border-bottom-left-radius:inherit;

​                box-shadow: -.2em .2em .3em -.1em rgba(0,0,0,.2);             

​            }

​            .folded_corner{

​                @include folded_corner(#5588aa,2em,40deg);

​            }

​        }

​	注意：这是一种很复杂的折角，使用时最好先在过一遍设计思路。

##  插入换行、条纹背景

​	使用linear-gradient产生条纹渐变背景，大小为行高的两倍（因为渐变是两种颜色渐变时，一单位的条纹背景是两行），背景origin  从content-box开始。

效果图：

![1546911240189](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546911240189.png)

代码：

 .linear_background{

​	    line-height: 1.5;

​	    padding: .5em;

​            background: lightcoral;

​            background: linear-gradient(lightcoral 50%,transparent 0);

​            background-size: 100% 3em;

​            background-origin: content-box;

​        }

注意：使用表格的情况下，可以使用伪元素对奇数偶数行进行单独的背景设置也可以达到同样的效果。

## 英文单词的换行连接hyphens

​	hyphens: auto; 此属性设置为auto时才会自动换行，如果父元素设置了该属性也可使用inherit 继承。单词断开的规则是根据音节来自动断开并加上 '-' 连接，这需要在<html lang="en"> 中指定language的类型。

![1546912067902](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1546912067902.png)

## 通常使用pre 和code 两元素来展示代码

​	调节其中的 tab-szie 大小，4、2两个常用给的大小。tab-szie : 2；更加流行常用。 



## 通过阴影来弱化背景

​	通常有弹窗或者为了单独强调某元素的亮度时，可通过一些手段将其余背景弱化，最简单的是使用边框的阴影、其次是使用伪元素结合背景和z-index 、最后一种使用<dialog>元素包裹特定元素（被强调的元素）使用该元素的showModel() 显示。可通过该元素的伪元素设置遮罩的样式。

dialog::backdrop {

 	background: rgba(0,0,0,.8);

}

注：这种解决方案不完全支持。

使用box-shadow: 0 0 0 80vmax rgba(0,0,0,.8); 也是可以做到的，但是存在一个bug当存在滚动条时滚动仍然遮挡不尽，这可以使filed 固定解决。且阴影下的元素仍然可以被点击触发事件，这就很难处理。 

## 图片决定外部元素盒子大小

​	通常我们希望图片下的描述文字和文字具有同样的宽度，引入一个属性值  min-content  解析为元素内部不可断行元素的最大宽度。

效果：

![1547257525331](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1547257525331.png)

代码：

​    .box{

​            width: min-content;

​            max-width: 300px;//回退样式

​            max-width: min-content;

​            margin: auto;

​        }

​        .box img{

​            max-width:inherit;

​        }

