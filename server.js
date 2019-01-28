var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var session = require("express-session");
var url = require('url');



//Router Path
var index = require('./routes/index');
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
app.use('/', index);
app.use('/details', itemDetails);
app.use('/items', itemList);
app.use('/admin',admin);

const sessionLifeTime = 1000 * 60 * 60;
//session initialisation
app.use(session({
    name: 'sid',
    secret: 'keyboard cat',
    cookie: {
        maxAge: sessionLifeTime,
        sameSite: true,
    }
}))

app.listen(port, function () {

});
