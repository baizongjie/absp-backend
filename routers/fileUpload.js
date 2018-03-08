const express = require('express');
const log = require('../logger').getLogger('absProject');
const router = express.Router();
// 文件系统
var fs = require('fs');
// 上传模块
var multer = require('multer');
// 实例化上传模块(前端使用参数名为file)
var upload = multer({ dest: './uploads/' }).single('file');


router.get('/download', (req, res, next) => {
  res.end(JSON.stringify({
    'states': 'success',
    'fileUrl': 'hello'
  }));
})
// 单文件上传
router.post("/upload", upload, function (req, res, next) {
  //  请求路径
  var obj = req.file;
  console.log('obj====', obj);
  var tmp_path = obj.path;
  var new_path = "public/images";
  console.log("原路径：" + tmp_path);

  /*修改上传文件地址*/
  upload(req, res, function (err) {
    if (err) {
      console.log('上传失败');
    } else {
      console.log('上传成功');
    }
  });

  // 反馈上传信息
  res.end(JSON.stringify({
    'states': 'success',
    'fileUrl': tmp_path
  }));
});
log.info('加载上传接口逻辑');
module.exports = router;