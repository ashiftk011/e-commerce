var express = require('express');
var router = express.Router();
var customerDetails = require("../model/customerDetails");
var product = require("../model/product");

router.get("/:id", function (req, res, next) {
    var id = [req.params.id];
    product.findById(id[0], function (err, item) {
        if (err) {
            console.log("error");
        }
        else {
            var totalAmount;
            if (item.isOnSale = "Y") {
                totalAmount = item.offerPrice
            }
            else {
                totalAmount = item.prize
            }
            date = new Date();
            res.render("checkout.html", {
                id: [id],
                items: [item],
                total: totalAmount,
                count: 1,
                date: date
            });
        }
    });


});

router.post("/", function (req, res, next) {
    console.log(req.body);
    new customerDetails(req.body).save();

    res.render("checkout.html", {
        id: null,
        items: null,
        total: 0,
        count: 0
    });
});

module.exports = router;