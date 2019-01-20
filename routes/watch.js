var express = require('express');
var router = express.Router();

router.get("/", function (req, res) {
    var data = '{"type": "watch" ,"data": [' +
        '{ "title":"moscone" , "imageName":"moscone.jpg" ,"prize":"665" },' +
        '{ "title":"fossil" , "imageName":"fossil.jpg" ,"prize":"885"},' +
        '{ "title":"tissot" , "imageName":"tissot.jpg" ,"prize":"985"} ]}';

    var obj = JSON.parse(data);
    res.json(obj);
});

module.exports = router;