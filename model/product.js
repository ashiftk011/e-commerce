var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    productCode: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    imageName: { type: String, required: true },
    prize: { type: Number, required: true },
    gender: { type: String, required: true },
    isOnSale: { type: String },
    isInStock: { type: String },
    discount: { type: Number },
    offerPrice: { type: Number },
    material: { type: String },
    display: { type: String },
    size: { type: String },
    category: { type: String },
    quantity: { type: String },
    imageTag: { type: String },
    date: { type: Date }
});
module.exports = mongoose.model("Product", ProductSchema);

