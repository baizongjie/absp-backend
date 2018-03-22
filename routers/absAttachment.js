const express = require('express');
const router = express.Router();
const log = require('../logger').getLogger('absAttachment');
const enrollApi = require('../fabric/api/enroll');
const attachmentApi = require('../fabric/api/attachment');

router.post('/attachmentUpload', (req, res, next) => {
  log.debug(req.body);
  attachmentApi.attachmentUpload(req.body, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true, attachmentId: result }));
    }
  });
});

router.get('/queryAttachmentList', (req, res, next) => {
  attachmentApi.queryAttachmentList((err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.post('/queryAttachmentListByIdList', (req, res, next) => {
  //console.log('jjjjjjjjjjjjj'+JSON.stringify(req.body));
  const {payload} = req.body;
  const attachmentIdList = JSON.parse(payload);
  //console.log('kkkkkkkkkkkkkkk'+JSON.stringify(attachmentIdList));
  attachmentApi.queryAttachmentListByIdList(attachmentIdList,(err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});


module.exports = router;
