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
    fltrSize = req.body.size;
    fltrCategory = req.body.category;
    if ((selectedItemType == "watch" && !fltrBrands && !fltrDisplayType && !fltrMaterial) ||
        (selectedItemType == "dresses" && !fltrBrands && !fltrDisplayType && !fltrMaterial && !fltrSize && !fltrCategory)) {
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
        var allSizeFltr = [];

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
        if (selectedItemType == "dresses") {
            if (fltrSize) {
                items = [];
                var fltrSizeitem = [];
                for (var i = 0; i < fltrSize.length; i++) {
                    if (allMaterialFltr && allMaterialFltr.length != 0) {
                        fltrSizeitem = allMaterialFltr.filter((fltr) => fltr.size == fltrSize[i]);
                    }
                    else if (allFltrItems && allFltrItems.length != 0) {
                        fltrSizeitem = allFltrItems.filter((fltr) => fltr.size == fltrSize[i]);
                    }
                    else
                        fltrSizeitem = itemsList.filter((fltr) => fltr.size == fltrSize[i]);

                    fltrSizeitem.forEach(item => {
                        allSizeFltr.push(item);
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
            if (fltrCategory) {
                items = [];
                var fltrCategoryitem = [];
                for (var i = 0; i < fltrCategory.length; i++) {
                    if (allSizeFltr && allSizeFltr.length != 0) {
                        fltrCategoryitem = allSizeFltr.filter((fltr) => fltr.category == fltrCategory[i]);
                    }
                    else if (allMaterialFltr && allMaterialFltr.length != 0) {
                        fltrCategoryitem = allMaterialFltr.filter((fltr) => fltr.category == fltrCategory[i]);
                    }
                    else if (allFltrItems && allFltrItems.length != 0) {
                        fltrCategoryitem = allFltrItems.filter((fltr) => fltr.category == fltrCategory[i]);
                    }
                    else
                        fltrCategoryitem = itemsList.filter((fltr) => fltr.category == fltrCategory[i]);

                    fltrCategoryitem.forEach(item => {
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
        }
        res.json(items)
    }
})

module.exports = router;