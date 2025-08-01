import express from 'express';
import { 
  processPayment, 
  verifyQRPayment,
} from '../controller/paymentController.js';
import { sendPaymentNotification } from '../utils/telegramNotifier.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Authentication Middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid or missing API key'
    });
  }
  next();
};

// Enhanced Validation Middlewares
const validatePayment = (req, res, next) => {
  const { amount, currency, paymentMethod, customerPhone } = req.body;
  const errors = [];
  
  // FIX: Add missing closing parenthesis to isNaN(amount)
  if (!amount || isNaN(amount)) {
    errors.push('Amount must be a valid number');
  } else if (amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!currency || !/^[A-Z]{3}$/.test(currency)) {
    errors.push('Currency must be a valid 3-letter ISO code');
  }
  
  const validMethods = ['card', 'khqr', 'aba', 'bakong'];
  if (!paymentMethod || !validMethods.includes(paymentMethod)) {
    errors.push(`Payment method must be one of: ${validMethods.join(', ')}`);
  }

  if (paymentMethod === 'bakong' && (!customerPhone || !/^\+?[0-9]{10,15}$/.test(customerPhone))) {
    errors.push('Valid phone number required for Bakong payments');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors 
    });
  }
  
  next();
};

const validateQRVerification = (req, res, next) => {
  const { transactionId, requiredAmount, method } = req.body;
  const errors = [];
  
  if (!transactionId || typeof transactionId !== 'string') {
    errors.push('Transaction ID must be a string');
  } else if (transactionId.length < 8) {
    errors.push('Transaction ID must be at least 8 characters');
  }
  
  if (!requiredAmount || isNaN(requiredAmount)) {
    errors.push('Required amount must be a valid number');
  } else if (requiredAmount <= 0) {
    errors.push('Required amount must be greater than 0');
  }

  const validMethods = ['khqr', 'bakong'];
  if (method && !validMethods.includes(method)) {
    errors.push(`Method must be one of: ${validMethods.join(', ')}`);
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors 
    });
  }
  
  next();
};

// Rate Limiting
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests',
    message: 'Please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Payment Routes
router.post(
  '/',
  authenticate,
  paymentLimiter,
  validatePayment,
  processPayment
);

router.post(
  '/verify-qr',
  authenticate,
  paymentLimiter,
  validateQRVerification,
  verifyQRPayment
);

// Bakong Payment Endpoint
router.post(
  '/bakong',
  authenticate,
  paymentLimiter,
  validatePayment,
  async (req, res, next) => {
    try {
      const { amount, currency, customerPhone, orderId } = req.body;
      
      const result = await processBakongPayment(
        amount,
        currency,
        customerPhone,
        orderId
      );
      
      res.json({
        success: true,
        paymentUrl: result.paymentUrl,
        transactionId: result.transactionId
      });
    } catch (error) {
      next(error);
    }
  }
);

// Notification Endpoint
router.post(
  '/notify/telegram',
  authenticate,
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10
  }),
  async (req, res, next) => {
    try {
      const result = await sendPaymentNotification(req.body);
      
      if (result.success) {
        res.json({ success: true });
      } else {
        res.status(500).json({ 
          error: 'Notification failed',
          details: result.error 
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

// Error Handling Middleware
router.use((err, req, res, next) => {
  console.error('Payment route error:', err);
  
  res.status(500).json({
    error: 'Payment processing failed',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    ...(err.response?.data && { details: err.response.data })
  });
});

export default router;