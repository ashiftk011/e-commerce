var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var url = require('url');

//Router Path
var index = require('./routes/index');
var perfume = require('./routes/perfume');
var watch = require('./routes/watch');
var itemDetails = require('./routes/item-details')
//set port
var port = 3000;

var app = express();

//view 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//body parser MW

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//api url handling
app.use('/', index);
app.use('/perfume', perfume);
app.use('/watch', watch);
app.use('/details', itemDetails);
app.use('/assets', express.static('assets'))

app.listen(port, function () {

});
