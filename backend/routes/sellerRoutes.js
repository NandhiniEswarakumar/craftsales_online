const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Get seller's products
router.get('/products/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const sellerProducts = await Product.find({ sellerId }).sort({ createdAt: -1 });
    res.json(sellerProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get seller dashboard stats
router.get('/dashboard/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const sellerProducts = await Product.find({ sellerId });
    const stats = {
      totalProducts: sellerProducts.length,
      activeProducts: sellerProducts.filter(p => p.isActive !== false).length,
      outOfStock: sellerProducts.filter(p => p.stock === 0).length,
      lowStock: sellerProducts.filter(p => p.stock > 0 && p.stock <= 5).length
    };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new product
router.post('/products', async (req, res) => {
  try {
    const { title, description, price, image, category, stock, sellerId, sellerName } = req.body;
    if (!title || !description || price === undefined || !category || stock === undefined || !sellerId || !sellerName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const product = await Product.create({
      title,
      description,
      price: parseFloat(price),
      image: image || 'https://via.placeholder.com/300x200?text=No+Image',
      category,
      stock: parseInt(stock),
      sellerId,
      sellerName,
      isActive: true
    });
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

// Update a product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body || {};
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (update.sellerId && String(product.sellerId) !== String(update.sellerId)) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    if (update.price !== undefined) update.price = parseFloat(update.price);
    if (update.stock !== undefined) update.stock = parseInt(update.stock);
    const updated = await Product.findByIdAndUpdate(id, update, { new: true });
    return res.json({ message: 'Product updated successfully', product: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sellerId } = req.body || {};
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (sellerId && String(product.sellerId) !== String(sellerId)) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    await Product.findByIdAndDelete(id);
    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;