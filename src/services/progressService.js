/**
 * PROGRESS & COMPLETION TRACKER
 * 
 * Manages section completion states, persistence in localStorage,
 * and ensures Ashwini cannot skip forward to incomplete sections.
 */

const STORAGE_KEY = 'ashwini_journey_progress_v2';

export const initialProgress = {
  // Secret Gate & Video Intro
  secretPassed: false,

  currentSection: 0,
  unlockedMaxSection: 0,
  
  // Section 1: Welcome
  welcomeCompleted: false,

  // Section 2: 26 Reasons
  reasonsRevealed: [], // array of IDs [1..26]
  wallPermissionAnswered: false,

  // Section 3: Crazy Awards
  awardsViewed: [], // array of award IDs viewed [award-1..award-6]

  // Section 4: Letter
  letterOpened: false,

  // Section 5: Quiz
  quizCompleted: false,
  quizAnswers: {},

  // Section 6: Wishes
  wishesRevealed: [], // array of wish IDs [1..8]

  // Section 7: Finale
  finaleSubmitted: false,
  longDriveAccepted: null // true | false
};

export const progressService = {
  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...initialProgress,
          ...parsed,
          reasonsRevealed: Array.isArray(parsed.reasonsRevealed) ? parsed.reasonsRevealed : [],
          awardsViewed: Array.isArray(parsed.awardsViewed) ? parsed.awardsViewed : [],
          wishesRevealed: Array.isArray(parsed.wishesRevealed) ? parsed.wishesRevealed : []
        };
      }
    } catch (e) {
      console.warn('Could not load progress from storage:', e);
    }
    return { ...initialProgress };
  },

  save(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Could not save progress:', e);
    }
  },

  isSectionComplete(sectionIndex, progress) {
    switch (sectionIndex) {
      case 0: // Welcome
        return Boolean(progress.welcomeCompleted);

      case 1: // 26 Reasons
        return (
          progress.reasonsRevealed &&
          progress.reasonsRevealed.length >= 26 &&
          Boolean(progress.wallPermissionAnswered)
        );

      case 2: // Awards
        return progress.awardsViewed && progress.awardsViewed.length >= 6;

      case 3: // Letter
        return Boolean(progress.letterOpened);

      case 4: // Quiz
        return Boolean(progress.quizCompleted);

      case 5: // Wishes
        return progress.wishesRevealed && progress.wishesRevealed.length >= 8;

      case 6: // Finale
        return Boolean(progress.finaleSubmitted);

      default:
        return false;
    }
  },

  getIncompleteHint(sectionIndex, progress) {
    switch (sectionIndex) {
      case 0:
        return 'Click "Enter Your Surprise" above to begin 🐼';

      case 1: {
        const count = progress.reasonsRevealed?.length || 0;
        const wall = Boolean(progress.wallPermissionAnswered);
        if (count < 26) {
          return `Reveal all cards (${count}/26 revealed)`;
        }
        if (!wall) {
          return 'Open the secret "Permission to Break the Wall?" card below 🔓';
        }
        return 'All reasons & secret card unlocked! ✨';
      }

      case 2: {
        const count = progress.awardsViewed?.length || 0;
        return `Inspect every award (${count}/6 viewed) 🏆`;
      }

      case 3:
        return 'Click the pink wax seal on the envelope to read your letter 💌';

      case 4:
        return 'Complete all 12 questions of the bond quiz 🎯';

      case 5: {
        const count = progress.wishesRevealed?.length || 0;
        return `Click and reveal all wishing stars (${count}/8 revealed) ⭐`;
      }

      case 6:
        return 'Confirm your response to the long drive invitation 🚗';

      default:
        return 'Complete the activities above to proceed';
    }
  }
};

export default progressService;
