import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import PhotoSlideshow from '../components/PhotoSlideshow';
import { photosConfig } from '../config/photos.config';
import audioService from '../services/audioService';
import notificationService from '../services/notificationService';

export default function Section01Welcome({ onEnter }) {
  const [typedName, setTypedName] = useState('');
  const fullName = "Ashwini";

  // Typing animation for Ashwini's name
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullName.length) {
        setTypedName(fullName.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    audioService.playSparkle();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#c084fc', '#e879f9', '#fbcfe8']
    });
    notificationService.notifyChapterProgress({
      chapter: 'CHAPTER 01 • WELCOME',
      action: 'Clicked "Enter Your Surprise" and unlocked Chapter 02! 🌸'
    }).catch(() => {});
    onEnter();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-1 sm:px-4">
      
      {/* Top Cute Pill */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full glass-pill text-purple-900 text-[11px] sm:text-xs md:text-sm font-medium mb-4 sm:mb-6 shadow-sm border border-white/80 max-w-full"
      >
        <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin flex-shrink-0" />
        <span className="truncate sm:whitespace-normal">A Special Birthday Celebration Celebrating Our Unique Bond 🐼✨</span>
      </motion.div>

      {/* Main Grid: Automatic Photo Slideshow + Title */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-14 my-2 sm:my-4 max-w-4xl w-full">
        
        {/* Ashwini's Automatic Changing Photo Slideshow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative max-w-full"
        >
          <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-3xl blur-xl opacity-50 animate-pulse pointer-events-none" />
          <PhotoSlideshow
            photos={photosConfig.welcome.slideshow}
            intervalMs={3500}
            tilt={-2}
            size="w-56 sm:w-72 md:w-80"
          />
        </motion.div>

        {/* Cinematic Heading & Interactive Typing */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg w-full">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-pink-600 font-semibold tracking-wide uppercase text-[11px] sm:text-xs md:text-sm mb-1 sm:mb-2"
          >
            A Little Universe Made Just for You
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-serif-title text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight"
          >
            Happy Birthday, <br />
            <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent underline decoration-pink-300 decoration-wavy decoration-2">
              {typedName}
            </span>
            <span className="inline-block animate-pulse text-pink-500 ml-1">|</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-handwriting text-2xl sm:text-3xl text-purple-900/90 mt-2 sm:mt-3"
          >
            "{photosConfig.welcome.subtitle}" 🐼🌸
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs sm:text-sm md:text-base text-slate-700/80 mt-3 sm:mt-4 leading-relaxed max-w-md"
          >
            A dedicated place celebrating memories, inside jokes, and the unbreakable bond of someone who is undeniably one-of-a-kind.
          </motion.p>

          {/* Locked Step-by-Step Interactive Call To Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 sm:mt-8 w-full sm:w-auto"
          >
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white font-bold text-sm sm:text-base shadow-xl shadow-pink-500/30 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Enter Your Surprise</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <p className="text-[10px] sm:text-[11px] text-purple-700/70 mt-2 italic text-center sm:text-left">
              Click to unlock Chapter 02: 26 Reasons 🔒→🔓
            </p>
          </motion.div>

        </div>

      </div>

    </div>
  );
}
