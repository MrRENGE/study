# koa 学习 log

### cookies 中存储中文的相关注意事项

​	在正常情况下cookies的操作很简单使用 ctx.cookies.set()/.get(),来操作cookies。koa设计不支持中文的存储。通常使用 Buffer 来借助 base64 进行中间转换。

* 第一步 ： let data = new Buffer("中文data",).toString("base64");
* 将 data 存入cookie 使用ctx.cookies.set(key,value,{options object}) Api 
* 取 cookie 数据使用ctx.cookies.get(key) Api 
* let cookieData =ctx.cookies.get(key) ;此时得到的是一个base64 的字符串，我们需要将其转码。
* let data = new Buffer(cookieData,'base64').toString(); 得到中文数据

