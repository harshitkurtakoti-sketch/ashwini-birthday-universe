/**
 * Vercel Serverless Function: /api/telegram-notify
 * Secure serverless endpoint to dispatch Telegram notifications
 */

import {
  sendTelegramNotification,
  isRateLimited,
  isDuplicateEvent
} from '../server/services/telegramService.js';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Basic rate limiting by IP
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ success: false, error: 'Too many requests. Please wait.' });
  }

  const payload = req.body;
  if (!payload || typeof payload !== 'object' || !payload.type) {
    return res.status(400).json({ success: false, error: 'Invalid payload: missing type' });
  }

  // Deduplication check via eventId
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

    // Do not leak sensitive bot tokens or server trace
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
}
