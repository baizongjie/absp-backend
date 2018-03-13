const express = require('express');
const router = express.Router();
const log = require('../logger').getLogger('absProject');
const enrollApi = require('../fabric/api/enroll');
const workflowApi = require('../fabric/api/workflow');

router.post('/workflow/linear/create', (req, res, next) => {
  log.debug(req.body);
  workflowApi.createLinearWorkflow(req.body, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true, workflowId: result }));
    }
  });
});

router.get('/workflow/detail', (req, res, next) => {
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

router.get('/workflow/all/list', (req, res, next) => {
  workflowApi.queryAllWorkflows((err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.get('/workflow/access/list', (req, res, next) => {
  workflowApi.queryAccessableWorkflows((err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.post('/workflow/modify', (req, res, next) => {
  log.debug(req.body);
  workflowApi.modifyWorkflowInfo(req.body, err => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true }));
    }
  });
});

router.post('/workflow/enabled', (req, res, next) => {
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
