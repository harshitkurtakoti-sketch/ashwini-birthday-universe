import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Key, Heart, Unlock, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { reasonsList, specialWallCard } from '../data/reasonsData';
import PhotoSlideshow from '../components/PhotoSlideshow';
import SectionNextButton from '../components/SectionNextButton';
import { photosConfig } from '../config/photos.config';
import audioService from '../services/audioService';
import notificationService from '../services/notificationService';
import progressService from '../services/progressService';

export default function Section02Reasons({ progress, onUpdateProgress, onNext }) {
  const revealedIds = new Set(progress.reasonsRevealed || []);
  const wallPermissionAnswered = Boolean(progress.wallPermissionAnswered);

  const [isWallModalOpen, setIsWallModalOpen] = useState(false);
  const [wallDecision, setWallDecision] = useState(null);

  const toggleReason = (id) => {
    audioService.playPop();
    const updated = new Set(revealedIds);
    if (updated.has(id)) {
      // Keep it revealed once opened for completion tracking
    } else {
      updated.add(id);
    }
    const newArray = Array.from(updated);
    onUpdateProgress({ reasonsRevealed: newArray });
  };

  const handleRevealAll = () => {
    audioService.playSparkle();
    const all = reasonsList.map(r => r.id);
    onUpdateProgress({ reasonsRevealed: all });
  };

  const handleOpenWallCard = () => {
    audioService.playSparkle();
    setIsWallModalOpen(true);
  };

  const handleWallPermissionChoice = (option) => {
    audioService.playSuccessChime();
    setWallDecision(option.response);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f472b6', '#ec4899', '#c084fc', '#fbbf24']
    });

    onUpdateProgress({ wallPermissionAnswered: true });
    notificationService.submitWallPermission(option.label);
  };

  const isCompleted = progressService.isSectionComplete(1, progress);
  const incompleteHint = progressService.getIncompleteHint(1, progress);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100/80 text-pink-700 text-xs font-semibold mb-3 border border-pink-200"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chapter 02 • 26 Chapters of Our Special Bond 🐼</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
        >
          26 Little Reasons <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Why You're Special
          </span>
        </motion.h2>

        <p className="text-sm md:text-base text-purple-900/80 mt-2 font-normal">
          Click every card and unlock the secret wall card below to complete this chapter.
        </p>

        {/* Counter and Action Buttons */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-xs font-semibold px-3 py-1 bg-white/80 rounded-full text-purple-700 shadow-sm border border-purple-100">
            {revealedIds.size} of 26 Unlocked {revealedIds.size >= 26 ? '✓' : ''}
          </span>
          <span className="text-xs font-semibold px-3 py-1 bg-white/80 rounded-full text-pink-700 shadow-sm border border-pink-100">
            Secret Wall: {wallPermissionAnswered ? 'Unlocked 🔓' : 'Pending 🔒'}
          </span>
          <button
            onClick={handleRevealAll}
            className="text-xs font-semibold px-3 py-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-700 rounded-full transition-colors border border-pink-200/60 cursor-pointer"
          >
            Reveal All Cards ✨
          </button>
        </div>
      </div>

      {/* Main Grid: Cards + Slideshow */}
      <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-8 mb-8">
        
        {/* The 26 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full flex-1">
          {reasonsList.map((reason) => {
            const isRevealed = revealedIds.has(reason.id);
            return (
              <motion.div
                key={reason.id}
                layout
                onClick={() => toggleReason(reason.id)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-300 border ${
                  isRevealed
                    ? 'glass-panel bg-white/85 border-pink-200/80 shadow-md'
                    : 'bg-white/50 hover:bg-white/70 border-white/60 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-700 font-bold text-xs">
                    {reason.id}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                    {reason.tag}
                  </span>
                </div>

                <div className="min-h-[64px] flex items-center">
                  {isRevealed ? (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm text-slate-800 font-medium leading-snug"
                    >
                      {reason.text}
                    </motion.p>
                  ) : (
                    <div className="w-full flex items-center justify-center py-2 text-purple-400 gap-1.5 text-xs font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
                      <span>Tap to reveal secret #{reason.id}</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-right">
                  <span className="text-[10px] text-purple-400 font-medium">
                    {isRevealed ? 'Revealed ✓' : 'Secret locked 🔒'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Automatic Changing Photo Slideshow */}
        <div className="hidden xl:flex flex-col items-center sticky top-24 self-start">
          <PhotoSlideshow
            photos={photosConfig.reasons.slideshow}
            intervalMs={3500}
            tilt={2}
            size="w-64"
          />
        </div>
      </div>

      {/* SPECIAL HIDDEN CARD: PERMISSION TO BREAK THE WALL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mt-4"
      >
        <div
          onClick={handleOpenWallCard}
          className={`cursor-pointer group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 border ${
            wallPermissionAnswered
              ? 'bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 text-white border-emerald-400/50 shadow-xl'
              : 'bg-gradient-to-r from-purple-900 via-indigo-950 to-pink-950 text-white border-pink-400/40 shadow-2xl hover:border-pink-300'
          }`}
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30 text-white flex-shrink-0">
                <Key className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-pink-300 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>Secret Chapter Requirement</span>
                  {wallPermissionAnswered && <span className="text-emerald-400">✓ Completed</span>}
                </span>
                <h3 className="font-serif-title text-xl md:text-2xl font-bold text-white mt-0.5">
                  PERMISSION TO BREAK THE WALL?
                </h3>
                <p className="text-xs text-purple-200/80 mt-1">
                  A private question from me to you. Tap to {wallPermissionAnswered ? 'view your response' : 'unlock and answer'}.
                </p>
              </div>
            </div>

            <button className="px-5 py-2.5 rounded-full bg-white text-purple-950 font-bold text-xs shadow-md group-hover:scale-105 transition-transform flex items-center gap-1.5 flex-shrink-0 cursor-pointer">
              <Unlock className="w-3.5 h-3.5 text-pink-600" />
              <span>{wallPermissionAnswered ? 'View Response' : 'Open Card'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* MODAL FOR BREAK THE WALL */}
      <AnimatePresence>
        {isWallModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl p-5 sm:p-8 shadow-2xl border border-pink-200"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsWallModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-100 text-pink-600 mb-4 shadow-inner">
                  <Heart className="w-7 h-7 text-pink-500" />
                </div>

                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {specialWallCard.title}
                </h3>

                <div className="my-5 p-5 rounded-2xl bg-white/80 border border-purple-100 shadow-sm">
                  <p className="text-base sm:text-lg text-purple-950/90 leading-relaxed font-normal italic">
                    "{specialWallCard.prompt}"
                  </p>
                </div>

                {!wallDecision && !wallPermissionAnswered ? (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    {specialWallCard.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleWallPermissionChoice(option)}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-sm shadow-md shadow-pink-500/20 active:scale-95 transition-all cursor-pointer"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold mt-4"
                  >
                    🎉 {wallDecision || 'Permission Granted! Always ready to listen, Ash.'}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOCKED/UNLOCKED STEP-BY-STEP NEXT BUTTON */}
      <SectionNextButton
        currentSection={1}
        isCompleted={isCompleted}
        incompleteHint={incompleteHint}
        onNext={onNext}
      />

    </div>
  );
}
