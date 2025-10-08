const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// Create sample product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get with pagination, filtering, sorting
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 5, category, sort = "createdAt" } = req.query;

    // Filter
    let query = {};
    if (category) query.category = category;

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
