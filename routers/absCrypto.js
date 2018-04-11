const express = require('express');
const router = express.Router();
const log = require('../logger').getLogger('chainBlock');
const crypto = require('../fabric/api/crypto');

router.post('/crpyto/rsa/encrypt', (req, res, next) => {
  log.debug(req.body);
  crypto.rsaEncrypt(req.body, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(JSON.stringify({ success: true, stateID: result }));
    }
  });
});

router.get('/crpyto/rsa/decrypt', (req, res, next) => {
  const stateID = req.query.pid;
  console.log(req.query.pid);
  crypto.rsaDecrypt(stateID, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ success: false, error: err }));
    } else {
      res.end(result);
    }
  });
});

module.exports = router;
