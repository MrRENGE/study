## Git 入门



### 初始化配置

​	初始化配置包括，进行项目初始化`.git`文件以及初始化`git`环境。

* 初始化配置信息，`config`

  ​	`config` 配置信息，分为全局配置和局部配置。全局配置时需要加上 `--global`

  	* ` git config --list`  用户查看所有配置信息，注意查看全局配置信息需加上`--global`  `gti config --global --list` 
  	* 修改配置信息，`git config --global 配置项 对应值`  对应格式配置。例如：` git config --global user.name 'MrRen'`
  	* :注其他信息修改格式按照格式进行修改。

* 初始化配置仓库

  * 本地使用命令配置。使用命令`git init` 则把当前文件夹初始化成git本地仓库生成文件`.git` 里面是所有的git配置文件。默认所有的文件都是未跟踪的，需要使用 `git add 匹配规则` 去指定跟踪文件，也可配置忽略文件，一般项目都会有`.gitignore` 文件。
  * 从远程git服务器（码云，GitHub，gitlab，自配置服务器）拉取。使用命令 `git clone url nickname`  nickname 可有可无，一般不需要。从服务器拉取的仓库默认是全部跟踪所有文件。

### 三个不同的保存区

仓库中的文件会被git文件系统进行跟踪，仓库中的文件有三个不同的状态区。

* 初始化仓库中的文件都是未被跟踪的。 使用	` gti add 筛选规则` 跟踪文件。
* 提交到暂存区使用 `gti commit -m "描述。。。"` 
* 使用 `git push ` 将暂存区的代码推到仓库以后，又回到了初始化状态。
* 注：使用 ` git status ` 查看当前的仓库中的状态。
* testing

