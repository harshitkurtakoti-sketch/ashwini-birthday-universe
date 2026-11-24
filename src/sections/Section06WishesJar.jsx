import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { wishesList } from '../data/wishesData';
import PhotoSlideshow from '../components/PhotoSlideshow';
import SectionNextButton from '../components/SectionNextButton';
import { photosConfig } from '../config/photos.config';
import audioService from '../services/audioService';
import notificationService from '../services/notificationService';
import progressService from '../services/progressService';

export default function Section06WishesJar({ progress, onUpdateProgress, onNext }) {
  const [activeWish, setActiveWish] = useState(null);
  const revealedWishIds = new Set(progress.wishesRevealed || []);
  const [customWishInput, setCustomWishInput] = useState('');
  const [isWishSaved, setIsWishSaved] = useState(false);

  const handleStarClick = (wish) => {
    audioService.playSparkle();
    setActiveWish(wish);

    const updated = new Set(revealedWishIds);
    updated.add(wish.id);
    onUpdateProgress({ wishesRevealed: Array.from(updated) });

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const handleSaveCustomWish = async (e) => {
    e.preventDefault();
    if (!customWishInput.trim()) return;

    audioService.playSuccessChime();
    setIsWishSaved(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#f472b6', '#c084fc', '#fbbf24']
    });

    await notificationService.submitWishMessage({
      author: 'Ashwini',
      message: customWishInput.trim()
    });

    setTimeout(() => {
      setCustomWishInput('');
      setIsWishSaved(false);
    }, 4000);
  };

  const isCompleted = progressService.isSectionComplete(5, progress);
  const incompleteHint = progressService.getIncompleteHint(5, progress);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100/90 text-pink-800 text-xs font-semibold mb-3 border border-pink-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-600" />
          <span>Chapter 06 • Celestial Wishes For Ashu 🐼✨</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
        >
          A Jar Full <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            of Birthday Wishes
          </span>
        </motion.h2>

        <p className="text-sm md:text-base text-purple-900/80 mt-2 font-normal">
          Click and reveal all 8 glowing stars inside the jar to unlock the Grand Finale!
        </p>

        <span className="inline-block mt-3 text-xs font-semibold px-3 py-1 bg-white/80 rounded-full text-purple-700 shadow-sm border border-purple-100">
          {revealedWishIds.size} of {wishesList.length} Wishes Revealed {revealedWishIds.size >= 8 ? '✓' : ''}
        </span>
      </div>

      {/* Main Container: The Glass Jar + Wishes Details + Photo Slideshow */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        
        {/* Left: Interactive Glass Wishing Jar */}
        <div className="relative flex flex-col items-center">
          {/* Cork Stopper */}
          <div className="w-24 h-6 bg-amber-200/90 rounded-t-lg border-2 border-amber-300 shadow-md -mb-1 z-20" />
          
          {/* Glass Jar Body */}
          <div className="relative w-64 sm:w-72 h-84 sm:h-96 rounded-[3rem] p-6 glass-panel bg-white/40 border-2 border-white/80 shadow-2xl flex flex-col justify-end items-center overflow-hidden">
            {/* Glass reflection highlights */}
            <div className="absolute top-4 left-6 w-4 h-3/4 rounded-full bg-white/40 blur-[1px]" />
            <div className="absolute top-8 right-6 w-2 h-1/2 rounded-full bg-white/20 blur-[1px]" />

            {/* Glowing base gradient */}
            <div className="absolute -bottom-10 inset-x-0 h-32 bg-gradient-to-t from-pink-300/40 via-purple-200/30 to-transparent blur-md pointer-events-none" />

            {/* Floating Clickable Stars inside the Jar */}
            <div className="absolute inset-0 p-6 flex flex-wrap items-center justify-center gap-3.5 z-10">
              {wishesList.map((wish, idx) => {
                const isRevealed = revealedWishIds.has(wish.id);
                return (
                  <motion.button
                    key={wish.id}
                    onClick={() => handleStarClick(wish)}
                    whileHover={{ scale: 1.25, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                      y: [0, (idx % 2 === 0 ? -6 : 6), 0],
                      x: [0, (idx % 3 === 0 ? 4 : -4), 0]
                    }}
                    transition={{
                      duration: 3 + (idx % 3),
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className={`relative p-3 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                      isRevealed
                        ? 'bg-gradient-to-tr from-pink-400 to-purple-500 text-white shadow-lg shadow-pink-400/50'
                        : 'bg-white/80 text-amber-500 hover:bg-amber-100 shadow-md'
                    }`}
                    title={wish.title}
                  >
                    <span className="text-xl sm:text-2xl">{wish.starEmoji}</span>
                    {!isRevealed && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full animate-ping" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <p className="relative z-10 text-[11px] font-bold uppercase tracking-widest text-purple-800 bg-white/80 px-3 py-1 rounded-full shadow-sm">
              Tap any star to open 🐼
            </p>
          </div>
        </div>

        {/* Center: Active Wish Card display */}
        <div className="flex-1 w-full max-w-md">
          {activeWish ? (
            <motion.div
              key={activeWish.id}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 text-left relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{activeWish.starEmoji}</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                      Wish #{activeWish.id}
                    </span>
                    <h4 className="font-serif-title text-xl font-bold text-slate-900 leading-tight">
                      {activeWish.title}
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => setActiveWish(null)}
                  className="p-1.5 rounded-full hover:bg-purple-100 text-purple-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {activeWish.text}
              </p>

              <div className="mt-6 pt-3 border-t border-purple-100 flex items-center justify-between text-xs text-purple-600">
                <span>With genuine belief in you</span>
                <span className="font-handwriting text-lg text-pink-600 font-bold">— Ashu's Disturber 🐼</span>
              </div>
            </motion.div>
          ) : (
            <div className="glass-panel-subtle rounded-3xl p-8 text-center text-purple-700 flex flex-col items-center justify-center min-h-[220px]">
              <Sparkles className="w-8 h-8 text-pink-400 mb-2 animate-bounce" />
              <p className="font-serif-title text-lg font-semibold text-purple-900">
                Stars Awaiting Your Touch
              </p>
              <p className="text-xs text-purple-600/80 max-w-xs mt-1">
                Tap on each star inside the jar to reveal all 8 birthday wishes.
              </p>
            </div>
          )}

          {/* Input Box: Add a Birthday Thought / Wish to the Jar */}
          <form onSubmit={handleSaveCustomWish} className="mt-5 w-full">
            <div className="glass-panel rounded-2xl p-2 pl-4 flex items-center gap-2 shadow-sm border border-white/80">
              <input
                type="text"
                value={customWishInput}
                onChange={(e) => setCustomWishInput(e.target.value)}
                placeholder="Drop a birthday wish or thought into the jar..."
                className="bg-transparent border-none text-xs sm:text-sm text-slate-800 focus:outline-none flex-1 placeholder:text-purple-400"
              />
              <button
                type="submit"
                disabled={!customWishInput.trim()}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  customWishInput.trim()
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                    : 'bg-purple-100 text-purple-300 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {isWishSaved && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Wish added to the celestial jar!
              </motion.p>
            )}
          </form>
        </div>

        {/* Right: Automatic Changing Photo Slideshow */}
        <div className="hidden lg:flex flex-col items-center">
          <PhotoSlideshow
            photos={photosConfig.wishes.slideshow}
            intervalMs={3500}
            tilt={-2}
            size="w-64"
          />
        </div>

      </div>

      {/* LOCKED/UNLOCKED STEP-BY-STEP NEXT BUTTON */}
      <SectionNextButton
        currentSection={5}
        isCompleted={isCompleted}
        incompleteHint={incompleteHint}
        onNext={onNext}
      />

    </div>
  );
}
