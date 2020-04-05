const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
  category: String,
  product_image: String,
  name: String,
  description: String,
  price: Number,
})

module.exports = mongoose.model('Product', productSchema);