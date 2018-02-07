const express = require('express');
const router = express.Router();
const log = require('../logger').getLogger('absProject');

router.post('/createAbsProject', (req, res, next) => {
    log.debug(req.body);
    res.end(JSON.stringify({success: true}));
});

router.get('/hello', (req, res, next) => {
    res.end(JSON.stringify({success: 'hello world'}));
});

module.exports = router;