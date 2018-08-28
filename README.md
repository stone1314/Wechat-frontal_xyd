/**
 * Created by abrahamchen on 2018/5/30.
 */

1.简介
  Wechat-frontal，给客户使用的出借端。

2.运行环境
  微信浏览器

3.开发
  项目基于 antd+dva
  样式采用less，增加css module
  进入项目目录，执行下面命令
  npm install
  npm run start

4.程序结构
```
Wechat-frontal/
  README.md
  node_modules/
  package.json
  build/           //生成的部署文件夹
  public/          //直接拷贝文件夹
    index.html
    favicon.ico
  src/
    asserts/        //图片相关资源
    commonStyle/    //统一样式常量
    components/     //通用组件
    constants/      //数据常量
    models/         //数据层及逻辑
    routes/         //页面View层
    services/       //网络请求服务层
    utils/          //底层二次封装fetch库，以及其他工具函数
    registerServiceWorker.js      //注册pwa
    tranFade.less         路由过度样式

  
```

4.调试
chrome或者微信开发者工具

5.部署
  