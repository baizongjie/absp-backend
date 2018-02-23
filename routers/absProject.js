const express = require('express');
const router = express.Router();
const log = require('../logger').getLogger('absProject');
const absFabricApi = require('../fabric/api/abs');

absFabricApi.enroll();

router.post('/createAbsProject', (req, res, next) => {
  log.debug(req.body);
  // absFabricApi.createProject(req.body, (err, result) => {
  absFabricApi.createProjectJson(req.body, (err, result) => {
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
    absFabricApi.removeProject(projectId, err => {
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
  absFabricApi.modifyProjectInfo(req.body, err => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true }));
    }
  });
});

router.get('/queryAbsProjectList', (req, res, next) => {
  absFabricApi.queryAllProjects((err, result) => {
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
  absFabricApi.queryProjectById(projectId, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.post('/createLinearWorkflow', (req, res, next) => {
  log.debug(req.body);
  absFabricApi.createLinearWorkflow(req.body, (err, result) => {
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
  absFabricApi.queryWorkflowById(workflowId, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.get('/queryWorkflowList', (req, res, next) => {
  absFabricApi.queryAllWorkflows((err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.post('/modifyWorkflow', (req, res, next) => {
  log.debug(req.body);
  absFabricApi.modifyWorkflowInfo(req.body, err => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true }));
    }
  });
});

router.post('/enableOrDisableWorkflow', (req, res, next) => {
  log.debug(req.body);
  absFabricApi.enableOrDisableWorkflow(req.body, err => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true }));
    }
  });
});

router.post('/startProcess', (req, res, next) => {
  log.debug(req.body);
  absFabricApi.startProcess(req.body, (err, result) => {
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
  absFabricApi.queryProcessById(processId, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.post('/queryProcessLogs', (req, res, next) => {
  const processId = req.query.pid;
  absFabricApi.queryProcessLogs(processId, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.post('/transferProcess', (req, res, next) => {
  log.debug(req.body);
  absFabricApi.transferProcess(req.body, err => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true }));
    }
  });
});

router.post('/cancelProcess', (req, res, next) => {
  log.debug(req.body);
  absFabricApi.cancelProcess(req.body.processId, err => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true }));
    }
  });
});

router.get('/queryTodoList', (req, res, next) => {
  absFabricApi.queryTodoList((err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

router.get('/queryDoneList', (req, res, next) => {
  absFabricApi.queryDoneList((err, result) => {
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
