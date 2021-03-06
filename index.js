const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const log = require('./logger').getLogger('main');

const demo = require('./routers/demo');
const chainEnroll = require('./fabric/api/enroll');
const chainEvent = require('./fabric/api/event');
// const chainBlock = require('./fabric/api/block');
const crypto = require('./fabric/api/crypto');
const absPrj = require('./routers/absProject');
const absWorkflow = require('./routers/absWorkflow');
const absProcess = require('./routers/absProcess');
const fileUpload = require('./routers/fileUpload');
const absCrypto = require('./routers/absCrypto');
// const chainBlockRouter = require('./routers/chainBlock');

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  );
}

//打印请求日志
app.use((req, res, next) => {
  log.info(`[${getClientIp(req)}] ${req.method} ${req.url}`);
  next();
});

//解析JSON报文
app.use(bodyParser.json());

// 设置请求头
// application/json  接口返回json数据
// charset=utf-8 解决json数据中中文乱码
app.use('*', function (request, response, next) {
  response.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
  next();
});

//逻辑处理
app.get('/', (req, rsp) => {
  rsp.end('hello world!');
});
app.use('/', demo);
app.use('/api/v1/', absPrj);
app.use('/api/v1/', absWorkflow);
app.use('/api/v1/', absProcess);
app.use('/api/v1/', fileUpload);
app.use('/api/v1/', absCrypto);
// app.use('/api/v1/', chainBlockRouter);

//错误处理
app.use((err, req, res, next) => {
  log.error(err.stack);
  res.status(500).end(JSON.stringify({ error: err.stack }));
  next();
});

//处理404
app.use((req, res, next) => {
  log.error('404 error');
  res.status(404).end(JSON.stringify({ error: '404 错误!' }));
});

process.on('uncaughtException', err => {
  log.error(err);
})

app.listen(9010, function () {
  log.info('Express is listening to http://localhost:9010');
});

chainEnroll.enroll(() => {
  // 完成enroll后获取机构公钥信息清单并缓存
  // chainBlock.reloadOrgAndPublicKeyList();

  // enroll成功后，发送RSA公钥信息
  crypto.saveRsaPubKey();

  chainEvent.registerChaincodeEvent((event) => {
    // TODO
  });
});

