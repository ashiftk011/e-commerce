var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

var db = mongojs('D2D', ["item"]);

router.get('/login', function(req,res,next){
    res.render('login.html',{error :null, username : "", password : ""});
});

router.post('/verifylogin', function(req,res,next){
    if('admin' == req.body.username && 'test1234' == req.body.password)
        res.render('dashboard.html');
    else{
        var errorCode = null;
        if('admin' != req.body.username)
            errorCode = "Invalid User Name";
        else
            errorCode = "Invalid Password";

        res.render('login.html',{username : req.body.username,
            password : req.body.password,
            error    : errorCode
        });
    }
        
});

module.exports = router;