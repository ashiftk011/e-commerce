var express = require('express');
var multer = require('multer');
var moongoose = require('mongoose');
var customerDetails = require('../model/customerDetails');
var product = require('../model/product');
var lookupValue = require('../model/lookupValue');

var router = express.Router();

var mongodb = moongoose.connection;
mongodb.once("open", function () {
    console.log(':: connected :::');
});

router.get('/login', function (req, res, next) {
    res.render('admin/login.html', { error: null, username: "", password: "" });
});

var isAuthenticated = false;

router.get('/logout', function (req, res, next) {
    isAuthenticated = false;
    res.render('admin/login.html', { error: null, username: "", password: "" });
});

router.post('/login', function (req, res, next) {
    if ('admin' == req.body.username && 'test1234' == req.body.password) {
        isAuthenticated = true;
        res.redirect('/admin/dashboard');
    } else {
        var errorCode = null;
        if ('admin' != req.body.username)
            errorCode = "Invalid User Name";
        else
            errorCode = "Invalid Password";
        res.render('admin/login.html', {
            username: req.body.username,
            password: req.body.password,
            error: errorCode
        });
    }
});

router.get('/dashboard', function (req, res, next) {
    if (isAuthenticated) {
        customerDetails.find({}, function (err, orders) {
            res.render('admin/dashboard.html', { orders: orders });
        });
    }
    else
        res.redirect('/admin/accessdenied');
});

router.get('/orderdetails/:id',function(req, res, next) {
    console.log("object Id :"+req.params.id);
    var cartitems = [];
    customerDetails.findById(req.params.id,function (err, order){
        order.items.forEach(function(item){
            console.log('id : '+item.id);
            product.findById(item.id,function (err, doc){
                cartitems.push(doc);
                if(order.items.length == cartitems.length){
                    res.render('admin/orderdetails.html', { order: order , items : cartitems });
                }
            });
        });
        
    });
});

router.get('/products', function (req, res, next) {
    if (isAuthenticated) {
        product.find(function (err, products) {
            res.render('admin/products.html', { products: products });
        });
    } else
        res.redirect('/admin/accessdenied');
});

router.get('/additem', function (req, res, next) {
    if (isAuthenticated) {
        res.render('admin/additem.html', { status: null });
    } else
        res.redirect('/admin/accessdenied');
});

router.get('/filters/:type', function (req, res, next) {
    if (isAuthenticated) {
        console.log(req.params.type);
        lookupValue.find({ "category": req.params.type }, function (err, datas) {
            console.log(datas);
            res.render('admin/fragments/filters.html', { datas: datas });
        });
    } else
        res.redirect('/admin/accessdenied');
});

router.post('/additem', function (req, res, next) {

    upload(req, res, function (err) {
        if (err) {
            return res.redirect('/admin/error');
        }
        var newitem = {
            type: req.body.type,
            title: req.body.productName,
            productCode: req.body.productCode,
            brand: req.body.brand,
            description: req.body.description,
            imageName: req.body.productCode + '.' + req.files[0].originalname.split('.')[1],
            prize: req.body.price,
            gender: req.body.gender,
            isOnSale: req.body.isOnsale,
            isInStock: req.body.isInstock,
            discount: req.body.discount,
            offerPrice: req.body.offerprice,
            material: req.body.material,
            display: req.body.display,
            size: req.body.size,
            category: req.body.category,
            quantity: req.body.quantity,
            imageTag: req.body.imagetag,
            date: new Date()
        };
        var newProduct = new product(newitem);
        newProduct.save();
        return res.render('admin/additem.html', { status: 'success' });
    });
});

router.get('/edititem/:id', function (req, res, next) {
    if (isAuthenticated) {
        product.findById(req.params.id, function (err, itemDetail) {
            res.render('admin/editItem.html', { status: null, itemDetail: itemDetail });
        });
    }
    else
        res.redirect('/admin/accessdenied');
});

router.post('/edititem', function (req, res, next) {
    if (isAuthenticated) {
        // TODO : update item details, check if image is changed
        res.render('admin/editItem.html', { status: null, operationFlag: "U", itemDetail: null });
    }
    else
        res.redirect('/admin/accessdenied');
});

router.get('/addfilter', function (req, res, next) {
    if (isAuthenticated) {
        lookupValue.find({}, function (err, datas) {
            res.render('admin/addfilter.html', { status: null, datas: datas });
        });
    }
    else
        res.redirect('/admin/accessdenied');
});

router.post('/addfilter', function (req, res, next) {
    var isDataInserted = false;
    if (isAuthenticated) {
        var statusDescription = 'success';
        var found = false;
        lookupValue.find({ "category": req.body.category, "type": req.body.type }, function (err, items) {
            console.log(items);
            if (items.length > 0) {
                item = items[0];
                if (req.body.values[0].length > 1) {
                    for (var count = 0; count < req.body.values.length; count++) {
                        if (item.values.find(values => values == req.body.values[count].toUpperCase()) == 1) {
                            found = true;
                            statusDescription = 'Filter Already Exists';
                        }
                        else {
                            item.values.push(req.body.values[count].toUpperCase());
                        }
                    }
                } else {
                    if (item.values.find(values => values == req.body.values.toUpperCase()) == 1) {
                        found = true;
                        statusDescription = 'Filter Already Exists';
                    }
                    else {
                        item.values.push(req.body.values.toUpperCase());
                    }
                }
                if (found == false) {
                    console.log('update');
                    console.log(item);
                    item.save();
                    isDataInserted = true;
                }
            } else {
                var values = [];
                if (req.body.values[0].length > 1) {
                    for (var count = 0; count < req.body.values.length; count++) {
                        values.push(req.body.values[count].toUpperCase());
                    }
                } else {
                    values.push(req.body.values.toUpperCase());
                }
                var newLookupValue = {
                    category: req.body.category,
                    type: req.body.type,
                    values: values
                };
                console.log('save filterLookup :');
                console.log(newLookupValue);
                var filterLookup = new lookupValue(newLookupValue);
                filterLookup.save();
                isDataInserted = true;
            }
            if (isDataInserted == true)
                lookupValue.find({}, function (err, filterType) {
                    res.render('admin/addfilter.html', { status: statusDescription, datas: filterType });
                });
        });
    } else
        res.redirect('/admin/accessdenied');
});

router.get('/orders', function (req, res, next) {
    if (isAuthenticated)
        res.render('admin/orders.html');
    else
        res.redirect('/admin/accessdenied');

});

var uploadLocation = './assets/images/';
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadLocation + req.body.type);
    },
    filename: function (req, file, callback) {
        callback(null, req.body.productCode + '.' + file.originalname.split(".")[1]);
    }
});

var upload = multer({
    storage: Storage
}).array("images", 3);

router.get('/accessdenied', function (req, res, next) {
    res.render('errors/accessdenied.html');
});

router.get('/error', function (req, res, next) {
    res.render('errors/genericerror.html');
});

module.exports = router;