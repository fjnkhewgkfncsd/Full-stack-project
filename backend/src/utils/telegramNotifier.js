import axios from 'axios';

export const sendPaymentNotification = async (paymentDetails) => {
  // Debug: Log incoming payload
  console.log('Received paymentDetails:', JSON.stringify(paymentDetails, null, 2));

  // Validate required environment variables
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is missing in environment variables');
    return { success: false, error: 'Server configuration error' };
  }

  if (!process.env.TELEGRAM_CHAT_ID) {
    console.error('TELEGRAM_CHAT_ID is missing in environment variables');
    return { success: false, error: 'Server configuration error' };
  }

  // Validate required fields
  if (!paymentDetails?.status) {
    console.error('Missing status in paymentDetails');
    return { success: false, error: 'Status is required' };
  }

  if (!paymentDetails.amount) {
    console.error('Missing amount in paymentDetails');
    return { success: false, error: 'Amount is required' };
  }

  // Build the message - simplified version
  let message = `
💰 *${paymentDetails.status.toUpperCase()} Payment* ${paymentDetails.status === 'completed' ? '✅' : '🔄'}
━━━━━━━━━━━━━━
▫️ *Amount:* $${(paymentDetails.amount || 0).toFixed(2)}
▫️ *Method:* ${(paymentDetails.paymentMethod || 'UNKNOWN').toUpperCase()}
▫️ *TXN ID:* ${paymentDetails.transactionId || 'N/A'}
━━━━━━━━━━━━━━
`;

  // Add billing info if available
  if (paymentDetails.billingAddress) {
    message += `
🏠 *Billing Address*
━━━━━━━━━━━━━━
▫️ *Name:* ${paymentDetails.billingAddress.firstName || ''} ${paymentDetails.billingAddress.lastName || ''}
▫️ *Email:* ${paymentDetails.billingAddress.email || ''}
▫️ *Address:* ${paymentDetails.billingAddress.address || ''}
━━━━━━━━━━━━━━
`;
  }

  console.log('Constructed Telegram message:', message);

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'MarkdownV2'
      },
      {
        timeout: 5000 // 5 second timeout
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Telegram API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return { 
      success: false, 
      error: error.message,
      response: error.response?.data
    };
  }
};