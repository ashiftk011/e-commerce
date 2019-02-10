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
    fltrDisplayType = req.body.displayType;
    fltrMaterial = req.body.material;
    if (!fltrBrands && !fltrDisplayType && !fltrMaterial) {
        product.find({ "type": selectedItemType }, function (err, allItems, next) {
            if (err) {
                res.send(err);
            }
            else {
                itemsList = allItems;
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
        var allFltrItems = [];
        var allDisplFltr = [];
        var allMaterialFltr = [];
        if (fltrBrands) {
            allFltrItems = [];
            for (var i = 0; i < fltrBrands.length; i++) {
                fltritem = itemsList.filter((fltr) => fltr.brand == fltrBrands[i]);
                fltritem.forEach(item => {
                    allFltrItems.push(item);
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

        }
        if (fltrDisplayType) {
            items = [];
            var fltrDispitem = [];
            for (var i = 0; i < fltrDisplayType.length; i++) {
                if (allFltrItems && allFltrItems.length != 0) {
                    fltrDispitem = allFltrItems.filter((fltr) => fltr.display == fltrDisplayType[i]);
                }
                else
                    fltrDispitem = itemsList.filter((fltr) => fltr.display == fltrDisplayType[i]);

                fltrDispitem.forEach(item => {
                    allDisplFltr.push(item);
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
        }
        if (fltrMaterial) {
            items = [];
            var fltrMaterialitem = [];
            for (var i = 0; i < fltrMaterial.length; i++) {
                if (allDisplFltr && allDisplFltr.length != 0) {
                    fltrMaterialitem = allDisplFltr.filter((fltr) => fltr.material == fltrMaterial[i]);
                }
                else if (allFltrItems && allFltrItems.length != 0) {
                    fltrMaterialitem = allFltrItems.filter((fltr) => fltr.material == fltrMaterial[i]);
                }
                else
                    fltrMaterialitem = itemsList.filter((fltr) => fltr.material == fltrMaterial[i]);

                fltrMaterialitem.forEach(item => {
                    allMaterialFltr.push(item);
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