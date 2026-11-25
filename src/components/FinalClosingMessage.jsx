import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import notificationService from '../services/notificationService';

export default function FinalClosingMessage() {
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!hasNotified.current) {
      hasNotified.current = true;
      notificationService.notifyFinalCompletion().catch(() => {});
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4 relative z-10">
      
      {/* Soft Pink and Lavender Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-xl glass-panel bg-gradient-to-br from-pink-50/90 via-purple-50/85 to-indigo-50/90 rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-pink-200/80 text-center relative overflow-hidden"
        style={{
          boxShadow: '0 25px 60px -15px rgba(236, 72, 153, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8) inset'
        }}
      >
        {/* Decorative Floating Corner Stars */}
        <div className="absolute top-4 left-4 text-pink-400 animate-pulse">✨</div>
        <div className="absolute top-4 right-4 text-purple-400 animate-bounce">⭐</div>
        <div className="absolute bottom-4 left-6 text-purple-400 animate-spin">💫</div>
        <div className="absolute bottom-4 right-6 text-pink-400 animate-pulse">🌸</div>

        {/* Animated Cute Panda Avatar */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-pink-200 via-purple-100 to-pink-100 mb-5 shadow-inner border border-white"
        >
          <span className="text-4xl filter drop-shadow-[0_2px_8px_rgba(236,72,153,0.3)]">
            🐼
          </span>
        </motion.div>

        {/* Exact Message Content */}
        <div className="space-y-4 text-slate-800">
          <h3 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-pink-600">
            That's all, Ashu! ❤️
          </h3>

          <p className="text-base sm:text-lg font-medium text-purple-950/90 leading-relaxed">
            I hope this little surprise made you smile.
          </p>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            No matter how much I tease you, I'm genuinely happy to have you in my life. Keep smiling, keep being your crazy panda self, and never forget how special you are.
          </p>

          <p className="font-serif-title text-lg sm:text-xl font-bold text-pink-600 pt-2">
            Happy Birthday once again, Ashwini! 🐼💗
          </p>

          {/* Sign-off */}
          <div className="pt-4 border-t border-pink-200/60 mt-4">
            <p className="font-handwriting text-2xl sm:text-3xl text-purple-900 font-bold">
              — Your favourite professional disturber.
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
