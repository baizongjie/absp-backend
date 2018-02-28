const express = require('express');
const router = express.Router();
const log = require('../logger').getLogger('absProject');
const enrollApi = require('../fabric/api/enroll');
const processApi = require('../fabric/api/process');

router.post('/startProcess', (req, res, next) => {
  log.debug(req.body);
  processApi.startProcess(req.body, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true, processId: result }));
    }
  });
});

router.get('/queryProcessDetail', (req, res, next) => {
  const processId = req.query.pid;
  console.log(req.query.pid);
  processApi.queryProcessById(processId, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.get('/queryProcessLogs', (req, res, next) => {
  const processId = req.query.pid;
  processApi.queryProcessLogs(processId, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.post('/transferProcess', (req, res, next) => {
  log.debug(req.body);
  processApi.transferProcess(req.body, err => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true }));
    }
  });
});

router.post('/cancelProcess', (req, res, next) => {
  log.debug(req.body);
  processApi.cancelProcess(req.body.processId, err => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true }));
    }
  });
});

router.get('/queryTodoList', (req, res, next) => {
  processApi.queryTodoList((err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.get('/queryDoneList', (req, res, next) => {
  processApi.queryDoneList((err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

module.exports = router;
