var express = require('express');
var router = express.Router();

router.get("/", function (req, res) {
    var data = '{ "type":"perfume" ,"data": [' +
        '{ "title":"liamia" , "imageName":"liamia.jpg" ,"prize":"665" },' +
        '{ "title":"charlie" , "imageName":"charlie.jpg" ,"prize":"885"},' +
        '{ "title":"versace" , "imageName":"versace.jpg" ,"prize":"985"} ]}';
    var obj = JSON.parse(data);
    res.json(obj);
});

module.exports = router;