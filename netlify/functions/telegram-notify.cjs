/**
 * Netlify Serverless Function: telegram-notify (.cjs for 100% compatibility with "type": "module" repos)
 * Zero external dependencies — uses built-in Node fetch.
 */

function sanitizeText(text, maxLength = 1000) {
  if (typeof text !== 'string') return '';
  const trimmed = text.trim();
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) + '... (truncated)' : trimmed;
}

function formatTimestamp(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

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
  return record.count > 25;
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
        "Decision: YES! Let's plan it! ❤️",
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

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Safe diagnostic GET endpoint (never exposes token)
  if (event.httpMethod === 'GET') {
    const rawToken = process.env.TELEGRAM_BOT_TOKEN || '';
    const botToken = rawToken.trim().replace(/^["']|["']$/g, '');
    const rawChatId = process.env.TELEGRAM_CHAT_ID || '7904103952';
    const chatId = rawChatId.trim().replace(/^["']|["']$/g, '');

    const hasToken = Boolean(botToken && botToken !== 'YOUR_NEW_BOT_TOKEN');
    const hasChatId = Boolean(chatId);

    // If ?test=1 is passed, send an actual test message to Telegram
    if (event.queryStringParameters && event.queryStringParameters.test === '1') {
      if (!hasToken) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ status: 'error', hasToken: false, message: 'TELEGRAM_BOT_TOKEN not set' })
        };
      }
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: formatTelegramMessage({ type: 'TEST_PING' })
          })
        });
        const tgJson = await tgRes.json();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            status: tgJson.ok ? 'sent' : 'telegram_rejected',
            hasToken,
            hasChatId,
            telegramOk: tgJson.ok,
            telegramError: tgJson.description || null,
            messageId: tgJson.result?.message_id || null
          })
        };
      } catch (err) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ status: 'network_error', error: err.message })
        };
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'online',
        function: 'telegram-notify.cjs',
        hasToken,
        hasChatId,
        tokenFormatValid: /^\d+:[A-Za-z0-9_-]+$/.test(botToken),
        nodeVersion: process.version
      })
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method Not Allowed' }) };
  }

  const clientIp = (event.headers && (event.headers['x-forwarded-for'] || event.headers['client-ip'])) || 'unknown';
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

  if (payload.eventId && isDuplicate(payload.eventId)) {
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, duplicate: true }) };
  }

  const rawToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const botToken = rawToken.trim().replace(/^["']|["']$/g, '');
  const rawChatId = process.env.TELEGRAM_CHAT_ID || '7904103952';
  const chatId = rawChatId.trim().replace(/^["']|["']$/g, '');

  if (!botToken || botToken === 'YOUR_NEW_BOT_TOKEN') {
    console.error('[Telegram] Missing TELEGRAM_BOT_TOKEN env var');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: false, error: 'TELEGRAM_BOT_TOKEN not configured in Netlify environment variables' })
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
      console.error(`[Telegram API Error] ${response.status}: ${result.description}`);
      return { statusCode: 502, headers, body: JSON.stringify({ success: false, error: 'Telegram delivery failed' }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, messageId: result.result && result.result.message_id })
    };
  } catch (err) {
    console.error('[Telegram Network Error]', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Network error' }) };
  }
};
