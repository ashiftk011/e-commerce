var express = require('express');
var router = express.Router();
var product = require('../model/product');

router.get("/:type", function (req, res, next) {
    var itemType = req.params.type;
    product.find({ "type": req.params.type }, function (err, items, next) {
        if (err) {
            res.send(err);
        }
        else {

            if (itemType == "perfume") {
                imagePath = "../assets/images/perfume/";
            }
            else if (itemType == "watch") {
                imagePath = "../assets/images/watch/";
            }
            else if (itemType == "dress") {
                imagePath = "../assets/images/dresses/";
            }
            res.render('items-list.html', {
                data: items
            });
        }
    });
})


module.exports = router;