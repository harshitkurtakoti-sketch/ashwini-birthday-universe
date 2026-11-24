/**
 * Vercel Serverless Function handler for /api/notify
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload = req.body;
  if (!payload || !payload.type) {
    return res.status(400).json({ error: 'Missing payload type' });
  }

  const emailApiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.NOTIFICATION_EMAIL || 'harshitkurtakoti@gmail.com';
  const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const targetNumber = process.env.MY_WHATSAPP_NUMBER;

  let emailStatus = { simulated: true };
  let whatsappStatus = { simulated: true };

  // 1. Send Email via Resend
  if (emailApiKey) {
    try {
      let subject = 'Birthday Universe Alert!';
      let htmlContent = '';

      if (payload.type === 'LONG_DRIVE_RSVP') {
        subject = '🚗 Ashwini Confirmed the Long Drive!';
        htmlContent = `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #d946ef;">🚗 Ashwini Accepted the Long Drive!</h2>
            <p><strong>Date:</strong> ${payload.date}</p>
            <p><strong>Time:</strong> ${payload.time}</p>
            <p><strong>Playlist / Message:</strong> ${payload.playlistOrNote || 'None'}</p>
          </div>
        `;
      } else if (payload.type === 'QUIZ_COMPLETION') {
        subject = `🎯 Ashwini Finished the Quiz: ${payload.score}/${payload.total}!`;
        htmlContent = `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #a855f7;">🎯 Quiz Results for Ashwini</h2>
            <p><strong>Score:</strong> ${payload.score} / ${payload.total}</p>
            <p><strong>Result Tier:</strong> ${payload.resultTier}</p>
          </div>
        `;
      } else if (payload.type === 'WISHING_JAR_MESSAGE') {
        subject = '🌟 Message in Wishing Jar from Ashwini';
        htmlContent = `<p>"${payload.message}"</p>`;
      } else if (payload.type === 'WALL_PERMISSION') {
        subject = `🔓 Wall Permission: ${payload.choice}`;
        htmlContent = `<p>Ashwini chose: <strong>${payload.choice}</strong></p>`;
      }

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${emailApiKey}`
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Birthday Universe <onboarding@resend.dev>',
          to: [recipient],
          subject,
          html: htmlContent
        })
      });
      emailStatus = await resendRes.json();
    } catch (e) {
      emailStatus = { error: e.message };
    }
  }

  // 2. Send WhatsApp Notification
  if (whatsappToken && phoneNumberId && targetNumber) {
    try {
      let bodyText = `✨ *Activity from Ashwini:* ${payload.type}`;
      if (payload.type === 'LONG_DRIVE_RSVP') {
        bodyText = `🚗 *Ashwini Confirmed the Long Drive!*\n\n📅 Date: ${payload.date}\n⏰ Time: ${payload.time}\n🎵 Note: ${payload.playlistOrNote || 'None'}`;
      } else if (payload.type === 'QUIZ_COMPLETION') {
        bodyText = `🎯 *Quiz Finished:* ${payload.score}/${payload.total} (${payload.resultTier})`;
      } else if (payload.type === 'WISHING_JAR_MESSAGE') {
        bodyText = `🌟 *Wishing Jar Note:*\n"${payload.message}"`;
      } else if (payload.type === 'WALL_PERMISSION') {
        bodyText = `🔓 *Wall Permission:* ${payload.choice}`;
      }

      const waRes = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${whatsappToken}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: targetNumber,
          type: 'text',
          text: { body: bodyText }
        })
      });
      whatsappStatus = await waRes.json();
    } catch (e) {
      whatsappStatus = { error: e.message };
    }
  }

  return res.status(200).json({
    success: true,
    email: emailStatus,
    whatsapp: whatsappStatus
  });
}
