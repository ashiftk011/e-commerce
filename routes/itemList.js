var express = require('express');
var router = express.Router();
var product = require('../model/product');
var lookupValue = require('../model/lookupValue');

router.get("/:type", function (req, res, next) {
    var itemType = req.params.type;
    var itemFilterContents;
    lookupValue.find({}, function (err, lookupValue) {
        itemFilterContents = lookupValue;

        product.find({ "type": req.params.type }, function (err, items, next) {
            if (err) {
                res.send(err);
            }
            else {
                var brands = null;
                var material = null;
                var displayType = null
                if (itemFilterContents)
                    brands = itemFilterContents.find(fltr => fltr.category == itemType && fltr.type == "brand").values
                if (itemType == "perfume") {
                    imagePath = "../assets/images/perfume/";
                }
                else if (itemType == "watch") {
                    imagePath = "../assets/images/watch/";
                    material = itemFilterContents.find(fltr => fltr.category == "watch" && fltr.type == "material").values
                    displayType = itemFilterContents.find(fltr => fltr.category == "watch" && fltr.type == "display").values
                }
                else if (itemType == "dress") {
                    imagePath = "../assets/images/dresses/";
                    material = itemFilterContents.find(fltr => fltr.category == "dresses" && fltr.type == "material").values
                }
                res.render('items-list.html', {
                    data: items,
                    brands: brands,
                    materials: material,
                    displayTypes:displayType
                });
            }
        });
    });
})


module.exports = router;