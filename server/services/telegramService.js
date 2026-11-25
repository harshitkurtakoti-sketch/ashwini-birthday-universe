/**
 * Telegram Notification Service
 * Sends notifications directly to personal Telegram chat via official Telegram Bot API
 */

// In-memory deduplication set (up to 1000 recent event IDs)
const recentEventIds = new Set();
const MAX_EVENT_CACHE = 1000;

// In-memory IP rate limiting
const ipRateLimits = new Map();
const RATE_LIMIT_WINDOW_MS = 10000; // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 15;

/**
 * Clean and truncate untrusted text safely
 */
export function sanitizeText(text, maxLength = 1000) {
  if (typeof text !== 'string') return '';
  const trimmed = text.trim();
  if (trimmed.length > maxLength) {
    return trimmed.slice(0, maxLength) + '... (truncated)';
  }
  return trimmed;
}

/**
 * Mask token for safe logging
 */
export function maskToken(token) {
  if (!token || typeof token !== 'string') return 'none';
  if (token.length <= 6) return '******';
  return `${token.slice(0, 4)}...${token.slice(-3)}`;
}

/**
 * Format timestamp in friendly format
 */
export function formatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  }).format(date);
}

/**
 * Check if request exceeds rate limit
 */
export function isRateLimited(clientIp) {
  const now = Date.now();
  const record = ipRateLimits.get(clientIp);

  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    ipRateLimits.set(clientIp, { startTime: now, count: 1 });
    return false;
  }

  record.count += 1;
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  return false;
}

/**
 * Check and record duplicate event IDs
 */
export function isDuplicateEvent(eventId) {
  if (!eventId) return false;
  if (recentEventIds.has(eventId)) {
    return true;
  }
  if (recentEventIds.size >= MAX_EVENT_CACHE) {
    const firstKey = recentEventIds.values().next().value;
    recentEventIds.delete(firstKey);
  }
  recentEventIds.add(eventId);
  return false;
}

/**
 * Build clean, human-readable Telegram message text with emojis
 */
export function formatTelegramMessage(payload) {
  const time = formatTimestamp(payload.timestamp ? new Date(payload.timestamp) : new Date());

  switch (payload.type) {
    case 'SECRET_QUESTION':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE',
        '',
        '💗 SECRET QUESTION',
        'Status: Successfully unlocked!',
        `Answer: "${sanitizeText(payload.answer || 'Bewadi')}" 🐼`,
        `Time: ${time}`
      ].join('\n');

    case 'QUIZ_ANSWER':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE',
        '',
        '🎯 QUIZ UPDATE',
        `Question: ${payload.questionIndex || 1} of ${payload.totalQuestions || 12}`,
        `Question: ${sanitizeText(payload.questionText)}`,
        `Answer: ${sanitizeText(payload.selectedAnswer)}`,
        `Result: ${payload.isCorrect ? '✅ Correct' : '💡 Fun answer'}`,
        `Time: ${time}`
      ].join('\n');

    case 'QUIZ_COMPLETED':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE',
        '',
        '🎯 QUIZ COMPLETED',
        `Score: ${payload.score} of ${payload.total}`,
        `Achievement: ${sanitizeText(payload.resultTier || 'Certified Panda')}`,
        payload.verdict ? `Verdict: ${sanitizeText(payload.verdict)}` : '',
        `Time: ${time}`
      ].filter(Boolean).join('\n');

    case 'PERSONAL_MESSAGE':
    case 'WISHING_JAR_MESSAGE':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE',
        '',
        '💌 PERSONAL MESSAGE',
        `From: ${sanitizeText(payload.author || 'Ashwini (Bewadi) 🌸')}`,
        '',
        `"${sanitizeText(payload.message)}"`,
        '',
        `Time: ${time}`
      ].join('\n');

    case 'WALL_PERMISSION':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE',
        '',
        '🖼️ MEMORY WALL PERMISSION',
        `Decision: ${sanitizeText(payload.choice)}`,
        payload.detail ? `Detail: ${sanitizeText(payload.detail)}` : '',
        `Time: ${time}`
      ].filter(Boolean).join('\n');

    case 'LONG_DRIVE_DECISION':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE',
        '',
        '🚗 LONG DRIVE INVITATION',
        `Decision: ${sanitizeText(payload.decision)}`,
        payload.note ? `Note: ${sanitizeText(payload.note)}` : '',
        `Time: ${time}`
      ].filter(Boolean).join('\n');

    case 'LONG_DRIVE_RSVP':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE',
        '',
        '🚗 LONG DRIVE RESPONSE',
        'Decision: YES! Let\'s plan it! ❤️',
        `Preferred date: ${sanitizeText(payload.date || 'TBD')}`,
        `Preferred time: ${sanitizeText(payload.time || 'Evening')}`,
        payload.playlistOrNote ? `Note: "${sanitizeText(payload.playlistOrNote)}"` : '',
        `Time: ${time}`
      ].filter(Boolean).join('\n');

    case 'FINAL_COMPLETION':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE',
        '',
        '✨ FINAL COMPLETION',
        'Ashwini has completed the entire birthday universe! 🎂🥂',
        'She reached the final closing message and explored all chapters.',
        `Time: ${time}`
      ].join('\n');

    case 'CHAPTER_PROGRESS':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE',
        '',
        `📍 ${sanitizeText(payload.chapter || 'CHAPTER UPDATE')}`,
        `Action: ${sanitizeText(payload.action)}`,
        payload.detail ? `Detail: ${sanitizeText(payload.detail)}` : '',
        `Time: ${time}`
      ].filter(Boolean).join('\n');

    case 'TEST_PING':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE',
        '',
        '🔔 TELEGRAM NOTIFICATION TEST',
        'Your Telegram notification integration is working properly!',
        `Time: ${time}`
      ].join('\n');

    default:
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE',
        '',
        `Activity: ${sanitizeText(payload.type)}`,
        payload.message ? `Details: ${sanitizeText(payload.message)}` : '',
        `Time: ${time}`
      ].filter(Boolean).join('\n');
  }
}

/**
 * Send message to Telegram Bot API
 */
export async function sendTelegramNotification(payload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || '7904103952';

  if (!botToken || botToken === 'YOUR_NEW_BOT_TOKEN') {
    console.warn('[Telegram] TELEGRAM_BOT_TOKEN is not configured in environment variables.');
    return {
      success: false,
      skipped: true,
      error: 'TELEGRAM_BOT_TOKEN not configured'
    };
  }

  const messageText = formatTelegramMessage(payload);

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText
      })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      console.error(
        `[Telegram API Error] Status: ${response.status}, Description: ${result.description || 'Unknown error'}`
      );
      return {
        success: false,
        status: response.status,
        error: result.description || 'Telegram API request failed'
      };
    }

    console.info(`[Telegram] Notification sent successfully (Message ID: ${result.result?.message_id})`);
    return {
      success: true,
      messageId: result.result?.message_id
    };
  } catch (error) {
    console.error('[Telegram Network Error]', error.message);
    return {
      success: false,
      error: 'Network connection to Telegram failed'
    };
  }
}
