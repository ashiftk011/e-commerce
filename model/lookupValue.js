var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LookupSchema = new Schema({
    category: { type: String, required: true },
    type: { type: String, required: true },
    values: { type: Array, required: true }
});
module.exports = mongoose.model("LookupValue", LookupSchema);