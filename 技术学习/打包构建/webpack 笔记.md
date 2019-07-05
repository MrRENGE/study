# webpack 笔记

​	前端使用 webpack 来打包压缩，处理代码。详情 webpack 官网， [webpack](https://webpack.js.org/) .

##  webpack.config.js 

​	这个文件用来做 webpack 打包配置，

```javascript
module.exports={
	entry: { 自定义名字："此处是入口文件地址" },//入口文件，主要属性path
    
	output:{ path ：path.join(__dirname,"dist"),
           	 filename: "[name].js" //此时 filename 自动与 entry 中的属性名同名使用
           },//此处是打包生成的目的问价地址通常设置为dist
	plugins:[], //插件配置项，通常需要在webpack.config.js文件的前部使用require 关键字导入 然后使用 new 关键字创建插件
    
	devServer:{},
    
	module:{},
}

```





