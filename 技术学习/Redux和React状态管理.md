# Redux

### 状态提升

组件之间共享的状态交给组件最近的公共父节点保管，然后通过 `props` 把状态传递给子组件，这样就可以在组件之间共享数据了。

### context 管理公共状态

​	在组件中存在一个上下文，组件将数据状态存放在context中。该组件的所有后代组件都能直接从context上获取数据，而不需要借助中间组件传递props。context 就好比这颗组件树的全局变量。使用context时需要进行验证，子组件需要验证 prop-types 是否与context跟组件上的类型是否相同。

 

```reac
// 父组件核心代码

// 设置子组件中验证 context 对应字段的类型
static childContextTypes = {
    themeColor: PropTypes.string
  }
  
// 初始化设置state设置 themColor 
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





### Redux封装

#### 背景

实现一个全局状态管理对象很简单，但是全局变量可以在任何地方别动态修改。这带来了很多不确定性，所有共享变量都是不可预期的。因此可以在全局共享对象上做拦截，只能通过指定的函数去修改共享变量。这样就增大了数据改变的可预见性。



未指定修改函数的情况：

![1558249865248](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1558249865248.png)



指定修改函数：

![1558249883596](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1558249883596.png)

  

#### 纯函数

 	输出结果只依赖参数，不影响环境。一个函数的返回结果只依赖于它的参数。函数执行过程没有副作用不适用其它环境中的变量，一种很靠谱的函数。因为纯函数非常“靠谱”，执行一个纯函数你不用担心它会干什么坏事，它不会产生不可预料的行为，也不会对外部产生影响。不管何时何地，你给它什么它就会乖乖地吐出什么。如果你的应用程序大多数函数都是由纯函数组成，那么你的程序测试、调试起来会非常方便。





###　封装整个ｒｅｄｕｘ

* 渲染函数

  通过获取数据和目标dom对象，以及对应的样式。不考虑回流以及重绘等其它的性能开销。简单的对render函数进行实现。

   

  ```javascript
  // dom 节点
  <div id = 'app'>
      <div id = 'title'></div>
      <div id = 'content'></div>
  </div>
  //状态信息
  const appState = {
      title:{
          text:"react 小书标题",
          color:"green",
      },
      content:{
          text:"react 小书内容",
          color:'red',
      }
  }
  
  function appRender (appState) {
      titleRender(appState.title);
      contentRender(app.appState.content);
     
  }
  
  function titleRender(state,el = 'title'){
      const title = document.getElementById(el);
      title.innerText = state.text;
      title.style.color= state.color;
  }
  
  function contentRender(state,el='content'){
      const content = document.getElementById(el);
      content.innerText = state.text;
      content.style.color = state.color;
  }
  
  ```

  存在的问题，在渲染前或者在其他函数中修改了appState  渲染函数将会失败或者抛错。因此限制对数据的修改变得很重要。防止误删获取说，把数据修改的复杂度提升以下。

* 引入dispatch 作为数据修应该的唯一接口

   

  ```javascript
  function dispatch(action){
      switch(action.type){
          case 'UPDATA_TITLE_TEXT':
              state.text = action.text;
          case 'UPDATA_TITLE_COLOR':
              state.color = action.color;
              break;
          default: break;
      }
  }
  
  ```

  此时修改数据需要传入一个对象，更具限定的数据修改允许类型对树进行修改，这样即使数据被修改了仍然可以很好的追踪修改的源头在case中debugger。现在这个dispatch能够负责修改数据了，对于其它数据对象仍然需要其他的修改函数，因此我们将数据和修改函数捆绑在一个store中。抽离以一个接口出来。

* createStore 的分离包装

   

  ```javascript
  function createStore(state,stateChange){
      const getState = ()=>{state}
      const dispatch = (action)=>{stateChange(state,action)}
      return {getState,dispatch};
  }
  //使用
  const state = {data:...,
                style:...,
                else:....}
  function change(action){
      switch(action.type){
          case '':..
          ...
      }
  }
  //进行操作
  const store = createStore(state,change)
  store.getState();
  store.dispath(action);
      
  ```

  现在的 crateState 将数据和操作封装到一个集合中，但是当数据被修改的时候需要手动调用 renderApp 函数，下面引入观察者模式将数据改变后执行的操作函数绑定到store上监听数据的变化然后触发监听函数更新操作。例如：数据修改了，重新自动 执行 renderApp。

* 引入观察者模式的createStore

  ```javascript
  function createStore(state,stateChange){
      const linsners = [];
      const subscribe = (linsner)=>{linsners.push(linsner)};
      const getState = ()=>{return state;}
      const dispatch = (action)=>{
          stateChange(state,action);
          linsners.forEach((item)=>{item()});
      }
  
      return {getState,dispatch,subscribe}
  }
  
  const store = createStore(appState,stateChange);
  store.subscribe(()=>{appRender(store.getSate)});
  
  ```

  通过使用store.subscribe(linsner) 传入监听数据变化后执行的函数，达到动态渲染的效果。danshi

* 采用共享结构优化，stateChange 函数

  因为在appState中只有部分数据改变，数据未发生变化的不应该再次调用监听的数据处理函数，因此我们呢需要判断数据是否受到改变，因为 `...` 运算符会将对象解开经行浅复制。

   

  ```javascript
  function stateChange(state,action){
      switch (action.type){
          case 'UPDATA_TITLE_TEXT':
              return {
                  ...state,
                  title:{
                      ...state.title,
                      text:action.text
                  }
              }
          case 'UPDATA_TITLE_COLOR':
              return {
                  ...state,
                  title:{
                      ...state.title,
                      color:action.color,
                  }
              }
      }
  }
  
  ```

  在store中需要替换state，渲染函数经行数据前后对比

   

  ```js
  //性能优化后的render函数均发生变化，引入新旧数据对比 ，相同则不会渲染
  
  function appRender(newSate,oldState = {}){
      if(newSate ===oldState) return;
      titleRender(newSate.title,oldState.title);
      contentRender(newSate.content,oldState.content);
  }
  function titleRender(newState,oldState={}) {
      if(newState===oldState) return ;
      const title = document.getElementById('title');
      title.innerText = state.text;
      title.style.color= state.color;
  }
  function contentRender(newState,oldState={}) {
      if(newState===oldState) return ;
      const content = document.getElementById('content');
      content.innerText = state.text;
      content.style.color= state.color;
  }
  
  ```

  对应的createState函数同样需要修改,因为每次修改的 state 需要更改。

   

  ```javascript
  
  function createStore(state,stateChange){
      const getState = ()=>{return state};
      const linsners = [];
      const subscribe = (linsner)=>{linsners.push(linsner)};
      const dispatch = (action)=>{
          state=stateChange(state,action);
          linsners.forEach((linsner)=>{linsner()});
      }
      return {getState,dispatch,subscribe}
  }
  
  ```

  对应的store的调用方式也会发生变化，因为render函数参数多了一个 oldState 。因此需要获取两个前后的数据状态。

   

  ```javascript
  //获取store 执行
  const store = createStore(appState,stateChange);
  let oldState = store.getState();
  store.subscribe(()=>{
      let newState =store.getState();
      appRender(newState,oldState);
      oldState = newState;
  })
  
  ```

  

