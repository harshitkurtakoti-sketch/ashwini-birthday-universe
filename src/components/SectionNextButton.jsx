import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import audioService from '../services/audioService';

const CHAPTER_NAMES = [
  "Welcome to Your Universe",
  "26 Reasons Why You're Special",
  "Certified Ashwini Awards",
  "A Letter For You",
  "The Bond Quiz",
  "A Jar Full of Wishes",
  "The Grand Finale"
];

export default function SectionNextButton({
  currentSection,
  isCompleted,
  incompleteHint,
  onNext
}) {
  const nextSectionIndex = currentSection + 1;
  const nextChapterTitle = CHAPTER_NAMES[nextSectionIndex] || "Next Chapter";

  const handleNextClick = () => {
    if (!isCompleted) return;
    audioService.playSuccessChime();
    onNext();
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8 sm:mt-12 mb-4 px-2 sm:px-4 flex flex-col items-center select-none">
      {isCompleted ? (
        /* UNLOCKED & READY */
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Chapter Complete! You can now proceed 🐼✨</span>
          </div>

          <motion.button
            onClick={handleNextClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 sm:py-4 px-4 sm:px-8 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm md:text-base shadow-xl shadow-pink-500/35 hover:shadow-pink-500/50 cursor-pointer flex items-center justify-center gap-2 sm:gap-3 transition-all relative overflow-hidden"
          >
            <Sparkles className="w-4 h-4 animate-spin text-pink-200 flex-shrink-0" />
            <span className="truncate sm:whitespace-normal">Proceed to Chapter 0{nextSectionIndex + 1}: {nextChapterTitle}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse flex-shrink-0" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </motion.button>
        </motion.div>
      ) : (
        /* LOCKED HINT */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full p-3.5 sm:p-4 rounded-2xl glass-panel bg-white/70 border border-purple-200/60 shadow-sm flex items-center justify-between gap-2.5 sm:gap-3 text-left"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-purple-900 uppercase tracking-wide">
                Next Chapter Locked 🔒
              </p>
              <p className="text-[11px] sm:text-xs text-purple-700/90 font-medium truncate sm:whitespace-normal">
                {incompleteHint}
              </p>
            </div>
          </div>

          <button
            disabled
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gray-200 text-gray-400 font-semibold text-[11px] sm:text-xs cursor-not-allowed flex-shrink-0"
          >
            Locked
          </button>
        </motion.div>
      )}
    </div>
  );
}
