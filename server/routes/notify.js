import express from 'express';
import { sendEmailNotification } from '../services/emailService.js';
import { sendWhatsAppNotification } from '../services/whatsappService.js';

const router = express.Router();

// Simple in-memory rate limiting / anti-spam map
const ipRateLimit = new Map();

router.post('/notify', async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const lastRequestTime = ipRateLimit.get(clientIp) || 0;

  // 1 second throttle per IP
  if (now - lastRequestTime < 1000) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }
  ipRateLimit.set(clientIp, now);

  const payload = req.body;

  if (!payload || !payload.type) {
    return res.status(400).json({ error: 'Invalid payload: missing type' });
  }

  try {
    // Run email and WhatsApp dispatch concurrently
    const [emailResult, whatsappResult] = await Promise.allSettled([
      sendEmailNotification(payload),
      sendWhatsAppNotification(payload)
    ]);

    res.json({
      success: true,
      email: emailResult.status === 'fulfilled' ? emailResult.value : { error: emailResult.reason },
      whatsapp: whatsappResult.status === 'fulfilled' ? whatsappResult.value : { error: whatsappResult.reason }
    });
  } catch (err) {
    console.error('Notification dispatch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
