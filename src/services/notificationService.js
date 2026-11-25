/**
 * Telegram Notification Client Service
 * Dispatches notifications exclusively to the secure Telegram serverless backend.
 * NO external databases or third-party email/SMS services.
 */

// Generate a random unique event ID for deduplication
const createEventId = (prefix = 'evt') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

class NotificationService {
  constructor() {
    this.hasNotifiedSecret = false;
    this.hasNotifiedFinal = false;
  }

  /**
   * Internal dispatcher sending to backend endpoint
   */
  async dispatch(payload) {
    const enrichedPayload = {
      ...payload,
      eventId: payload.eventId || createEventId(payload.type?.toLowerCase()),
      timestamp: payload.timestamp || new Date().toISOString()
    };

    try {
      const isLocal =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      const primaryEndpoint = isLocal
        ? '/api/telegram-notify'
        : '/.netlify/functions/telegram-notify';

      let response = await fetch(primaryEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        keepalive: true,
        body: JSON.stringify(enrichedPayload)
      });

      // Fallback to /api/telegram-notify if hosted on Vercel (where /.netlify/functions returns 404)
      if (!isLocal && response.status === 404) {
        response = await fetch('/api/telegram-notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          keepalive: true,
          body: JSON.stringify(enrichedPayload)
        });
      }

      if (!response.ok) {
        // Safe console log without leaking sensitive details
        console.warn(`[Notification] Server returned status ${response.status}`);
        return { success: false, status: response.status };
      }

      const data = await response.json();
      return { success: Boolean(data?.success), data };
    } catch (err) {
      // Gracefully handle network disconnect without disrupting Ashwini's experience
      console.warn('[Notification] Dispatch network error:', err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * 1. Secret Question: Successfully unlocked ("Bewadi")
   * Only called on correct answer; never called on failed attempts.
   */
  async notifySecretUnlocked(answer = 'Bewadi') {
    if (this.hasNotifiedSecret) return;
    this.hasNotifiedSecret = true;

    return await this.dispatch({
      type: 'SECRET_QUESTION',
      answer
    });
  }

  /**
   * 2. Quiz Answer: Dispatched after each submitted quiz question
   */
  async notifyQuizAnswer({ questionIndex, totalQuestions, questionText, selectedAnswer, isCorrect }) {
    return await this.dispatch({
      type: 'QUIZ_ANSWER',
      questionIndex,
      totalQuestions,
      questionText,
      selectedAnswer,
      isCorrect: Boolean(isCorrect)
    });
  }

  /**
   * 3. Quiz Completed: Final score & result tier
   */
  async notifyQuizCompleted({ score, total, resultTier, verdict }) {
    return await this.dispatch({
      type: 'QUIZ_COMPLETED',
      score,
      total,
      resultTier,
      verdict
    });
  }

  /**
   * 4. Personal Message or Wish from Star Jar
   */
  async notifyPersonalMessage({ author = 'Ashwini', message }) {
    return await this.dispatch({
      type: 'PERSONAL_MESSAGE',
      author,
      message
    });
  }

  /**
   * 5. Wall Permission Choice
   */
  async notifyWallPermission({ choice, detail }) {
    return await this.dispatch({
      type: 'WALL_PERMISSION',
      choice,
      detail
    });
  }

  /**
   * 6. Long Drive Decision (Initial Accept, Maybe/FOMO, or Final Decline)
   */
  async notifyLongDriveDecision({ decision, note }) {
    return await this.dispatch({
      type: 'LONG_DRIVE_DECISION',
      decision,
      note
    });
  }

  /**
   * 7. Long Drive RSVP Form submission (Date, Time, Playlist/Note)
   */
  async notifyLongDriveRSVP({ date, time, playlistOrNote }) {
    return await this.dispatch({
      type: 'LONG_DRIVE_RSVP',
      date,
      time,
      playlistOrNote
    });
  }

  /**
   * 8. Final Completion: Reaching Chapter 07 closing message
   */
  async notifyFinalCompletion() {
    if (this.hasNotifiedFinal) return;
    this.hasNotifiedFinal = true;

    return await this.dispatch({
      type: 'FINAL_COMPLETION'
    });
  }

  /**
   * 9. Chapter / Journey Progress (Video finished, Letter opened, Chapter entered)
   */
  async notifyChapterProgress({ chapter, action, detail }) {
    return await this.dispatch({
      type: 'CHAPTER_PROGRESS',
      chapter,
      action,
      detail
    });
  }

  // --- Backwards-compatible aliases for existing sections ---

  async submitLongDrive({ date, time, playlistOrNote }) {
    return await this.notifyLongDriveRSVP({ date, time, playlistOrNote });
  }

  async submitQuizResults({ score, total, resultTier, verdict }) {
    return await this.notifyQuizCompleted({ score, total, resultTier, verdict });
  }

  async submitWishMessage({ author, message }) {
    return await this.notifyPersonalMessage({ author, message });
  }

  async submitWallPermission(choice) {
    return await this.notifyWallPermission({ choice });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
