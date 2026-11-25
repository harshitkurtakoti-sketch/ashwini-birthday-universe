/**
 * Netlify Serverless Function: telegram-notify
 * Sends notifications to Telegram Bot API
 */

// --- Inline Telegram Service (Netlify functions are standalone) ---

function sanitizeText(text, maxLength = 1000) {
  if (typeof text !== 'string') return '';
  const trimmed = text.trim();
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) + '... (truncated)' : trimmed;
}

function formatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  }).format(date);
}

// In-memory dedup + rate limit (resets on cold start, which is fine)
const recentEventIds = new Set();
const ipRateLimits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const record = ipRateLimits.get(ip);
  if (!record || now - record.start > 10000) {
    ipRateLimits.set(ip, { start: now, count: 1 });
    return false;
  }
  record.count++;
  return record.count > 15;
}

function isDuplicate(eventId) {
  if (!eventId) return false;
  if (recentEventIds.has(eventId)) return true;
  if (recentEventIds.size >= 500) {
    recentEventIds.delete(recentEventIds.values().next().value);
  }
  recentEventIds.add(eventId);
  return false;
}

function formatTelegramMessage(payload) {
  const time = formatTimestamp(payload.timestamp ? new Date(payload.timestamp) : new Date());

  switch (payload.type) {
    case 'SECRET_QUESTION':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE', '',
        '💗 SECRET QUESTION',
        'Status: Successfully unlocked!',
        `Answer: "${sanitizeText(payload.answer || 'Bewadi')}" 🐼`,
        `Time: ${time}`
      ].join('\n');

    case 'QUIZ_ANSWER':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE', '',
        '🎯 QUIZ UPDATE',
        `Question: ${payload.questionIndex || 1} of ${payload.totalQuestions || 12}`,
        `Question: ${sanitizeText(payload.questionText)}`,
        `Answer: ${sanitizeText(payload.selectedAnswer)}`,
        `Result: ${payload.isCorrect ? '✅ Correct' : '💡 Fun answer'}`,
        `Time: ${time}`
      ].join('\n');

    case 'QUIZ_COMPLETED':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE', '',
        '🎯 QUIZ COMPLETED',
        `Score: ${payload.score} of ${payload.total}`,
        `Achievement: ${sanitizeText(payload.resultTier || 'Certified Panda')}`,
        payload.verdict ? `Verdict: ${sanitizeText(payload.verdict)}` : '',
        `Time: ${time}`
      ].filter(Boolean).join('\n');

    case 'PERSONAL_MESSAGE':
    case 'WISHING_JAR_MESSAGE':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE', '',
        '💌 PERSONAL MESSAGE',
        `From: ${sanitizeText(payload.author || 'Ashwini (Bewadi) 🌸')}`, '',
        `"${sanitizeText(payload.message)}"`, '',
        `Time: ${time}`
      ].join('\n');

    case 'WALL_PERMISSION':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE', '',
        '🖼️ MEMORY WALL PERMISSION',
        `Decision: ${sanitizeText(payload.choice)}`,
        payload.detail ? `Detail: ${sanitizeText(payload.detail)}` : '',
        `Time: ${time}`
      ].filter(Boolean).join('\n');

    case 'LONG_DRIVE_DECISION':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE', '',
        '🚗 LONG DRIVE INVITATION',
        `Decision: ${sanitizeText(payload.decision)}`,
        payload.note ? `Note: ${sanitizeText(payload.note)}` : '',
        `Time: ${time}`
      ].filter(Boolean).join('\n');

    case 'LONG_DRIVE_RSVP':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE', '',
        '🚗 LONG DRIVE RESPONSE',
        'Decision: YES! Let\'s plan it! ❤️',
        `Preferred date: ${sanitizeText(payload.date || 'TBD')}`,
        `Preferred time: ${sanitizeText(payload.time || 'Evening')}`,
        payload.playlistOrNote ? `Note: "${sanitizeText(payload.playlistOrNote)}"` : '',
        `Time: ${time}`
      ].filter(Boolean).join('\n');

    case 'FINAL_COMPLETION':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE', '',
        '✨ FINAL COMPLETION',
        'Ashwini has completed the entire birthday universe! 🎂🥂',
        'She reached the final closing message and explored all chapters.',
        `Time: ${time}`
      ].join('\n');

    case 'CHAPTER_PROGRESS':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE', '',
        `📍 ${sanitizeText(payload.chapter || 'CHAPTER UPDATE')}`,
        `Action: ${sanitizeText(payload.action)}`,
        payload.detail ? `Detail: ${sanitizeText(payload.detail)}` : '',
        `Time: ${time}`
      ].filter(Boolean).join('\n');

    case 'TEST_PING':
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE', '',
        '🔔 TELEGRAM NOTIFICATION TEST',
        'Your Telegram notification integration is working properly!',
        `Time: ${time}`
      ].join('\n');

    default:
      return [
        '🐼 ASHWINI BIRTHDAY WEBSITE', '',
        `Activity: ${sanitizeText(payload.type)}`,
        payload.message ? `Details: ${sanitizeText(payload.message)}` : '',
        `Time: ${time}`
      ].filter(Boolean).join('\n');
  }
}

// --- Netlify Function Handler ---

export const handler = async (event) => {
  // CORS headers for browser requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method Not Allowed' }) };
  }

  // Rate limit
  const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  if (isRateLimited(clientIp)) {
    return { statusCode: 429, headers, body: JSON.stringify({ success: false, error: 'Too many requests.' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Invalid JSON' }) };
  }

  if (!payload || !payload.type) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Missing type' }) };
  }

  // Dedup
  if (payload.eventId && isDuplicate(payload.eventId)) {
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, duplicate: true }) };
  }

  // Send to Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || '7904103952';

  if (!botToken || botToken === 'YOUR_NEW_BOT_TOKEN') {
    return {
      statusCode: 200, headers,
      body: JSON.stringify({ success: false, message: 'Bot token not configured' })
    };
  }

  const messageText = formatTelegramMessage(payload);

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: messageText })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      console.error(`[Telegram Error] ${response.status}: ${result.description}`);
      return { statusCode: 502, headers, body: JSON.stringify({ success: false, error: 'Telegram delivery failed' }) };
    }

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ success: true, messageId: result.result?.message_id })
    };
  } catch (err) {
    console.error('[Telegram Network Error]', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Network error' }) };
  }
};
