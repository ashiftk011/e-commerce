var express = require('express');
var router = express.Router();

router.get('/', function (req, res, nex) {
    res.render('item-details.html');
});

router.post('/', function (req, res) {
    alert(req.body());
});

module.exports = router;