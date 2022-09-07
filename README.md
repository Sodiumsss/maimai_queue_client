## 功能

**玩家**

- 登录、注册（弱安全）、登出

- 排卡、取消排卡

- 下机
- 聊天

**管理员**（继承玩家）

- 强制下机
- 清空队列

**超级管理员**（继承管理员）

- 添加管理员、取消管理员

## 部署
1. 随便你用什么方式拉到本地。
2. 打开cmd，输入**node**，如果有Welcome to Node.js vxx.xx.x。则进行下一步，如果没有[Node.js 安装配置 | 菜鸟教程 (runoob.com)](https://www.runoob.com/nodejs/nodejs-install-setup.html)。
3. 进入到你解压文件所在的目录,使用cmd,输入**npm install**，若超时或有其它问题，请百度解决。
4. 修改src/components/global.vue中的ip、port，更改为服务端的ip以及设置在服务端application.properties中的server.port。


### build 方式
1. 打开cmd,输入**npm run build**。
2. 输入**serve dist -p 80**。
3. 第四步的80为端口，建议不要改。如果第2步无效，输入**npm install serve**。
4. 至此，你应该可以打开http://localhost/了。

### develop 方式

1. 打开cmd,输入**npm run serve**
2. 至此，你应该可以打开http://localhost/了。
- 端口可以在**vue.config.js**中更改。



PS:有啥不懂的或者想吐槽的尽管说......
