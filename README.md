# ABS平台后端

## 介绍
基于Node.Js开发，使用Express作为服务框架

## 调试

前置要求：需要部署Fabric区块链，并启动对应chaincode节点

```bash
$ npm install
$ node index.js   
```

## 启动

```bash
$ npm install
$ npm start     # 使用pm2运行
```

## 配置

区块链相关配置信息在`./fabric/config`目录下