### Manfiest 缓存

HTML5 引入离线存储机制，使用Manifest 文件来定义缓存的目标文件、定义不缓存集合。在HTML文件中通过在<html> 标签上引用manifest文件的方式来引用配置文件。

```html
<html lang="en" manifest="index.manifest">
```

#### Manifest 文件

Manifest 文件需要定义三个部分，CACHE、NETWORK 、FALLBACK三个部分，后面两个为可选项。

例如：

​	

```javascript
CACHE MANIFEST
#version 1.3

CACHE:
    test.css

NETWORK:
	*
```

Manifet 中开头为 CACHE MANIFEST ，文件中注释采用#开头。CACHE 项为缓存的目标文件，指定文件的相对路径或者绝对路径。NETWORK 项为不缓存的集合，`*` 表示为其他的全部资源文件。FALLBACK 项中配置替换的路径。



### 缓存更新

* 可以通过更新改动manifest文件中的配置项，
* 通过客户端代码`window.applicationCache.update()` 函数更新缓存，
* 通过浏览器清除缓存

### 注意事项

* manifest 文件需要与引用它的HTML文件同域
* 浏览器对缓存存在大小限制，因此需要一个缓存驱逐算法（HTTP缓存中介绍）
* manifest 文件中的任何一个文件缓存失败都会整体失败