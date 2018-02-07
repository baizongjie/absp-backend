const express = require('express');
const router = express.Router();

router.post('/createAbsProject', function (req, res, next) {
    console.log(req.body);
    res.end(JSON.stringify({success: true}));
});

router.get('/hello', function (req, res, next) {
    res.end(JSON.stringify({success: 'hello world'}));
});

module.exports = router;