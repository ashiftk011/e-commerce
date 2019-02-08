var mongoos = require('mongoose');
var Schema = mongoos.Schema;

var CustomerDetails = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: Number, required: true },
  address: { type: Array },
  total: { type: Number, require: true },
  orderDate: { type: Date, require: true },
  items: [{
    id: { type: String, require: true },
    count: { type: Number, require: true }
  }],
  zip: { type: Number },
  isDeliverd: { type: String, require: true }
});

module.exports = mongoos.model('customerDetails', CustomerDetails)