### HTTP缓存

借助HTTP缓存可以减少延迟与网络阻塞，从而减少加载显示资源的时间。提高站点的响应速度。缓存根据类型大致分为私有缓存和共享缓存、浏览器缓存代理缓存、网关缓存、CDN 、反向代理缓存、负载均衡缓存等。通常私有缓存指的是浏览器缓存、共享缓存需要借助web代理（通常建在本地）。

### 缓存作用的目标

然而常见的 HTTP 缓存只能存储 [`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET) 响应，对于其他类型的响应则无能为力。缓存的关键主要包括request method和目标URI（一般只有GET请求才会被缓存）。 普遍的缓存案例:

- 一个检索请求的成功响应: 对于 [`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET)请求，响应状态码为：[`200`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/200)，则表示为成功。一个包含例如HTML文档，图片，或者文件的响应。
- 永久重定向: 响应状态码：[`301`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/301)。
- 错误响应: 响应状态码：[`404`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/404) 的一个页面。
- 不完全的响应: 响应状态码 [`206`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/206)，只返回局部的信息。
- 除了 [`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET) 请求外，如果匹配到作为一个已被定义的cache键名的响应。

### HTTP中缓存控制的字段

通过对request head 请求头字段 Cache-control 字段的设定来实现对缓存设置，包括no-store (禁止使用缓存)、no-cache （强制使用缓存）、public，private （私有和公共缓存）max-age（缓存过期时间）、must-revalidate(必须经过验证)

 

```javascript

// 禁止使用缓存
Cache-Control: no-store

//强制确认缓存，每次请求会将缓存验证字段携带到服务器进行验证是否过期，未过期则返回 304进行定向到缓存中的资源，
Cache-Control: no-cache

// public 允许中间代理进行缓存，private则不允许中间代理缓存
Cache-Control: public
Cache-Control: private

//设置缓存过期时间，单位是s（秒）
Cache-Control: max-agg = 60



```

### 缓存驱逐

当缓存目标资源被缓存以后实际上是可以永久存储的，通常缓存会被限制大小因此需要将老版本的缓存清理掉。需要引进缓存驱逐算法，约定时间将老版本替换成新缓存保证缓存新鲜度。