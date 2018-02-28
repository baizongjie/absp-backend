const express = require('express');
const router = express.Router();
const log = require('../logger').getLogger('absProject');
const enrollApi = require('../fabric/api/enroll');
const projectApi = require('../fabric/api/project');
const workflowApi = require('../fabric/api/workflow');
const processApi = require('../fabric/api/process');

enrollApi.enroll();

router.post('/createAbsProject', (req, res, next) => {
  log.debug(req.body);
  // projectApi.createProject(req.body, (err, result) => {
  projectApi.createProjectJson(projectApi.getEnrollInfo(), req.body, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true, projectId: result }));
    }
  });
});

router.post('/removeAbsProject', (req, res, next) => {
  const { projectId } = req.body;
  if (!projectId) {
    res.end(JSON.stringify({ success: false, error: 'no projectId' }));
  } else {
    projectApi.removeProject(projectId, err => {
      if (err) {
        res.end(JSON.stringify({ success: false, error: err }));
      } else {
        res.end(JSON.stringify({ success: true }));
      }
    });
  }
});

router.post('/modifyAbsProject', (req, res, next) => {
  log.debug(req.body);
  projectApi.modifyProjectInfo(req.body, err => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true }));
    }
  });
});

router.get('/queryAbsProjectList', (req, res, next) => {
  projectApi.queryAllProjects((err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.get('/queryAbsProjectDetail', (req, res, next) => {
  const projectId = req.query.pid;
  console.log(req.query.pid);
  projectApi.queryProjectById(projectId, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

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

router.post('/queryProcessLogs', (req, res, next) => {
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

router.get('/hello', (req, res, next) => {
  res.end(JSON.stringify({ success: 'hello world' }));
});

module.exports = router;
