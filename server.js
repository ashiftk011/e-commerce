var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var url = require('url');

//Router Path
var index = require('./routes/index');
var itemDetails = require('./routes/item-details');
var api=require('./routes/api');
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
app.use('/details', itemDetails);
app.use('/api', api);
app.use('/assets', express.static('assets'))

app.listen(port, function () {

});
