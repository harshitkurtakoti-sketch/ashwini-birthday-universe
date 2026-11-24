import emailjs from '@emailjs/browser';
import { db, isFirebaseConfigured } from '../config/firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DEFAULT_RECIPIENT = 'harshitkurtakoti@gmail.com';

/**
 * Helper to retrieve EmailJS configuration from env or local storage
 */
export const getEmailJSConfig = () => {
  let localConfig = {};
  try {
    localConfig = JSON.parse(localStorage.getItem('ashwini_emailjs_config') || '{}');
  } catch {
    // ignore
  }

  return {
    serviceId: localConfig.serviceId || import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    templateId: localConfig.templateId || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    publicKey: localConfig.publicKey || import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
    recipientEmail: localConfig.recipientEmail || import.meta.env.VITE_TO_EMAIL || DEFAULT_RECIPIENT
  };
};

/**
 * Helper to update EmailJS configuration from UI
 */
export const saveEmailJSConfig = ({ serviceId, templateId, publicKey, recipientEmail }) => {
  const cfg = {
    serviceId: serviceId?.trim() || '',
    templateId: templateId?.trim() || '',
    publicKey: publicKey?.trim() || '',
    recipientEmail: recipientEmail?.trim() || DEFAULT_RECIPIENT
  };
  localStorage.setItem('ashwini_emailjs_config', JSON.stringify(cfg));
  return cfg;
};

/**
 * Service to dispatch notifications via EmailJS (browser-direct),
 * Firebase Firestore, and the backend Express proxy (/api/notify).
 */
export const notificationService = {
  /**
   * Save Long Drive Response
   */
  async submitLongDrive({ date, time, playlistOrNote }) {
    const payload = {
      type: 'LONG_DRIVE_RSVP',
      date,
      time,
      playlistOrNote: playlistOrNote || 'No custom note',
      createdAt: new Date().toISOString()
    };

    // 1. Save to Firebase if configured
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'long_drive_rsvps'), {
          ...payload,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.warn('Could not write to Firestore:', e);
      }
    }

    // 2. Local fallback storage
    try {
      const stored = JSON.parse(localStorage.getItem('ashwini_long_drive') || '[]');
      stored.push(payload);
      localStorage.setItem('ashwini_long_drive', JSON.stringify(stored));
    } catch {
      // ignore
    }

    // 3. Dispatch via EmailJS & Backend
    return await this.dispatchAll(payload);
  },

  /**
   * Save Quiz Results
   */
  async submitQuizResults({ score, total, resultTier, userAnswers }) {
    const payload = {
      type: 'QUIZ_COMPLETION',
      score,
      total,
      resultTier,
      userAnswers,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'quiz_results'), {
          ...payload,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.warn('Could not write to Firestore:', e);
      }
    }

    try {
      localStorage.setItem('ashwini_quiz_results', JSON.stringify(payload));
    } catch {
      // ignore
    }

    return await this.dispatchAll(payload);
  },

  /**
   * Save Wish or Personal Message from Star Jar
   */
  async submitWishMessage({ author, message }) {
    const payload = {
      type: 'WISHING_JAR_MESSAGE',
      author: author || 'Ashwini',
      message,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'wishing_jar_messages'), {
          ...payload,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.warn('Could not write to Firestore:', e);
      }
    }

    try {
      const stored = JSON.parse(localStorage.getItem('ashwini_wishes') || '[]');
      stored.push(payload);
      localStorage.setItem('ashwini_wishes', JSON.stringify(stored));
    } catch {
      // ignore
    }

    return await this.dispatchAll(payload);
  },

  /**
   * Save Wall Permission Choice
   */
  async submitWallPermission(choice) {
    const payload = {
      type: 'WALL_PERMISSION',
      choice,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'wall_permissions'), {
          ...payload,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.warn('Could not write to Firestore:', e);
      }
    }

    try {
      localStorage.setItem('ashwini_wall_permission', JSON.stringify(payload));
    } catch {
      // ignore
    }

    return await this.dispatchAll(payload);
  },

  /**
   * Master dispatch: EmailJS first, then backend proxy /api/notify fallback
   */
  async dispatchAll(payload) {
    console.info('🚀 [Notification Dispatch] Processing payload:', payload);

    let emailjsResult = { attempted: false, success: false };
    let backendResult = { attempted: false, success: false };

    // 1. Try sending directly through EmailJS
    try {
      emailjsResult = await this.sendViaEmailJS(payload);
    } catch (err) {
      console.warn('EmailJS dispatch encountered error:', err);
      emailjsResult = { attempted: true, success: false, error: err.message };
    }

    // 2. Try sending through backend server endpoint (/api/notify)
    try {
      backendResult = await this.dispatchBackendNotification(payload);
    } catch (err) {
      console.warn('Backend endpoint dispatch encountered error:', err);
      backendResult = { attempted: true, success: false, error: err.message };
    }

    // Notify user via a subtle event on window
    const event = new CustomEvent('birthday-universe-notification', {
      detail: { payload, emailjsResult, backendResult }
    });
    window.dispatchEvent(event);

    return {
      success: emailjsResult.success || backendResult.success || true,
      emailjs: emailjsResult,
      backend: backendResult
    };
  },

  /**
   * Direct EmailJS Sending
   */
  async sendViaEmailJS(payload) {
    const config = getEmailJSConfig();

    // Prepare human-readable subject and body
    let subject = 'Birthday Universe Alert!';
    let formattedMessage = '';

    switch (payload.type) {
      case 'LONG_DRIVE_RSVP':
        subject = payload.date === 'Declined for now'
          ? '🚗 Ashwini replied to Long Drive: Playfully Declined For Now'
          : `🚗 Ashwini Confirmed the Long Drive for ${payload.date}!`;
        formattedMessage = `
🚗 Ashwini's Long Drive RSVP:
----------------------------------------
Date: ${payload.date}
Time: ${payload.time}
Playlist / Personal Note:
"${payload.playlistOrNote}"
----------------------------------------
Timestamp: ${payload.createdAt}
        `.trim();
        break;

      case 'QUIZ_COMPLETION':
        subject = `🎯 Ashwini Finished the Bond Quiz: ${payload.score}/${payload.total} (${payload.resultTier})!`;
        const answersSummary = Object.values(payload.userAnswers || {})
          .map((a, i) => `${i + 1}. ${a.questionText}\n   → Selected: "${a.selectedOptionText}" (${a.isCorrect ? '✅ Correct' : '💡 Fun answer'})`)
          .join('\n\n');

        formattedMessage = `
🎯 Ashwini's Quiz Results:
----------------------------------------
Score: ${payload.score} out of ${payload.total}
Result Tier: ${payload.resultTier}

Answers:
${answersSummary}
----------------------------------------
Timestamp: ${payload.createdAt}
        `.trim();
        break;

      case 'WISHING_JAR_MESSAGE':
        subject = '🌟 Ashwini Dropped a Message into the Wishing Jar!';
        formattedMessage = `
🌟 Ashwini's Wishing Jar Message:
----------------------------------------
From: ${payload.author}
Message: "${payload.message}"
----------------------------------------
Timestamp: ${payload.createdAt}
        `.trim();
        break;

      case 'WALL_PERMISSION':
        subject = `🔓 Ashwini answered "Permission to break the wall": ${payload.choice}`;
        formattedMessage = `
🔓 Permission to Break the Wall:
----------------------------------------
Ashwini chose: "${payload.choice}"
----------------------------------------
Timestamp: ${payload.createdAt}
        `.trim();
        break;

      default:
        subject = `✨ Activity in Birthday Universe: ${payload.type}`;
        formattedMessage = JSON.stringify(payload, null, 2);
    }

    // Common template parameters accepted by typical EmailJS templates
    const templateParams = {
      to_email: config.recipientEmail || DEFAULT_RECIPIENT,
      to_name: 'Harshit',
      from_name: 'Ashwini (Birthday Universe)',
      reply_to: 'no-reply@birthday.universe',
      subject: subject,
      title: subject,
      message: formattedMessage,
      event_type: payload.type,
      date: payload.date || '',
      time: payload.time || '',
      playlist_or_note: payload.playlistOrNote || '',
      score: payload.score !== undefined ? `${payload.score}/${payload.total}` : '',
      result_tier: payload.resultTier || '',
      choice: payload.choice || '',
      timestamp: new Date().toLocaleString()
    };

    if (!config.serviceId || !config.templateId || !config.publicKey) {
      console.warn(
        `[EmailJS] Credentials not fully configured (Service: ${config.serviceId || 'missing'}, Template: ${config.templateId || 'missing'}, Key: ${config.publicKey ? 'present' : 'missing'}).\n` +
        `Target Recipient: ${config.recipientEmail}\n` +
        `Simulated Email Content:\n` +
        `Subject: ${subject}\n\n${formattedMessage}`
      );
      return {
        attempted: true,
        success: false,
        simulated: true,
        message: 'EmailJS credentials not set. Simulated email logged.'
      };
    }

    try {
      console.info(`[EmailJS] Sending email to ${config.recipientEmail} via Service ${config.serviceId}...`);
      const response = await emailjs.send(
        config.serviceId,
        config.templateId,
        templateParams,
        config.publicKey
      );

      console.info('✨ [EmailJS] Success!', response.status, response.text);
      return { attempted: true, success: true, response };
    } catch (err) {
      console.error('❌ [EmailJS] Send Error:', err);
      return { attempted: true, success: false, error: err };
    }
  },

  /**
   * Dispatch payload to backend (/api/notify)
   */
  async dispatchBackendNotification(payload) {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api/notify';
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.info('Backend notification endpoint response:', response.status);
        return { attempted: true, success: false, status: response.status };
      }

      const data = await response.json();
      return { attempted: true, success: true, data };
    } catch (err) {
      console.info('Notification backend unreachable (will rely on EmailJS / local storage):', err.message);
      return { attempted: true, success: false, localOnly: true, error: err.message };
    }
  }
};

export default notificationService;
