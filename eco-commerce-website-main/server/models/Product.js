const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String,
  price: { type: Number, required: true },
  tags: [String],
  isEcoFriendly: Boolean,
});
module.exports = mongoose.model('Product', ProductSchema);