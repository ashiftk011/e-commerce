var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var session = require("express-session");
var cookieParser = require('cookie-parser');
var mongoose = require("mongoose");


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

global.cartItemsCount = 0

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
    if (req.session.items) {
        cartItemsList = req.session.items;
        var itemSetcount = 0;
        cartItemsList.forEach(element => {
            product.findById(element, function (error, itemDetails) {
                if (error) {
                    console.log("error");
                }
                else {
                    sessionItems.push(itemDetails);
                    itemSetcount++;
                    if (req.session.items.length == itemSetcount)
                        res.render('cart.html', { data: sessionItems });
                }
            });
        });
    }
    if (!req.session.items || req.session.items.length == 0) {
        res.render('cart.html', { data: cartItemsList });
    }
});

app.get("/cart/remove/:id", function (req, res, next) {
    req.session.items = req.session.items.filter(item => item != req.params.id);
    cartItemsCount = req.session.items.length;
    res.redirect('/cart');
})

app.get("/checkouts/cart", function (req, res, next) {
    var id;
    if (req.session.items) {
        id = req.session.items;
        var count = req.session.items.length;
        var totalAmount = 0;
        var products = [];
        id.forEach((itemID) => {
            product.findById(itemID, function (err, product) {
                if (err) {
                    console.log(err);
                }
                else {
                    if (product.isOnSale = "Y") {
                        totalAmount = totalAmount + product.offerPrice;
                        products.push(product);
                        count--;
                    }
                    else {
                        totalAmount = totalAmount + product.prize;
                        products.push(product);
                        count--;
                    }
                    date = new Date();
                    if (count == 0) {
                        res.render("checkout.html", {
                            id: id,
                            items: products,
                            total: totalAmount,
                            count: null,
                            date:date
                        });
                    }
                }
            });
        })
    }
})

app.listen(port, function () {

});
