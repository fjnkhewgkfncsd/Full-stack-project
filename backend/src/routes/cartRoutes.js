import express from 'express';
import  authenticateToken  from '../middleware/authMiddleware.js';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  insertFromLocalStorageToDb,
  updateCartItemSize
} from '../controller/cart.js';

const router = express.Router();
// Add to cart
router.post('/add', authenticateToken, addToCart);
// Get cart
router.get('/', authenticateToken, getCart);
// Remove from cart
router.delete('/remove/:itemId', authenticateToken, removeFromCart);
// Update cart item quantity
router.put('/update/:itemID',authenticateToken, updateCartItem);
// Clear cart
router.delete('/clear', authenticateToken, clearCart);

router.post('/insert', authenticateToken, insertFromLocalStorageToDb);

router.put('/update/size/:itemID',authenticateToken, updateCartItemSize);

export default router;



