const express = require('express');
const router = express.Router();
const log = require('../logger').getLogger('chainBlock');
const chainBlockApi = require('../fabric/api/block');

router.post('/chainblock/org/reload', (req, res, next) => {
  log.debug('start reload orgs and public keys');
  chainBlockApi.reloadOrgAndPublicKeyList((err) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true }));
    }
  });
});

router.get('/chainblock/org/list', (req, res, next) => {
  chainBlockApi.getOrgAndPublicKeyList((result) => {
    res.end(JSON.stringify(result));
  });
});

module.exports = router;
