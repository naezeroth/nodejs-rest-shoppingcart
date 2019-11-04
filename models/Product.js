const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    type: String,
    color: String,
    size: String,
    stock: Number
}, { versionKey: false });

module.exports = mongoose.model('Product', ProductSchema);