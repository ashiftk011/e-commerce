var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var session = require("express-session");
var url = require('url');
var cookieParser = require('cookie-parser');

var mongojs = require('mongojs');
var db = mongojs('D2D', ["item"]);


//Router Path
var itemDetails = require('./routes/item-details');
var itemList = require('./routes/itemList');
var admin = require('./routes/admin');

var app = express();
//set port
var port = 3000;

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
//app.use('/', index);
app.use('/details', itemDetails);
app.use('/items', itemList);
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
    res.render('mainpage.html');
});

//add cart to session
app.post('/addtocart', function (req, res, next) {
    var id = req.body["item-id"];
    if (!req.session.items) {
        req.session.items = [];
    }
    req.session.items.push(id);

    res.redirect("/details/" + id);
});

//cart

app.get("/cart", function (req, res, next) {
    var cartItemsList = [];
    var data = [];
    if (req.session.items) {
        cartItemsList = req.session.items;
        db.item.find({}, function (err, item) {
            if (err) {
                console.log("error");
            }
            else {

                cartItemsList.forEach(element => {
                    var imagePath = '';
                    var itemDetails = item.find(id => id._id == element)
                    if (itemDetails.type == "perfume") {
                        imagePath = "../assets/images/perfume/";
                    }
                    else if (itemDetails.type == "watch") {
                        imagePath = "../assets/images/watch/";
                    }
                    else if (itemDetails.type == "dress") {
                        imagePath = "../assets/images/dresses/";
                    }
                    itemDetails.imagePath = imagePath + itemDetails.imageName;
                    data.push(itemDetails);
                });
                res.render('cart.html', { data });
            }
        })
    }
})

app.listen(port, function () {

});
