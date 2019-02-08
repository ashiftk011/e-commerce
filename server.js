var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var session = require("express-session");
var cookieParser = require('cookie-parser');
var mongoose = require("mongoose");
var customerDetails = require("./model/customerDetails");


var product = require('./model/product');

//Router Path
var itemDetails = require('./routes/item-details');
var itemList = require('./routes/itemList');
var checkout = require('./routes/checkout');
var admin = require('./routes/admin');

var app = express();
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/D2D", { useNewUrlParser: true });

//set port
var port = 3000;

global.cartItemsCount = 0;

global.checKoutItmeDetails = {};
global.items = 'Items';

//view 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//body parser MW
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// static
app.use('/assets', express.static('assets'));
app.use('/utils', express.static('utils'));

//api url handling
app.use('/details', itemDetails);
app.use('/items', itemList);
app.use('/checkout', checkout);
app.use('/admin', admin);

const sessionLifeTime = 1000 * 60 * 60;
app.use(cookieParser());
//session initialisation
app.use(session({
    name: 'sid',
    secret: 'cart',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: sessionLifeTime,
        sameSite: true,
    }
}))

//initial get function
app.get('/', function (req, res, nex) {
    if (!req.session.items)
        cartItemsCount = 0;
    res.render('mainpage.html');
});

//add cart to session
app.post('/addtocart/:id', function (req, res, next) {
    if (!req.session.items) {
        req.session.items = [];
    }
    req.session.items = req.session.items.filter(itemId => itemId != id)
    req.session.items.push(id);
    cartItemsCount = req.session.items.length;
    res.redirect("/details/" + id);
});

app.get('/addtocart/:type/:id', function (req, res, next) {
    var id = req.params['id'];
    var type = req.params['type'];
    if (!req.session.items) {
        req.session.items = [];
    }
    req.session.items = req.session.items.filter(itemId => itemId != id)
    req.session.items.push(id);
    cartItemsCount = req.session.items.length;
    res.redirect("/items/" + type);
});

//cart

app.get("/cart", function (req, res, next) {
    var cartItemsList = [];
    var sessionItems = [];
    var jsonObject = {};
    var key = 'checkoutItems';
    jsonObject[key] = [];
    if (req.session.items) {
        cartItemsList = req.session.items;
        var itemSetcount = 0;
        var totalAmount = 0;
        cartItemsList.forEach(element => {
            product.findById(element, function (error, itemDetails) {
                if (error) {
                    console.log("error");
                }
                else {
                    var prize = 0;
                    sessionItems.push(itemDetails);
                    itemSetcount++;
                    if (itemDetails.isOnSale == "Y") {
                        totalAmount = totalAmount + itemDetails.offerPrice;
                        prize = itemDetails.offerPrice;
                    }
                    else {
                        totalAmount = totalAmount + itemDetails.prize;
                        prize = itemDetails.prize;
                    }

                    var data = {
                        id: itemDetails._id,
                        title: itemDetails.title,
                        brand: itemDetails.brand,
                        prize: prize,
                        count: 1,
                        totalprize: 1 * prize
                    };
                    jsonObject[key].push(data);

                    if (req.session.items.length == itemSetcount)
                        res.render('cart.html', { data: sessionItems, totalAmount: totalAmount, jsonResult: jsonObject });

                }
            });
        });
    }
    if (!req.session.items || req.session.items.length == 0) {
        res.render('cart.html', { data: cartItemsList, totalAmount: totalAmount });
    }
});

app.get("/checkouts/addCart/:id", function (req, res, next) {
    var id = req.params['id'];
    var type = req.params['type'];
    if (!req.session.items) {
        req.session.items = [];
    }
    req.session.items = req.session.items.filter(itemId => itemId != id)
    req.session.items.push(id);
    cartItemsCount = req.session.items.length;
    res.redirect("/cart");
})

app.get("/cart/remove/:id", function (req, res, next) {
    if (req.session && req.session.items) {
        req.session.items = req.session.items.filter(item => item != req.params.id);
        cartItemsCount = req.session.items.length;
    }
    res.redirect('/cart');
})

app.post("/checkouts", function (req, res, next) {
    var id;
    if (req.session.items) {
        id = req.session.items;
        var count = req.session.items.length;
        var totalItemCount = 0
        var i = 0;
        var jsonObject = {};
        var key = 'checkoutItems';
        jsonObject[key] = [];
        id.forEach((itemID) => {
            product.findById(itemID, function (err, product) {
                if (err) {
                    console.log(err);
                }
                else {
                    var prize = 0;
                    if (product.isOnSale == "Y") {
                        prize = product.offerPrice;
                    }
                    else {
                        prize = product.prize;
                    }
                    var data = {
                        id: product._id,
                        title: product.title,
                        brand: product.brand,
                        prize: prize,
                        count: parseInt(req.body.jsonResult[i]),
                        totalprize: parseInt(req.body.jsonResult[i]) * prize
                    };
                    jsonObject[key].push(data);
                    i++;
                    count--;
                    date = new Date();
                    if (count == 0) {
                        checKoutItmeDetails[items] = [];
                        jsonObject.checkoutItems.forEach((item) => {
                            var itemSet = {
                                id: item.id,
                                count: item.count
                            };
                            totalItemCount+=item.count;
                            checKoutItmeDetails[items].push(itemSet);
                        });
                        res.render("checkout.html", {
                            id: id,
                            items: jsonObject,
                            total: req.body.hdGrandTotal,
                            count: totalItemCount,
                            date: date
                        });
                    }
                }
            });
        })
    }
})


app.post("/purchase", function (req, res, next) {
    var newCutomer = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobile: req.body.mobile,
        address: req.body.address,
        total: req.body.zip,
        orderDate: req.body.orderDate,
        items: checKoutItmeDetails.Items,
        zip: req.body.zip,
        isDeliverd: "N"
    };
    new customerDetails(newCutomer).save();
    req.session.items = [];
    cartItemsCount = 0
    res.render("sucess-page.html");
});

app.listen(port, function () {

});
