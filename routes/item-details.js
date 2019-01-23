var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

var db = mongojs('D2D', ["item"]);

router.get('/:id', function (req, res, nex) {
    db.item.find({}, function (err, item) {
        if (err) {
            console.log("error");
        }
        else {
            var data = item.find(id => id._id == req.params.id);
            imagePath = "";
            if (data.type == "perfume") {
                imagePath = "../assets/images/perfume/" + data.imageName;
            }
            else if (data.type == "watch") {
                imagePath = "../assets/images/watch/" + data.imageName;
            }
            else if (data.type == "dress") {
                imagePath = "../assets/images/dresses/" + data.imageName;
            }
            res.render('item-details.html', { title: data.title, type: data.type, imageName: data.imageName, prize: data.prize, description: data.description });
        }
    })

});

router.post('/', function (req, res) {
    alert(req.body());
});

module.exports = router;