import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { KHQR, CURRENCY, COUNTRY, TAG } from 'ts-khqr';
import QRCode from 'qrcode';
import fetch from 'node-fetch';
import { WebSocketServer } from 'ws';

// Initialize environment variables
import dotenv from 'dotenv';
dotenv.config();

console.log('Starting server...');

const app = express();
const PORT = process.env.PORT || 7777;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-api-key'
  ],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Serve index.html as the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// WebSocket Server
const wss = new WebSocketServer({ port: 8080 });
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('[INFO] New WebSocket client connected');
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

// KHQR Payment Route
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

// Enhanced Telegram Notification Endpoint
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

// Improved sendToTelegram function with Markdown support
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

// Function to Check Payment Status
async function checkPaymentStatus(md5, amount, transactionId, email, username, profile) {
  const url = process.env.BAKONG_API_URL || "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5";
  const body = { "md5": md5 };
  const BAKONG_ACCESS_TOKEN = process.env.BAKONG_ACCESS_TOKEN;
  
  if (!BAKONG_ACCESS_TOKEN) {
    console.error('[ERROR] Missing BAKONG_ACCESS_TOKEN');
    return;
  }

  const header = {
    "Authorization": `Bearer ${BAKONG_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  };

  const intervalId = setInterval(async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const jsonData = await response.json();

        if (jsonData.responseCode === 0 && jsonData.data && jsonData.data.hash) {
          console.log(`[SUCCESS] Payment Confirmed for Transaction: ${transactionId}, Amount: ${amount}, email: ${email}, username: ${username}`);

          const tokenValue = parseFloat(amount) * 4000;
          const message = `💰 *NEW PAYMENT RECEIVED* 💰\n\n` +
                         `👤 *Customer:* ${username}\n` +
                         `📧 *Email:* ${email}\n` +
                         `💵 *Amount:* ${amount} USD\n` +
                         `🪙 *Tokens:* ${tokenValue} KHR\n` +
                         `🆔 *Transaction ID:* ${transactionId}`;

          await sendToTelegram(message, true);

          // Notify all WebSocket clients
          clients.forEach(ws => {
            ws.send(JSON.stringify({
              type: 'payment_success',
              transactionId,
              amount,
              email,
              username
            }));
          });

          clearInterval(intervalId);
        }
      } else {
        console.error(`[ERROR] Failed to check payment status`, response.statusText);
      }
    } catch (error) {
      console.error(`[ERROR] Error checking payment status`, error);
    }
  }, 5000);

  setTimeout(() => {
    console.error(`[ERROR] Payment timeout: 2 minutes elapsed`);
    clearInterval(intervalId);
  }, 120000);
}

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log('Registered route:', r.route.path);
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`[INFO] Server is running on port ${PORT}`);
});