#  Ajax 轮询技术与 WebSocket （包含Http长连接和短链接）



## Ajax 技术

 重要的对象XMLHttpRequest 对象，步骤如下：

* 实例化 XMLHttpRequest 对象` const xml = new XMLHttpRequest()`

* 监听状态改变，绑定回调函数获取数据`xml.onreadystatechangge = { id(this.readystate= ?){...}}`

  注：

  ​	

  ```javascript
  存有 XMLHttpRequest 的状态。从 0 到 4 发生变化。
  0: 请求未初始化
  1: 服务器连接已建立
  2: 请求已接收
  3: 请求处理中
  4: 请求已完成，且响应已就绪
  
  ```

  

* 打开 实例化对象 ` xml.open(method,url,async)` 

* 发送请求` xml.send(string)` 

## Ajax  轮询

很多网站为了实现推送技术，所用的技术都是 Ajax 轮询。轮询是在特定的的时间间隔（如每1秒），由浏览器对服务器发出HTTP请求，然后由服务器返回最新的数据给客户端的浏览器。这种传统的模式带来很明显的缺点，即浏览器需要不断的向服务器发出请求，然而HTTP请求可能包含较长的头部，其中真正有效的数据可能只是很小的一部分，显然这样会浪费很多的带宽等资源。

![1557973252651](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1557973252651.png)



## WebSocket

WebSocket 是 HTML5 开始提供的一种在单个 **TCP 连接上进行全双工通讯的协议**。

WebSocket 使得客户端和服务器之间的数据交换变得更加简单，**允许服务端主动向客户端推送数据**。在 WebSocket API 中，**浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输**。在 WebSocket API 中，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。

WebSocket 节省服务器资源和带宽，并且能实现实时通信。

![1557973538896](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1557973538896.png)

连接过程：

 * 客户端实例化 webSocket 对象 ` const socket = new WebSocket(url,[protocol])`

   客户端向服务端发起一次HTTP 请求，特殊请求包含特殊字段` upgrade:WebSocket `  服务器端解析这些附加的头信息然后产生应答信息返回给客户端，客户端和服务器端的 WebSocket 连接就建立起来了，双方就可以通过这个连接通道自由的传递信息，并且这个连接会持续存在直到客户端或者服务器端的某一方主动的关闭连接。

 * 通过`socket.send(string)` 发送信息，

 * 通过监听 ` socket.onmessage = (event)=>{event.data}` 接受数据。

 * 通信完毕后双方都可以通过` socket.close()` 关闭连接

**web socket中的事件**：

![1557975131034](C:\Users\MrRen\AppData\Roaming\Typora\typora-user-images\1557975131034.png)



## 　http 长连接和短连接

​	HTTP1.1协议开始，支持根据请求头信息发起长连接请求。 请求头信息中包含字段`‘Keep-Alive: true`，实现Tcp 连接的复用。避免三次握手以及连接初期窗口限制发送数据大小带来的开销和性能问题。

​	短连接，每次通信完毕就释放连接。通常是，服务器端发送响应结束后就断开连接。

