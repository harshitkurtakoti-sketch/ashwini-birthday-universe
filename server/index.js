import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import telegramRouter from './routes/telegramNotify.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Ashwini Birthday Universe Notification Server',
    telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'YOUR_NEW_BOT_TOKEN'),
    chatIdConfigured: Boolean(process.env.TELEGRAM_CHAT_ID)
  });
});

// Mount Telegram notification endpoints under /api
app.use('/api', telegramRouter);

app.listen(PORT, () => {
  console.log(`✨ Birthday Universe Telegram notification server running on http://localhost:${PORT}`);
});
