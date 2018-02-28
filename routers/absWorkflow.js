const express = require('express');
const router = express.Router();
const log = require('../logger').getLogger('absProject');
const enrollApi = require('../fabric/api/enroll');
const workflowApi = require('../fabric/api/workflow');

router.post('/createLinearWorkflow', (req, res, next) => {
  log.debug(req.body);
  workflowApi.createLinearWorkflow(req.body, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true, workflowId: result }));
    }
  });
});

router.get('/queryWorkflowDetail', (req, res, next) => {
  const workflowId = req.query.pid;
  console.log(req.query.pid);
  workflowApi.queryWorkflowById(workflowId, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.get('/queryWorkflowList', (req, res, next) => {
  workflowApi.queryAllWorkflows((err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.post('/modifyWorkflow', (req, res, next) => {
  log.debug(req.body);
  workflowApi.modifyWorkflowInfo(req.body, err => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true }));
    }
  });
});

router.post('/enableOrDisableWorkflow', (req, res, next) => {
  log.debug(req.body);
  workflowApi.enableOrDisableWorkflow(req.body, err => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true }));
    }
  });
});

module.exports = router;
