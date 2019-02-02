var express = require('express');
var multer = require('multer');
var moongoose = require('mongoose');
var product = require('../model/product');
var router = express.Router();
//var mongojs = require('mongojs');



var mongodb = moongoose.connection;
mongodb.once("open",function(){
    console.log(':: connected :::');
});
//var db = mongojs('D2D', ["item"]);

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
    if (isAuthenticated)
        res.render('admin/dashboard.html', { error: null, username: "", password: "" });
    else
        res.redirect('/admin/accessdenied');
});

router.get('/products', function (req, res, next) {
    
    if (isAuthenticated) {
        product.find(function (err, products) {
            console.log(products);
            console.log('------------------------');
            res.render('admin/products.html', { products: products });
        });
        
        // console.log(productsM);
        //console.log('------------------------');
        // db.item.find({}, function (err, products) {
        //     if (err) {
        //         console.log("error");
        //     }
        //     res.render('admin/products.html', { products: products });
        // });
    } else
        res.redirect('/admin/accessdenied');
});

router.get('/additem', function (req, res, next) {
    if (isAuthenticated){
        res.render('admin/additem.html', { status: null });
    }else
        res.redirect('/admin/accessdenied');
});

router.post('/additem', function (req, res, next) {
    console.log(':: To Upload Img :: ');
    upload(req, res, function (err) {
        if (err) {
            console.log(err.code);//LIMIT_UNEXPECTED_FILE - max limit Exceeded
            //res.render('admin/additem.html',{ status : LIMIT_UNEXPECTED_FILE });
            return res.redirect('/admin/error');
        }
        var newitem ={
            type: req.body.type,
            title: req.body.productName,
            productCode: req.body.productCode,
            brand: req.body.brand,
            description: req.body.description,
            imageName: req.body.productCode+'.'+req.files[0].originalname.split('.')[1],
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