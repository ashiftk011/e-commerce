
var express = require('express');
var mongojs = require('mongojs');

var router = express.Router();
//var db=mongojs('mongodb://sa:qazwsxedc@127.0.0.1:27017','D2D.collection');

var db = mongojs('D2D', ["item"]);

/*
 * ................Json Format in mongoDB...............
 {
        "_id" : ObjectId("5c44add048cf42a2a898206d"),
        "type" : "perfume",
        "title" : "liamia",
        "imageName" : "liamia.jpg",
        "prize" : "985",
        "description" : "description"
}
 */

 // todo: implement one router for same json response

router.get("/", function (req, res, next) {
    var obj
    db.item.find(function (err, items) {
        if (err) {
            res.send(err);
        }
        res.json(items);
    });
});

module.exports = router;