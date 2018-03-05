const express = require('express');
const router = express.Router();
const log = require('../logger').getLogger('absProject');
const enrollApi = require('../fabric/api/enroll');
const projectApi = require('../fabric/api/project');

router.post('/createAbsProject', (req, res, next) => {
  log.debug(req.body);
  projectApi.createProject(req.body, (err, result) => {
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

module.exports = router;
