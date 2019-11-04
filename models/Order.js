const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    id: String,
    itemId: String,
    quantity: Number    
}, { versionKey: false });

module.exports = mongoose.model('Order', OrderSchema);