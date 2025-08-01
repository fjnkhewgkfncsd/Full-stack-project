import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import authenRoute from './src/routes/authRoutes.js'
import cartRoutes from './src/routes/cartRoutes.js';
// import orderRoutes from './src/routes/orderRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import favoriteRoutes from './src/routes/favRoutes.js';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authenRoute);
app.use('/api/cart', cartRoutes);
// app.use('/api/order', orderRoutes);
app.use('/api/products',productRoutes);
app.use('/api/favorites', favoriteRoutes);

app.post('/api/generate-khqr', async (req, res) => {
  const { amount, transactionId, email, username } = req.body;

  console.log(`[INFO] New QR code created for transaction ${transactionId} with amount ${amount} email ${email} username ${username}`);

  try {
    const khqrResult = KHQR.generate({
      tag: TAG.INDIVIDUAL,
      accountID: process.env.KHQR_ACCOUNT_ID || '1415364',
      merchantName: process.env.MERCHANT_NAME || 'KhmerKit',
      currency: CURRENCY.USD,
      amount: Number(amount),
      countryCode: COUNTRY.KH,
      additionalData: {
        billNumber: transactionId,
        purposeOfTransaction: 'Payment'
      }
    });

    if (khqrResult.status.code === 0 && khqrResult.data) {
      const qrString = khqrResult.data.qr;
      const qrCodeData = await QRCode.toDataURL(qrString);
      res.json({ qrCodeData });

      await checkPaymentStatus(khqrResult.data.md5, amount, transactionId, email, username);
    } else {
      res.status(400).json({ error: 'Invalid KHQR data' });
    }
  } catch (error) {
    console.error(`[ERROR] Error generating KHQR:`, error);
    res.status(500).json({ error: 'Error generating KHQR' });
  }
});

app.post('/api/notify/telegram', async (req, res) => {
  try {
    const { status, amount, paymentMethod, transactionId, cardDetails, billingAddress } = req.body;
    
    // Validate required fields
    if (!status || !amount || !paymentMethod) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['status', 'amount', 'paymentMethod']
      });
    }

    // Format the amount as currency
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);

    // Construct the clean message
    let message = `💳 *PAYMENT NOTIFICATION* 💳\n`;
    message += `═══════════════════════════\n`;
    message += `🟢 *Status:* ${status.toUpperCase()}\n`;
    message += `💰 *Amount:* ${formattedAmount}\n`;
    message += `💳 *Method:* ${paymentMethod.toUpperCase()}\n`;
    message += `🆔 *Transaction ID:* ${transactionId || 'N/A'}\n\n`;
    
    // Add card details if available
    if (cardDetails) {
      message += `🔒 *CARD DETAILS*\n`;
      message += `─────────────────────────────\n`;
      message += `👤 *Name:* ${cardDetails.cardName || 'N/A'}\n`;
      message += `🔢 *Last 4:* **** **** **** ${cardDetails.last4 || '****'}\n`;
      message += `📅 *Expiry:* ${cardDetails.expiry || 'N/A'}\n\n`;
    }
    
    // Add billing address if available
    if (billingAddress) {
      message += `🏠 *BILLING ADDRESS*\n`;
      message += `─────────────────────────────\n`;
      message += `👤 *Name:* ${billingAddress.firstName || ''} ${billingAddress.lastName || ''}\n`;
      message += `📧 *Email:* ${billingAddress.email || 'N/A'}\n`;
      message += `📍 *Address:* ${billingAddress.address || ''}\n`;
      message += `🏙️ *City:* ${billingAddress.city || ''}\n`;
      message += `🗺️ *State/ZIP:* ${billingAddress.state || ''} ${billingAddress.zipCode || ''}\n`;
      message += `🌎 *Country:* ${billingAddress.country || 'N/A'}\n`;
    }

    console.log('Formatted Telegram message:', message);
    
    // Send to Telegram with Markdown formatting
    const telegramResponse = await sendToTelegram(message, true);
    
    res.json({ 
      success: true,
      message: "Notification sent successfully",
      telegramResponse
    });
  } catch (error) {
    console.error('Telegram notification error:', error);
    res.status(500).json({ 
      error: 'Failed to send notification',
      details: error.message
    });
  }
});

const sendToTelegram = async (message, useMarkdown = false) => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('[ERROR] Missing Telegram configuration');
    throw new Error('Telegram bot token or chat ID not configured');
  }

  const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    };

    if (useMarkdown) {
      payload.parse_mode = "MarkdownV2";
      // Escape special characters for MarkdownV2
      payload.text = message
        .replace(/\-/g, '\\-')
        .replace(/\./g, '\\.')
        .replace(/\!/g, '\\!')
        .replace(/\*/g, '\\*')
        .replace(/\_/g, '\\_')
        .replace(/\`/g, '\\`')
        .replace(/\|/g, '\\|')
        .replace(/\~/g, '\\~')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');
    }

    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error("Failed to send Telegram message:", result);
      throw new Error(result.description || 'Telegram API error');
    }
    
    return result;
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    throw error;
  }
};

export default app;