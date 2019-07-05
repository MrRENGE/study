# react  学习



## 属性特例

* for 换成 htmlFor 
* class 换成 className
* style格式    ==> style ={{CSSkey:CSSvalue}} 或者把里面的css代码对象在state 中定义好，直接引用

## 图片的引用

 * 服务器本地文件引用 先使用import 引入资源然后绑定到 src 属性[ import imag from 'url', <img src = {imag}/>]，或者直接src = {require(url)}
 * 引用其它托管的图片网址，直接将其赋值给src [ <img src = 'https:baidu.....'/>]

## 事件绑定及其 this 传递

​	事件绑定都是使用  on+事件名  这种方式 如：<button onClick = {this.function}/> 

 * 绑定 （组件内部）全局this第一中 使用 .bind(this,props) 的方式
 * 绑定 （组件内部）全局this第二种 在constructor 中绑定 this.function = this.function.bind(this)
 * 绑定 （组件内部）全局this第三种 借助 es6 的箭头函数 fun = ()=>{} 来定义事件函数 这是最常用的方式

## 事件

​	事件的响应函数第一个参数是 event 对象（包含触发事件函数的对象的详细信息 target ），其它事件的模型与原生事件、（键盘事件，onChange ,等事件是一样的使用）。

### react使用 ref

​	通常使用 ref 属性进行表单的监视，{<input type='text' ref = "username"/>} 这样来标记一个元素，然后查找元素时使用 {this.refs.[username]} 来定位到指定元素 。

## 表单

  	注意，this.setState 是一个异步方法，表单是个知识点很多的地方，具体问题参见官网。

## 父子组件传值

### 	父组件向子组件传值

​	父组件引用子组件时将目标数据（数据，函数，或者整个父组件）作为属性添加到子组件的引用标				签上例如[<Home appData ={this.data}/>]、[]\[<Home appData ={this.run}/>]、[<Home appData ={this}/>] ，然后在子组件的使用this.props.appData 来获取传过来的数据或者函数，也能是更复杂的数据结构。

   ### 	子组件向父组件传值 

​	这个跟简单第一种：使用函数参数传值，父组件中把定义好的函数作为子组件的属性传入，子组件在绑定函数时通过函数参数将其传递给父组件（因为函数执行的环境依然是父组件 * 这是个问题 *）。

​	第二种父组件获取子组件的方式：直接在子组件的引用上使用 ref = 'name'属性，然后通过this.refs.refName 直接获取整个组件的全部内容。

	### 规范父组件传值的类型，以及设置默认值

​	sonComponent.defaultProps ={ key:value}  这样来设置默认值，注意在导出子组件的前设置就行；

规范限制父组件传值类型：先引入 import PropsTYpe from 'prop-types'

然后在组件export之前设置属性的类型规则如：sonComponent.propstype={name:PropsTYpe .string,cont:PropsTYpe .number}。注意小写的propstype只是组件的一个属性，而大写的PropsTYpe 是引入的一个内置模块。



##  请求接口获取数据 axios 或者fetch-jsonp

 安装 =》import =》看文档使用

判断接口支持JSONP的方式直接在接口后面增加参数callback ，然后查看返回的信息如果是jsonp支持。则会表示为callback函数执行数据的格式。jsonp(使用的fetch-jsonp 模块)，其实这些模块都是程序员自己封装的 npm 包。

## 生命周期函数及其执行流程

 	当使用刷新或者访问地址时，请求到react框架的代码段时。首先执行 constructor 然后执行生命周期函数componentWillMount (即将渲染)、再然后执行render（渲染函数）、接着就开始挂载执行生命周期函数（componentDidMount）将组建挂载到父组件上或者指定的dom节点上。因此注意到，数据渲染是在 render 函数执行完成以后，所以通常对dom的操作一般都是在componentDidMount 生命周期函数中进行。（先渲染再挂载）。

​	数据更新相关的生命周期函数：首先当数据更新时触发 shouldComponentUpdata 生命周期函数（根据返回值，如果是false 就不再继续触发其他函数去更新数据，true的情况下才会继续执行），当返回true时触发 再render 函数进行重绘 dom,最后触发componentDidUpdata 生命周期函数。

​	组件销毁：componentWillUnmount  触发 这个生命周期函数

## react -router

​	路由的存在，为了动态按照请求地址挂载组件。第一步安装：npm  install react-router-dom --save  然后在App 组件中引入 模块{Router，Route，Link} 需要使用的（模式匹配加载）。

```
<Router>  <Route path ='.....' component ={componentName}    <Link to="..."> title</Link> </Router>
```

改变路由:<Link to ='...'>

配置路由：<Route path ="...." component ={}/>  route 中的属性 exact  表示严格匹配类型。

配置路由时，所有的内容都在<Router></Router> 中间最好在里面嵌套一层 div。	

动态路由的配置:在路由 path属性后面接上 （/:参数名）例如：![1551398787758](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1551398787758.png)

获取动态路由的信息可以在子组件通过 this.props.match 对象获取信息，所有的参数信息都在this.props.match.params 对象中。（我认为树形嵌套对象定义是API的一个特点）注意获取这个动态路由信息最好在生命周期函数componentDidMount中获取。

动态路由获取get传值：get传递的参数信息放在对象 this.props.location.search 中，需要手动解析字符串（我认为可以使用数组截取‘&’ 然后每一个参数和值就是一个数组子项）。

![1551402951025](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1551402951025.png)



## React 中的一些注意事项

​	由于 react 中使用的请求数据模块大部分都是异步，所以当页面渲染后可能会出现错误（尤其是当页面中的的图片需要请求 url 时），因此需要做判断处理如果 url 还未请求到那么使用 空字串去覆盖图片标签。注意由于请求数据很快渲染，因此是看不出差别的。

## 登录跳转

​	引入 Redirect 使用一个状态来标记是否跳转（登录状态），![1551407766924](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1551407766924.png)



## 嵌套路由 

​	和普通组件嵌套一样，直接在组件中（和App中定义路由一样）定义路由，需要加上当前 url 作为path 前缀，通常使用 this.props.match.url 来拼接。当模块化抽离 路由以后配置会翻生一些变化。首先将模块抽离成一个 routes  module ，在该模块中定义路由所需要的信息。（引入组件、component、path、exact 【false、true】等属性）作为一个对象数组存在，有嵌套子路由的需要继续配置字段 routes （依然相同的数据结构）。然后在App 中引入路由配置模块，map 数据形成Route ，此时也许会有子路由的配置（这种情况下Route 标签的写法会有变化，可查看官网）。

![1551431742435](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1551431742435.png)

此时的Route 中的component属性要换成 render ，render属性中存在一个箭头函数函数返回一个组件（类似普通的render渲染函数，此时传递的 routes 数据就如同组件之间的通信一样）获取传递的子路由信息也是通过this.props.属性名 这样的方式来获取（其实就是包装一下的父子组件传值通信）。

单独说一说封装（模块化）路由：其实就是将所有的路由信息提取成为对象数组，嵌套路由也是一样的数据结构。

![1551432313446](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1551432313446.png)

### 状态管理

	#### 	context 一个很危险的状态管理机制

​		在组件中定义 context 以后在所有的组件中都能使用 context 上的状态，不必再层层父子组件传值。

​	他的实现：在组件中使用 getChildContext(){return {key:value}} 这样来返回一个 context 对象。此时必须指		 				定 key 的类型 proptype