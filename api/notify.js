/**
 * Vercel Serverless Function: /api/notify
 * Alias endpoint pointing to Telegram notification handler
 */

import handler from './telegram-notify.js';

export default handler;
