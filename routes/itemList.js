var express = require('express');
var router = express.Router();
var product = require('../model/product');
var lookupValue = require('../model/lookupValue');

var itemsList;
//Sleected Filter item set
var fltrBrands;
var fltrMaterial;
var fltrDisplayType;
var fltrCategory;
var fltrSize;
var fltrItemType;

// filter Type List
var brands;
var material;
var displayType;
var category;
var size;
var itemType;

router.get("/:type", function (req, res, next) {
    fltrBrands = [];
    fltrMaterial = [];
    fltrDisplayType = [];
    fltrCategory = [];
    fltrSize = [];
    fltrItemType = [];
    try {
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

router.get("/items/brand", function (req, res, next) {
    var items = [];
    var data={}
    // var key = 'items';
    // items[key]=[];
    if (!fltrBrands.find((br) => br == req.query.brand)) {
        fltrBrands=[];
        fltrBrands.push(req.query.brand);
        for (var i = 0; i < fltrBrands.length; i++) {
            var fltritem = itemsList.filter((fltr) => fltr.brand == fltrBrands[i]);
             data = {
                type: fltritem[0].type,
                _id: fltritem[0]._id,
                imageName: fltritem[0].imageName,
                imageTag: fltritem[0].imageTag,
                discount: fltritem[0].discount,
                offerPrice: fltritem[0].offerPrice,
                prize: fltritem[0].prize,
                title:fltritem[0].title
            }
            console.log("###########################..........................."+data.imageName)
            items.push(data);
        }
        //console.log(items);
    }
    
    res.json(items)
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


var ItemsFilterState = {
    brand: { type: Array },
    material: { type: Array },
    size: { type: Array },
    displayType: { type: Array },
    catogery: { Type: Array }
}

module.exports = router;