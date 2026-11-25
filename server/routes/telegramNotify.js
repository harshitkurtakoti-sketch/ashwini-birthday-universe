import express from 'express';
import {
  sendTelegramNotification,
  isRateLimited,
  isDuplicateEvent
} from '../services/telegramService.js';

const router = express.Router();

const handleTelegramRequest = async (req, res) => {
  const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ success: false, error: 'Too many requests. Please wait.' });
  }

  const payload = req.body;
  if (!payload || typeof payload !== 'object' || !payload.type) {
    return res.status(400).json({ success: false, error: 'Invalid payload: missing type' });
  }

  // Deduplication check
  if (payload.eventId && isDuplicateEvent(payload.eventId)) {
    return res.status(200).json({ success: true, duplicate: true });
  }

  try {
    const result = await sendTelegramNotification(payload);

    if (result.success) {
      return res.status(200).json({ success: true, messageId: result.messageId });
    }

    if (result.skipped) {
      return res.status(200).json({ success: false, message: 'Notification skipped: Bot token not configured' });
    }

    return res.status(502).json({
      success: false,
      error: 'Telegram delivery failed'
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: 'Internal notification error'
    });
  }
};

// Support both /telegram-notify and /notify on this router
router.post('/telegram-notify', handleTelegramRequest);
router.post('/notify', handleTelegramRequest);

export default router;
