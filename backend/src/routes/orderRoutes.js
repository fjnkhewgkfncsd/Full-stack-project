import express from 'express';
import  authenticateToken  from '../middleware/authMiddleware.js';
// import {
//   createOrder,
//   getOrders,
//   getOrderById,
//   updateOrderStatus
// } from '../controller/order.js';

const router = express.Router();
// Handles creating a new order.
// router.post('/', authenticateToken, createOrder);
// // Handles retrieving all orders for the authenticated user.
// router.get('/', authenticateToken, getOrders);
// // Handles retrieving a specific order by its ID.
// router.get('/:orderId', authenticateToken, getOrderById);
// // Handles updating the status of an order by its ID. Example statuses could be 'pending', 'shipped', 'delivered', etc.
// router.put('/:orderId/status', authenticateToken, updateOrderStatus);

export default router;
