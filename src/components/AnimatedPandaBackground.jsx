import React from 'react';
import { motion } from 'framer-motion';

/**
 * Adorable Animated Background Pandas
 * Features subtle, performant animated pandas:
 * - Waving panda with flower 🌸
 * - Sleeping panda floating on cloud 💤
 * - Rolling panda 🐼
 * - Walking / peeking panda
 * - Heart panda 💖
 */

export default function AnimatedPandaBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[5]">
      {/* 1. Floating & Waving Panda with Flower (Top-Left area) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: [0.65, 0.9, 0.65],
          y: [0, -18, 0],
          x: [0, 8, 0],
          rotate: [0, 4, -4, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-[12%] left-[4%] md:left-[6%] flex flex-col items-center select-none"
      >
        <div className="relative group">
          <span className="text-3xl md:text-4xl filter drop-shadow-[0_4px_10px_rgba(244,114,182,0.3)]">
            🐼
          </span>
          <motion.span
            animate={{ rotate: [-10, 20, -10] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1 -right-2 text-base"
          >
            🌸
          </motion.span>
        </div>
        <span className="text-[10px] font-handwriting text-pink-700/60 font-semibold bg-white/40 px-2 py-0.5 rounded-full backdrop-blur-xs mt-0.5">
          Ashu's Panda
        </span>
      </motion.div>

      {/* 2. Sleeping Cozy Panda (Right Side) */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [0, 3, 0]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5
        }}
        className="absolute top-[28%] right-[4%] md:right-[7%] flex flex-col items-center select-none opacity-70"
      >
        <div className="relative">
          <span className="text-3xl md:text-4xl filter drop-shadow-[0_4px_12px_rgba(192,132,252,0.35)]">
            🐼
          </span>
          <motion.span
            animate={{ opacity: [0, 1, 0], y: [-2, -12], x: [0, 6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
            className="absolute -top-2 -right-3 text-xs font-bold text-purple-600"
          >
            💤
          </motion.span>
        </div>
        <span className="text-[9px] font-medium text-purple-600/60 bg-white/40 px-2 py-0.5 rounded-full mt-0.5">
          nap mode
        </span>
      </motion.div>

      {/* 3. Rolling / Bouncing Panda (Mid Left) */}
      <motion.div
        animate={{
          x: [0, 35, 0],
          y: [0, -10, 0],
          rotate: [0, 360]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute top-[52%] left-[3%] md:left-[5%] text-2xl md:text-3xl opacity-60 filter drop-shadow-[0_4px_8px_rgba(236,72,153,0.25)] select-none"
      >
        🐼
      </motion.div>

      {/* 4. Panda Holding Heart (Mid Right) */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5
        }}
        className="absolute top-[68%] right-[5%] md:right-[8%] flex items-center gap-0.5 select-none opacity-75"
      >
        <span className="text-3xl md:text-4xl filter drop-shadow-[0_4px_10px_rgba(244,114,182,0.35)]">
          🐼
        </span>
        <motion.span
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-base md:text-lg -ml-1 text-pink-500"
        >
          💗
        </motion.span>
      </motion.div>

      {/* 5. Walking / Peeking Panda (Bottom Area) */}
      <motion.div
        animate={{
          x: [-20, 20, -20],
          y: [0, -6, 0]
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
        className="absolute bottom-[8%] left-[8%] md:left-[12%] flex flex-col items-center select-none opacity-65"
      >
        <span className="text-3xl md:text-4xl filter drop-shadow-[0_4px_10px_rgba(168,85,247,0.3)]">
          🐼
        </span>
        <span className="text-[9px] font-handwriting text-purple-700/60 font-bold bg-white/40 px-2 py-0.5 rounded-full mt-0.5">
          wandering panda
        </span>
      </motion.div>

      {/* 6. Night Sky Dreamy Balloon Panda (Bottom Right) */}
      <motion.div
        animate={{
          y: [0, -22, 0],
          rotate: [-4, 6, -4]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3
        }}
        className="absolute bottom-[18%] right-[4%] md:right-[6%] flex flex-col items-center select-none opacity-70"
      >
        <div className="flex items-center">
          <span className="text-2xl md:text-3xl">🎈</span>
          <span className="text-2xl md:text-3xl -ml-2">🐼</span>
        </div>
      </motion.div>
    </div>
  );
}
