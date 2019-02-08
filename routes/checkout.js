var express = require('express');
var router = express.Router();
var product = require("../model/product");

router.get("/:id", function (req, res, next) {
    var id = [req.params.id];
    var jsonObject = {};
    var key = 'checkoutItems';
    jsonObject[key] = [];
    product.findById(id[0], function (err, item) {
        if (err) {
            console.log("error");
        }
        else {
            var prize = 0;
            if (item.isOnSale == "Y") {
                prize = item.offerPrice;
            }
            else {
                prize = item.prize;
            }

            var data = {
                title: item.title,
                brand: item.brand,
                prize: prize,
                count: parseInt(req.query.count),
                totalprize: parseInt(req.query.count) * prize
            };
            jsonObject[key].push(data);
            checKoutItmeDetails[items] = [];
            jsonObject.checkoutItems.forEach((item) => {
                var itemSet = {
                    id: item.id,
                    count: item.count
                }
                checKoutItmeDetails[items].push(itemSet)
            });
            date = new Date();
            count = req.query.count;
            res.render("checkout.html", {
                id: [id],
                items: jsonObject,
                total: prize,
                count: count,
                date: date
            });
        }
    });
});



module.exports = router;