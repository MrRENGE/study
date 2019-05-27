
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

<div>
        <div id = 'title'></div>
        <div id = 'content'></div>
</div>
appRender();



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

// 数据状态和数据操作打包起来 做成一个store

function createStore(state,stateChange){
    const getState = ()=>{state}
    const dispatch = (action)=>{stateChange(state,action)}
    return {getState,dispatch};
}

// 引入观察者模式的createStore

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




// 性能优化，使得重复渲染的部分排掉，部分数据没有改变的就不需要重新render渲染了 

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
        default:return state;
    }
}

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

//获取store 执行
const store = createStore(appState,stateChange);
let oldState = store.getState();
store.subscribe(()=>{
    let newState =store.getState();
    appRender(newState,oldState);
    oldState = newState;
})




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






// 将store 同context结合起来融入react中使用
import React,{Component} from 'react';
import PropTypes from 'prop-types'

class Them extends Component{
    static contextTypes = {
        store:PropTypes.object,
    }
    constructor(props){
        super(props);
        this.state = {
            themColor:'',
        }
    }
    _updateThemColor(){
        let store = this.context.store;
        console.log(store.getState())
        this.setState({
            themColor:store.getState().themColor,
        })
    }
    componentDidMount(){
        const {store } = this.context;
        this._updateThemColor();
        store.sbuscribe(()=>this._updateThemColor());
    }

    handleChangeThemColor(color){
        let store = this.context.store;
        store.dispatch({type:"CHANGE_COLOR",themColor:color});
    }
    render(){
        return (
            <div >
                <button  onClick={this.handleChangeThemColor.bind(this,'black')} style = {{color:this.state.themColor}}>blue</button>
                <button style = {{color:this.state.themColor}}>red</button>
            </div>
        )
    }
}
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

export default Index;

// 现在进行dumb component 高阶组件函数的封装


// 抽离数据获取函数，抽离组件中耦合代码
// 因为每个组件都需要 获取context然后获取store在使用store中的状态更改自己的状态，因此这段代码其实是重复的抽离一个connect出来
const Connect = (mapStateToProps,WrappedComponent)=>{
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

const mapStateToProps = (state)=>{
    return {
        themColor:state.themColor,
    }
}

// 完善后的connect
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

//使用实列
Header = connect(mapStateToProps)(Header);

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


