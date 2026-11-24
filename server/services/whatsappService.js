/**
 * WHATSAPP BUSINESS CLOUD API SERVICE
 * Sends direct notifications to your registered WhatsApp number
 */

export const sendWhatsAppNotification = async (payload) => {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const targetNumber = process.env.MY_WHATSAPP_NUMBER; // E.164 formatted number, e.g. "919876543210"

  if (!token || !phoneNumberId || !targetNumber) {
    console.info('[WhatsApp Service] WhatsApp Business credentials not set. WhatsApp simulation logged.');
    console.info(`[WhatsApp to ${targetNumber || 'Harshit'}] Type: ${payload.type}`);
    return {
      success: true,
      simulated: true,
      message: 'WhatsApp Cloud API ready. Set WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and MY_WHATSAPP_NUMBER in .env to send live WhatsApp messages.'
    };
  }

  let textMessage = '';

  switch (payload.type) {
    case 'LONG_DRIVE_RSVP':
      textMessage = `🚗 *Ashwini Confirmed the Long Drive!*\n\n📅 *Date:* ${payload.date}\n⏰ *Time:* ${payload.time}\n🎵 *Note / Songs:* ${payload.playlistOrNote || 'None'}\n\n_Sent from Ashwini's Birthday Universe_`;
      break;

    case 'QUIZ_COMPLETION':
      textMessage = `🎯 *Ashwini Finished the Friendship Quiz!*\n\n🏆 *Score:* ${payload.score}/${payload.total}\n👑 *Rank:* ${payload.resultTier}\n\n_Review full breakdown in your email inbox._`;
      break;

    case 'WISHING_JAR_MESSAGE':
      textMessage = `🌟 *Ashwini added a wish to the star jar:*\n\n"${payload.message}"`;
      break;

    case 'WALL_PERMISSION':
      textMessage = `🔓 *Wall Permission Answered:*\n\nAshwini chose: "${payload.choice}"`;
      break;

    default:
      textMessage = `✨ *Birthday Universe Activity:* ${payload.type}`;
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: targetNumber,
        type: 'text',
        text: { body: textMessage }
      })
    });

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('WhatsApp API dispatch failed:', error);
    return { success: false, error: error.message };
  }
};
