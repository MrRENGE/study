# Redux

### 状态提升

组件之间共享的状态交给组件最近的公共父节点保管，然后通过 `props` 把状态传递给子组件，这样就可以在组件之间共享数据了。

### context 管理公共状态

​	在组件中存在一个上下文，组件将数据状态存放在context中。该组件的所有后代组件都能直接从context上获取数据，而不需要借助中间组件传递props。context 就好比这颗组件树的全局变量。

 

```reac
// 父组件核心代码
static childContextTypes = {
    themeColor: PropTypes.string
  }

  constructor () {
    super()
    this.state = { themeColor: 'red' }
  }
// getChildContext 返回一个context 对象
  getChildContext () {
    return { themeColor: this.state.themeColor }
  }
```

 

```react
class Title extends Component {
  //验证context格式是否正确
    static contextTypes = {
    themeColor: PropTypes.string
  }

//使用context
  render () {
    return (
      <h1 style={{ color: this.context.themeColor }}>React.js 小书标题</h1>
    )
  }
}
```

context可以被组件树上的任何地方获取也能被修改，而Redux 就是更具context 机制进行封装的。



### Redux

#### 背景

实现一个全局状态管理对象很简单，但是全局变量可以在任何地方别动态修改。这带来了很多不确定性，所有共享变量都是不可预期的。因此可以在全局共享对象上做拦截，只能通过指定的函数去修改共享变量。这样就增大了数据改变的可预见性。



未指定修改函数的情况：

![1558249865248](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1558249865248.png)



指定修改函数：

![1558249883596](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1558249883596.png)

  

