const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
