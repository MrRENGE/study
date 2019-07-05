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

* 在优化以下，将 state 和 stateChange 合并到一起

   

  ```javascript
  // 将state和 stateChange 合并到一起
  function stateChange(state,action){
      //state 不存在就去初始化一个state
      if(!state){
          state = {
              title:{
                  text:"react 小书标题",
                  color:"green",
              },
              content:{
                  text:"react 小书内容",
                  color:'red',
              }
          }
      }
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
          default:return state;
      }
  }
  
  // 因为将state和stateChange 合并到一块了，所以需要变动createStore ，参数变为一个 了
  
  function createStore(stateChange){
      let state = null;
      const getState = ()=>{return state};
      const linsners = [];
      const subscribe = (linsner)=>{linsners.push(linsner)};
      const dispatch = (action)=>{ 
          state = stateChange(state,action);
          linsners.forEach((linsner)=>{linsner()});
      }
      state = dispatch({});//初始化state
      return {getState,subscribe,dispatch};
  }
  
  ```

  到目前，我们封装到一个高可用的 createState 函数。	到这儿，将state和stateChange合并起来，生成一个纯函数 reducer，哈哈！手写 redux 已经完成。


###　将 Redux 和 react 结合起来

#### 将store 生成放在context中，具体步骤为。

* 获取context
* 从context中取出 store
* 获取store中的state 【使用getState函数】
* 改变组件自己的状态

 父组件核心代码：

​	

```javascript
// 定义一个createStore函数
function createStore(reducer){
    let  state = null;
    const listeners = [];
    const sbuscribe = (linsener)=>{listeners.push(linsener)};
    const getState = ()=> state ;
    const dispatch = (action)=>{
        state = reducer(state,action);
        listeners.forEach((listener)=>{listener()});
    }
    dispatch({});
    return {getState,dispatch,sbuscribe};
}

// 定义一个reducer 函数
function themReducer(state,action){
    if(!state){
        state = {
            themColor:'red',
        }
    }
    switch(action.type){
        case 'CHANGE_COLOR':
            return {
                ...state,
                    themColor:action.color
                }
            
        default: return state;
        }
}
// 实例化一个store
const store = createStore(themReducer);

class Index extends Component{
    static childContextTypes = {
        store : PropTypes.object
    }
    constructor(props){
        super(props);
        this.state = {
            themColor:'',
        }
    }
    getChildContext(){
        return {store };
    }
    componentDidMount(){
        this.setState({themColor:'red'})
    }
    render(){
        return (
            <div>
                <Header/>
                <Main/>
            </div>
        )
    }
}

```

子组件引用：

 

```javascript
class Header extends Component{
    static contextTypes = {
        store:PropTypes.object,
    }
    constructor(props){
        super(props);
        this.state={
            themColor:'',
        }
    }
    _updateThemColor(){
        let state = this.context.store;
        this.setState({
            themColor:state.getState().themColor,
        })
    }
    componentDidMount(){
        const {store } = this.context;
        this._updateThemColor();
        store.sbuscribe(()=>this._updateThemColor());
    }

    render(){
        return (
            <div>
                <h2 style = {{color:this.state.themColor}}>this is  header</h2>
                <Title/>
            </div>
        )
    }
}

```

### 抽离子组件中耦合代码段，封装 connect 函数

上面代码存在的性能问题，1. 子组件代码冗余，都是获取context 然后再获取store，最后从store中获取状态修改自身状态。2.每个组件对context依赖太强。

抽离从context=》store=》state 过程，作为一个connect函数。需要解决的问题，1.每个组件需要的数据结构存在差异，2.封装的connect函数应该是一个pure component，只能根据参数返回对应的组件。（相当于对组件进行优化，化妆）。dumb component （呆瓜组件，只干本质工作，其他的事情一律不管）。

封装的connect函数：

 

```javascript
const connect = (mapStateToProps)=>{
    return (WrappedComponent)=>{
            class Connect extends Component{
                static contextTypes = {
                    store:PropTypes.object,
                }
                render(){
                    const {store} = this.context;
                    let propState = mapStateToProps(store.getState());
                    <WrappedComponent {...propState}/>
                }
            }
            return Connect;
    }
}


class Header extends Component{
    render(){
        <div>...根据 props 获取数据</div>
    }
}
//Header 组件需要的数据结构
const mapStateToProps = (state)=>{
    return {
        themColor:state.themColor,
    }
}

//调用
Header = connect(mapStateToProps)(Header);
```

此时的子组件需要使用props获取数据来进行渲染。



接着完善，将数据改变动态渲染的监听函数绑定到connect上实现。在componentWillMount 中绑定更新函数，然后将数据动态传给子组件更新。

 

```javascript
//完善后的connect函数
const connect = (mapStateToProps)=>{
    return (WrappedComponent)=>{
            class Connect extends Component{
                static contextTypes = {
                    store:PropTypes.object,
                }
                constructor(){
                    super();
                    this.state = {
                        allProps = {},
                    }
                }
                componentWillMount(){
                    let {store} = this.context;
                   this._updateProps();
                   store.sbuscribe(()=>{this._updateProps()});
                }
                _updateProps(){
                    const {store} = this.context;
                    let stateProps = mapStateToProps(store.getState(),this.props);
                    this.setState({
                        allProps:{
                            ...stateProps,
                            ...this.props,
                        }
                    })
                }
                render(){
                    const {store} = this.context;
                    let propState = mapStateToProps(store.getState());
                    <WrappedComponent {...this.state.allProps}/>
                }
            }
            return Connect;
    }
}
```



### 优化dispatch 解构，从此子组件优化完成

 此时仍然存在问题，不能使用dispatch更改store中的数据（其实搞这么就就是为了把store中数据和函数解放出来，因为子组件（dumb component）只是用到数据和修改数据的函数，注意createStore中的三大将军 getSate,dispatch,subscribe；数据被解构在connect组件中通过props传递到对应的dumb 组件中，而subscribe 是监听数据变化后进行的操作就是更新 connect 的 `this.state` 从而更新对应dumb组件的props。剩下的就需要完成dispatch的解构，思路和state结构是一样的。

  

```javascript

// 存在问题，dispatch 在子组件中不能正常修改store数据状态
//继续优化

const connect = (mapStateToProps,mapDispatchToProps)=>{
    return (WrappedComponent)=>{
        class Connect extends Component{
            static contextType ={
                store:PropTypes.object,
            }

            constructor(){
                super();
                this.state = {
                    allProps:{},
                }
            }

            componentWillMount(){
                const {store} = this.context;
                this._updateProps();
                store.subscribe(()=>{this._updateProps()});
            }

            _updateProps(){
                const {store} = this.context;
                let stateProps = mapStateToProps? mapStateToProps(store.getState()) : {};
                let dispatchProps = mapDispatchToProps ? mapDispatchToProps(store.dispatch) : {};
                this.setState({
                    ...stateProps,
                    ...dispatchProps,
                    ...this.props
                })
            }

            render(){
                <WrappedComponent {...this.state.allProps}/>
            }
        }
        return Connect;
    }
}

// dispatch 使用案例
const mapDispatchToProps = (dispatch) => {
    return {
      onSwitchColor: (color) => {
        dispatch({ type: 'CHANGE_COLOR', themeColor: color })
      }
    }
}

const Header = connect(mapDispatchToProps,mapStateToProps);

//在Header dumb component 组件中使用 dispatch
handleChangeThemColor(color){
    if(this.props.onSwitchColor){
        this.props.onSwitchColor(color);
    }
}

```

### 优化跟组件index中对context的依赖，提取Provider 容器组件

哈哈！到这儿我很开心了，将index中store放入context部分移植到一个新的容器组件（Provider）中。index成为它的子组件。

 

```javascript

class Provider extends Component{
    //限定子组件传值类型，store为对象类型，children为任意类型
    static PropTypes = {
        store:PropTypes.object,
        children:PropTypes.any,
    }
    //
    static childContextTypes = {
        store:PropTypes.object,
    }
    //获取context时执行函数
    getChildContext(){
        return {store:this.props.store}
    }

    render(){
        <div>{this.props.children}</div>
    }
}

//此时index 中引入 Provider 将store作为参数传递给 Provider ,把index 作为Provider的子组件

```

实现 redux 主要实现两个部分，Provider 容器和connect 函数。