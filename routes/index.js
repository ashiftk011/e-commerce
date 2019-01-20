var express = require('express');
var router = express.Router();

router.get('/', function (req, res, nex) {
    res.render('mainpage.html');
});

router.post('/post', function (req, res, nex) {
   console.log(req.params,req.param)
});

module.exports = router;

