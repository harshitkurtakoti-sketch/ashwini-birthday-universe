import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notifyRouter from './routes/notify.js';

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
    emailConfigured: Boolean(process.env.RESEND_API_KEY),
    whatsappConfigured: Boolean(process.env.WHATSAPP_ACCESS_TOKEN)
  });
});

// Notifications endpoint
app.use('/api', notifyRouter);

app.listen(PORT, () => {
  console.log(`✨ Birthday Universe notification server running on http://localhost:${PORT}`);
});
