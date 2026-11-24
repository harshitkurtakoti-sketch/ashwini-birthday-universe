import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmailNotification } from '../services/emailService.js';
import { sendWhatsAppNotification } from '../services/whatsappService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(SUBMISSIONS_FILE)) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

const router = express.Router();
const ipRateLimit = new Map();

// Helper to save submission to file
const saveSubmissionToFile = (submission) => {
  try {
    let current = [];
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const content = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
      current = JSON.parse(content || '[]');
    }
    current.unshift({
      ...submission,
      id: 'sub_' + Date.now(),
      savedAt: new Date().toISOString()
    });
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(current.slice(0, 100), null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving submission to file:', err);
  }
};

// GET: Retrieve all logged submissions for Harshit's dashboard
router.get('/submissions', (req, res) => {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const content = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
      return res.json(JSON.parse(content || '[]'));
    }
    res.json([]);
  } catch {
    res.status(500).json({ error: 'Failed to read submissions' });
  }
});

// POST: Save and dispatch notification
router.post('/notify', async (req, res) => {
  const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const lastRequestTime = ipRateLimit.get(clientIp) || 0;

  if (now - lastRequestTime < 500) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }
  ipRateLimit.set(clientIp, now);

  const payload = req.body;

  if (!payload || !payload.type) {
    return res.status(400).json({ error: 'Invalid payload: missing type' });
  }

  // 1. Permanently record submission on disk
  saveSubmissionToFile(payload);
  console.info(`💌 [New Submission Saved] Type: ${payload.type}`);

  try {
    // 2. Dispatch email and WhatsApp in background
    const [emailResult, whatsappResult] = await Promise.allSettled([
      sendEmailNotification(payload),
      sendWhatsAppNotification(payload)
    ]);

    res.json({
      success: true,
      saved: true,
      email: emailResult.status === 'fulfilled' ? emailResult.value : { error: emailResult.reason },
      whatsapp: whatsappResult.status === 'fulfilled' ? whatsappResult.value : { error: whatsappResult.reason }
    });
  } catch (err) {
    console.error('Notification dispatch error:', err);
    res.status(500).json({ error: 'Internal server error', saved: true });
  }
});

export default router;
