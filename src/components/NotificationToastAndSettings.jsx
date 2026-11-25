import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * NotificationToastAndSettings
 * Clean toast notification popup — no admin dashboard, no EmailJS config modal.
 * Just shows subtle confirmation toasts when Telegram notifications fire.
 */
export default function NotificationToastAndSettings() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleNotification = (event) => {
      const { payload } = event.detail || {};
      let title = 'Saved ✨';
      let subtitle = 'Notification captured.';

      if (payload?.type === 'LONG_DRIVE_RSVP') {
        title = '🚗 Long Drive RSVP Sent!';
        subtitle = `Date: ${payload.date} (${payload.time})`;
      } else if (payload?.type === 'QUIZ_COMPLETED') {
        title = '🎯 Quiz Results Sent!';
        subtitle = `Score: ${payload.score}/${payload.total}`;
      } else if (payload?.type === 'PERSONAL_MESSAGE' || payload?.type === 'WISHING_JAR_MESSAGE') {
        title = '🌟 Wish Sent!';
        subtitle = `"${payload.message?.slice(0, 40)}..."`;
      } else if (payload?.type === 'WALL_PERMISSION') {
        title = '🖼️ Wall Permission Answered!';
        subtitle = payload.choice;
      } else if (payload?.type === 'SECRET_QUESTION') {
        title = '💗 Secret Unlocked!';
        subtitle = 'Bewadi magic detected 🐼';
      } else if (payload?.type === 'FINAL_COMPLETION') {
        title = '✨ Journey Complete!';
        subtitle = 'All chapters explored!';
      }

      setToast({ title, subtitle, time: Date.now() });

      setTimeout(() => {
        setToast((curr) => (curr && Date.now() - curr.time >= 4000 ? null : curr));
      }, 4500);
    };

    window.addEventListener('birthday-universe-notification', handleNotification);
    return () => window.removeEventListener('birthday-universe-notification', handleNotification);
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="fixed bottom-4 right-4 z-[200] max-w-xs w-full"
        >
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-pink-200/70 p-4 flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-md flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{toast.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{toast.subtitle}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
