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

* 初始化仓库中的文件都是未被跟踪的。 使用	` gti add 筛选规则` 跟踪文件，并把文件的修改提交到暂存区。
* 移除已跟踪文件使用命令，`git rm 文件名`  从仓库跟踪中移除并删除文件。如需要保存该文件需要加上 `--cached`  ` git rm --cached node_modules `
* 提交暂存区使用 `gti commit -m "描述。。。"` ，繁琐的绕过 `git add `  可以使用 `git commit -a -m 'description'`   
* 使用 `git push ` 将暂存区的代码推到仓库以后，又回到了初始化状态。
* 注：使用 ` git status ` 查看当前的仓库中的状态。
<<<<<<< HEAD
* 使用 ` git log` 可以查看push的日志记录。

### 远程仓库

从远程仓库拉取建立的本地仓库情况下，远程仓库默认名字是 origin，默认把本地的master分支指向 远程origin/master 分支。因此可以使用命令`git pull `直接更新同步服务器master分支代码。

* 查看当前仓库关联的远程仓库，使用命令。`git remote -v`
* 查看详细的远程仓库信息（包括所有远程分支同本地分支之间的关系）`git remote show 远程仓库名（克隆默认是 origin）` 注意：这儿的远程仓库名可以使用 `git remote -v` 查看。
* 远程仓库的重命名：` git remote rename 原名称 新名称`
* 远程仓库的删除：`git remote rm 远程仓库名字`

### 分支

这是git的精华，也是常用的部分。git分支本质上是一个指向commit对象的指针，每次commit 提交暂存区文件时会生成一个commit对象，该对象会保存前一个commit的引用依次可以形成很多链（因为不同分支上可以提交不同的更新，因此会形成分叉，有分叉就会有合并后面后继续介绍）。而分支则是指向commit对象的一个指针，再做分支切换时，引入HEAD来指向当前分支。

	* 新建分支`git branch name` 
	* 查看分支列表：`git branch` 
	* 切换分支：`git checkout name` 
	* 
=======
* testing
>>>>>>> dev

