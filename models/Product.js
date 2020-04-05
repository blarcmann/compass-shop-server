const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
  category: String,
  image: String,
  title: String,
  description: String,
  price: Number,
})

module.exports = mongoose.model('Product', productSchema);