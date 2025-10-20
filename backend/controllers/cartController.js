const Cart = require('../models/Cart');

// Get cart for a user
async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ userId: String(req.params.userId) });
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Save cart for a user
async function saveCart(req, res) {
  try {
    const { userId, items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId: String(userId) },
      { items, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// (Optional) In-memory helpers for tests
function addItem(cart, item) {
  cart.push(item);
}

function removeItem(cart, itemId) {
  const index = cart.findIndex(i => i.id === itemId);
  if (index !== -1) cart.splice(index, 1);
}

module.exports = {
  getCart,
  saveCart,
  addItem,
  removeItem,
};
