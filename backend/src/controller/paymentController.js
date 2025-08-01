import { sendPaymentNotification } from '../utils/telegramNotifier.js';
import Payment from '../models/payments.js';
import axios from 'axios';

export const processPayment = async (req, res) => {
  try {
    const { orderId, method, amount, currency, customerPhone, billingAddress, cardDetails } = req.body;
    
    // Generate transaction ID
    const transactionId = `txn_${Math.random().toString(36).slice(2, 10)}`;
    
    // For Bakong payments
    if (method === 'bakong') {
      const bakongResponse = await processBakongPayment(
        amount,
        currency,
        customerPhone,
        orderId
      );
      
      const payment = await Payment.create({
        order_id: orderId,
        method,
        amount,
        currency: currency || 'KHR',
        status: bakongResponse.status,
        transaction_id: bakongResponse.transactionId,
        payment_url: bakongResponse.paymentUrl
      });

      await sendPaymentNotification({
        status: 'pending',
        amount,
        paymentMethod: method,
        transactionId,
        billingAddress,
        cardDetails
      });

      return res.status(200).json({ 
        success: true, 
        payment,
        paymentUrl: bakongResponse.paymentUrl
      });
    }
    
    // For other payment methods
    const payment = await Payment.create({
      order_id: orderId,
      method,
      amount,
      status: 'pending',
      transaction_id: transactionId
    });

    await sendPaymentNotification({
      status: 'pending',
      amount,
      paymentMethod: method,
      transactionId,
      billingAddress,
      cardDetails
    });

    res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      error: 'Payment processing failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const processBakongPayment = async (
  amount, 
  currency, 
  customerPhone,
  orderId
) => {
  try {
    if (!process.env.BAKONG_API_URL || !process.env.BAKONG_ACCESS_TOKEN) {
      throw new Error('Bakong configuration missing');
    }

    const response = await axios.post(
      `${process.env.BAKONG_API_URL}/payments`,
      {
        amount: Math.round(amount * 100),
        currency: currency || 'KHR',
        customer_msisdn: customerPhone,
        merchant_id: process.env.BAKONG_MERCHANT_ID,
        reference_id: orderId || `ref_${Date.now()}`,
        description: 'Payment for services'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.BAKONG_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 seconds timeout
      }
    );

    if (!response.data?.txn_id) {
      throw new Error('Invalid Bakong response');
    }

    return {
      status: response.data.status || 'pending',
      transactionId: response.data.txn_id,
      paymentUrl: response.data.payment_url
    };
  } catch (error) {
    console.error('Bakong API Error:', error.response?.data || error.message);
    throw new Error(`Bakong payment failed: ${error.message}`);
  }
};

export const verifyQRPayment = async (req, res) => {
  const { transactionId, requiredAmount, method } = req.body;
  
  try {
    if (method === 'bakong') {
      const verification = await verifyBakongPayment(transactionId);
      return handleVerificationResult(res, verification, requiredAmount);
    }
    
    const verification = await mockCheckTelegramForPayment(transactionId);
    return handleVerificationResult(res, verification, requiredAmount);
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      error: 'Payment verification failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const verifyBakongPayment = async (transactionId) => {
  try {
    if (!process.env.BAKONG_API_URL || !process.env.BAKONG_ACCESS_TOKEN) {
      throw new Error('Bakong configuration missing');
    }

    const response = await axios.get(
      `${process.env.BAKONG_API_URL}/payments/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.BAKONG_ACCESS_TOKEN}`
        },
        timeout: 5000 // 5 seconds timeout
      }
    );
    
    if (!response.data?.amount) {
      throw new Error('Invalid Bakong verification response');
    }

    return {
      receivedAmount: response.data.amount / 100,
      currency: response.data.currency,
      status: response.data.status,
      transactionId
    };
  } catch (error) {
    console.error('Bakong Verification Error:', error.response?.data || error.message);
    throw new Error(`Bakong verification failed: ${error.message}`);
  }
};

const handleVerificationResult = async (res, verification, requiredAmount) => {
  try {
    const payment = await Payment.findOne({ 
      where: { transaction_id: verification.transactionId } 
    });

    if (verification.receivedAmount >= requiredAmount) {
      await Payment.update(
        { status: 'completed', settled_at: new Date() },
        { where: { transaction_id: verification.transactionId } }
      );
      
      await sendPaymentNotification({
        status: 'completed',
        amount: verification.receivedAmount,
        paymentMethod: payment?.method || 'khqr',
        transactionId: verification.transactionId,
        orderId: payment?.order_id || 'UNKNOWN'
      });
      
      return res.json({ verified: true });
    }

    if (verification.receivedAmount > 0) {
      await sendPaymentNotification({
        status: 'insufficient',
        receivedAmount: verification.receivedAmount,
        requiredAmount,
        transactionId: verification.transactionId
      });
      return res.json({ insufficient: true });
    }
    
    return res.json({ verified: false });
  } catch (error) {
    throw new Error(`Verification handling failed: ${error.message}`);
  }
};
