const Cart = require('../models/Cart');

// Get cart for a user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save/update cart for a user
exports.saveCart = async (req, res) => {
  try {
    const { userId, items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};