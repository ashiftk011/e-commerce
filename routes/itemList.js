var express = require('express');
var router = express.Router();
var product = require('../model/product');
var lookupValue = require('../model/lookupValue');

var itemsList;
var selectedItemType;
router.get("/:type", function (req, res, next) {
    try {
        var brands;
        var material;
        var displayType;
        var category;
        var size;
        var itemType;
        var itemFilterContents;
        lookupValue.find({}, function (err, lookupValue) {
            itemFilterContents = lookupValue;

            product.find({ "type": req.params.type }, function (err, items, next) {
                if (err) {
                    res.send(err);
                }
                else {
                    itemsList = items;
                    itemType = req.params.type;
                    selectedItemType = itemType
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
                        category = itemFilterContents.find(fltr => fltr.category == "dresses" && fltr.type == "category").values
                        size = itemFilterContents.find(fltr => fltr.category == "dresses" && fltr.type == "size").values
                    }
                    res.render('items-list.html', {
                        data: items,
                        brands: brands,
                        materials: material,
                        displayTypes: displayType,
                        category: category,
                        itemType: itemType,
                        size: size
                    });
                }
            });
        });
    } catch (error) {
        res.render("genericerror.html");
    }
});

router.post("/items/brand", function (req, res, next) {
    var items = [];

    var fltritem = [];
    fltrBrands = req.body.brand;
    if (fltrBrands.length == 0) {
        product.find({ "type": selectedItemType }, function (err, allItems, next) {
            if (err) {
                res.send(err);
            }
            else {
                allItems.forEach(item => {
                    var data = {};
                    data = {
                        type: item.type,
                        _id: item._id,
                        imageName: item.imageName,
                        imageTag: item.imageTag,
                        discount: item.discount,
                        offerPrice: item.offerPrice,
                        prize: item.prize,
                        title: item.title
                    }
                    items.push(data);
                });
                res.json(items)
            }
        });
    }
    else {
        for (var i = 0; i < fltrBrands.length; i++) {
            fltritem = itemsList.filter((fltr) => fltr.brand == fltrBrands[i]);
            fltritem.forEach(item => {
                var data = {};
                data = {
                    type: item.type,
                    _id: item._id,
                    imageName: item.imageName,
                    imageTag: item.imageTag,
                    discount: item.discount,
                    offerPrice: item.offerPrice,
                    prize: item.prize,
                    title: item.title
                }
                items.push(data);
            });
        }
        res.json(items)
    }
})

router.post("/category", function (req, res, next) {
    // console.log(req.body.brands.length);
    items = itemsList.filter((fltr) => fltr.category == req.body.cat);
    res.json('items-list.html', {
        data: items,
        brands: fltrBrands,
        materials: fltrMaterial,
        displayTypes: fltrDisplayType,
        category: fltrCategory,
        itemType: fltrItemType,
        size: fltrSize
    });
})

router.post("/size", function (req, res, next) {
    // console.log(req.body.brands.length);
    items = itemsList.filter((fltr) => fltr.size == req.body.size);
    console.log(items);
    res.render('items-list.html', {
        data: items,
        brands: fltrBrands,
        materials: fltrMaterial,
        displayTypes: fltrDisplayType,
        category: fltrCategory,
        itemType: fltrItemType,
        size: fltrSize,
    });
})


module.exports = router;