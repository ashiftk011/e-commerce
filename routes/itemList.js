var express = require('express');
var router = express.Router();
var product = require('../model/product');
var lookupValue = require('../model/lookupValue');

router.get("/:type", function (req, res, next) {
    try {
        var itemFilterContents;
        lookupValue.find({}, function (err, lookupValue) {
            itemFilterContents = lookupValue;

            product.find({ "type": req.params.type }, function (err, items, next) {
                if (err) {
                    res.send(err);
                }
                else {
                    var itemType = req.params.type;
                    var brands = null;
                    var material = null;
                    var displayType = null;
                        //brands = itemFilterContents.find(fltr => fltr.category == itemType && fltr.type == "brand").values
                    if (itemType == "perfumes") {
                        imagePath = "../assets/images/perfume/";
                    }
                    else if (itemType == "watch") {
                        imagePath = "../assets/images/watch/";
                        brands = itemFilterContents.find(fltr => fltr.category == itemType && fltr.type == "brand").values
                        material = itemFilterContents.find(fltr => fltr.category == "watch" && fltr.type == "material").values
                        displayType = itemFilterContents.find(fltr => fltr.category == "watch" && fltr.type == "display").values
                    }
                    else if (itemType == "dresses") {
                        imagePath = "../assets/images/dresses/";
                        brands = itemFilterContents.find(fltr => fltr.category == itemType && fltr.type == "brand").values
                        material = itemFilterContents.find(fltr => fltr.category == "dresses" && fltr.type == "material").values
                    }
                    res.render('items-list.html', {
                        data: items,
                        brands: brands,
                        materials: material,
                        displayTypes: displayType,
                        itemType: itemType
                    });
                }
            });
        });
    } catch (error) {
        res.render("genericerror.html");
    }
});

router.get("/filter/:Type/:filterType", function (req, res, next) {
    try {
        product.find({ "type": req.params.type }, function (err, items, next) {
            if (err) {
                console.log(err);
            }
            else {
                data = items.find(fltr => fltr.category == req.params.type && fltr.type == req.params.filterType);
                console.log(data);
            }
        })
    } catch (error) {
        res.render("genericerror.html");
    }
})

module.exports = router;