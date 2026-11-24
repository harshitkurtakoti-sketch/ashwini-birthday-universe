/**
 * EMAIL NOTIFICATION SERVICE (Resend API)
 * Sends alerts to harshitkurtakoti@gmail.com
 */

export const sendEmailNotification = async (payload) => {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.NOTIFICATION_EMAIL || 'harshitkurtakoti@gmail.com';

  if (!apiKey) {
    console.info('[Email Service] RESEND_API_KEY is not configured in .env. Email simulation logged:');
    console.info(`[Email to ${recipient}] Type: ${payload.type}`);
    return {
      success: true,
      simulated: true,
      message: 'Email service ready. Provide RESEND_API_KEY in .env to send real emails.'
    };
  }

  let subject = 'Birthday Universe Alert!';
  let htmlContent = '';

  switch (payload.type) {
    case 'LONG_DRIVE_RSVP':
      subject = '🚗 Ashwini Confirmed the Long Drive!';
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #d946ef;">🚗 Ashwini Accepted the Long Drive!</h2>
          <p><strong>Date:</strong> ${payload.date}</p>
          <p><strong>Time:</strong> ${payload.time}</p>
          <p><strong>Playlist / Message:</strong> ${payload.playlistOrNote || 'None'}</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">Sent from Ashwini's Birthday Universe</p>
        </div>
      `;
      break;

    case 'QUIZ_COMPLETION':
      subject = `🎯 Ashwini Finished the Friendship Quiz: ${payload.score}/${payload.total}!`;
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #a855f7;">🎯 Quiz Results for Ashwini</h2>
          <p><strong>Score:</strong> ${payload.score} out of ${payload.total}</p>
          <p><strong>Result Title:</strong> ${payload.resultTier}</p>
          <h3>Submitted Answers:</h3>
          <ul>
            ${Object.values(payload.userAnswers || {})
              .map(a => `<li><strong>${a.questionText}:</strong> ${a.selectedOptionText} (${a.isCorrect ? '✅ Correct' : '💡 Fun answer'})</li>`)
              .join('')}
          </ul>
        </div>
      `;
      break;

    case 'WISHING_JAR_MESSAGE':
      subject = '🌟 Ashwini Dropped a Message into the Wishing Jar';
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ec4899;">🌟 Message in Wishing Jar</h2>
          <p><strong>Message:</strong> "${payload.message}"</p>
        </div>
      `;
      break;

    case 'WALL_PERMISSION':
      subject = `🔓 Ashwini answered "Permission to break the wall": ${payload.choice}`;
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ec4899;">🔓 Wall Permission Response</h2>
          <p><strong>Choice:</strong> ${payload.choice}</p>
        </div>
      `;
      break;

    default:
      subject = `✨ New Activity: ${payload.type}`;
      htmlContent = `<pre>${JSON.stringify(payload, null, 2)}</pre>`;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Birthday Universe <onboarding@resend.dev>',
        to: [recipient],
        subject,
        html: htmlContent
      })
    });

    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error('Failed to send Resend email:', err);
    return { success: false, error: err.message };
  }
};
