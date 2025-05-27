const db = require('./db');

// Fetch current user's cart with items
const getCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    let cart = await db.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
    if (cart.rows.length === 0) {
      await db.query('INSERT INTO cart(user_id) VALUES ($1)', [userId]);
      cart = await db.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
    }
    const cartId = cart.rows[0].cart_id;
    const items = await db.query(`
      SELECT ci.cart_item_id, ci.quantity, p.product_id, p.name, p.price, p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.product_id
      WHERE ci.cart_id = $1
    `, [cartId]);
    res.json({ cartId, items: items.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;
  try {
    let cart = await db.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
    if (cart.rows.length === 0) {
      await db.query('INSERT INTO cart(user_id) VALUES ($1)', [userId]);
      cart = await db.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
    }
    const cartId = cart.rows[0].cart_id;
    // Check if item already exists
    const existing = await db.query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId]
    );
    if (existing.rows.length > 0) {
      // Update quantity
      await db.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3',
        [quantity, cartId, productId]
      );
    } else {
      // Insert new item
      await db.query(
        'INSERT INTO cart_items(cart_id, product_id, quantity) VALUES ($1, $2, $3)',
        [cartId, productId, quantity]
      );
    }
    res.json({ message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const userId = req.user.userId;
  const { itemId } = req.params;
  try {
    let cart = await db.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
    if (cart.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const cartId = cart.rows[0].cart_id;
    await db.query(
      'DELETE FROM cart_items WHERE cart_id = $1 AND cart_item_id = $2',
      [cartId, itemId]
    );
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  const userId = req.user.userId;
  const { itemId } = req.params;
  const { quantity } = req.body;
  try {
    let cart = await db.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
    if (cart.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const cartId = cart.rows[0].cart_id;
    await db.query(
      'UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND cart_item_id = $3',
      [quantity, cartId, itemId]
    );
    res.json({ message: 'Cart item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating cart item' });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    let cart = await db.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
    if (cart.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const cartId = cart.rows[0].cart_id;
    await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
};
