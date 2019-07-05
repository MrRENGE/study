# http 学习

​	http 是基于tcp/ip 来封装的一个无状态协议（引入cookie，session 等状态管理的原因），主要作用于 web浏览器和 web 服务器之间的通信。协议的作用层 在计算机网络中是作用于传输层（相见计算机网络基础知识）

### HTTP 缓存 

​	缓存 机制将部分通用文件缓存到代理服务器或者 客户端，提升网站响应的速度。有助于优化性能，提升用户体验。

### cookie

​	使用场景：会话管理（用户登录状态、购物车、游戏分数等状态信息）、个性化设置（比如背景色，字体大小）、用户行为跟踪。

​	带来的问题，每次request 都会携带cookie信息反而增加开销，新的API优化使用local storage 等新的技术直接保存在本地。

创建cookie：服务器在响应头部使用字段 `set-cookie`  设置 cookie ，可设置cookie的使用域（domain 和				  path）。通过 Expires 和Max-Age 来设置cookie的生存时间。secure 属性来规定是 https 协议。httpOnly防止客户端获取cookie（这样防止了跨站脚本攻击，因为document.cookie 可以获取到本地的cookie ，容易被伪造敏感信息欺骗服务器）