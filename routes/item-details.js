var express = require('express');
var router = express.Router();

var product = require('../model/product');

router.get('/:id', function (req, res, nex) {
    id = req.params.id;
    product.findById(id, function (err, item) {
        if (err) {
            console.log("error");
        }
        else {
            imagePath = "";
            if (item.type == "perfume") {
                imagePath = "../assets/images/perfume/" + item.imageName;
            }
            else if (item.type == "watch") {
                imagePath = "../assets/images/watch/" + item.imageName;
            }
            else if (item.type == "dress") {
                imagePath = "../assets/images/dresses/" + item.imageName;
            }
            res.render('item-details.html', { item: item, imagePath: imagePath });
        }
    })

});

router.post('/order', function (req, res, next) {
    var type = req.body["type"];

    if (req.body["userName"]) {

    }

    db.orderDetails.insert({
        userName: req.body["userName"],
        mobile: req.body["mobile"],
        email: req.body["email"],
        address: req.body["address"],
        post_code: req.body["post-code"],
        itemsId: [{
            id: req.body["id"]
        }]
    });
    //res.redirect("/items/" + type);
});




module.exports = router;