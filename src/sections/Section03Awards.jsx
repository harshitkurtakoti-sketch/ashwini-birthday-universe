import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Clock, Sparkles, Crown, Smile, Ghost, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { awardsList } from '../data/awardsData';
import PhotoSlideshow from '../components/PhotoSlideshow';
import SectionNextButton from '../components/SectionNextButton';
import { photosConfig } from '../config/photos.config';
import audioService from '../services/audioService';
import progressService from '../services/progressService';

const ICON_MAP = {
  Clock: Clock,
  Sparkles: Sparkles,
  Crown: Crown,
  Smile: Smile,
  Award: Award,
  Ghost: Ghost
};

export default function Section03Awards({ progress, onUpdateProgress, onNext }) {
  const viewedAwardIds = new Set(progress.awardsViewed || []);
  const [selectedAward, setSelectedAward] = useState(null);

  const handleInspectAward = (award) => {
    audioService.playSparkle();
    setSelectedAward(award);

    const updated = new Set(viewedAwardIds);
    updated.add(award.id);
    onUpdateProgress({ awardsViewed: Array.from(updated) });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleClaimAward = (awardId) => {
    audioService.playSuccessChime();
    const updated = new Set(viewedAwardIds);
    updated.add(awardId);
    onUpdateProgress({ awardsViewed: Array.from(updated) });

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#a855f7', '#fbbf24']
    });
  };

  const isCompleted = progressService.isSectionComplete(2, progress);
  const incompleteHint = progressService.getIncompleteHint(2, progress);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100/90 text-purple-800 text-xs font-semibold mb-3 border border-purple-200"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Chapter 03 • The Annual Bond Honors Ceremony 🐼🏆</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
        >
          The Official <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Certified Ashwini Awards
          </span>
        </motion.h2>

        <p className="text-sm md:text-base text-purple-900/80 mt-2 font-normal">
          Click and view each of the 6 official certificates to unlock the next chapter!
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 bg-white/80 rounded-full text-purple-700 shadow-sm border border-purple-100">
            {viewedAwardIds.size} of 6 Awards Inspected {viewedAwardIds.size >= 6 ? '✓' : ''}
          </span>
        </div>
      </div>

      {/* Main Container: Awards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
        {awardsList.map((award, idx) => {
          const IconComponent = ICON_MAP[award.icon] || Award;
          const isViewed = viewedAwardIds.has(award.id);

          return (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => handleInspectAward(award)}
              className={`cursor-pointer glass-panel rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between transition-all border ${
                isViewed ? 'border-emerald-300/80 bg-white/90' : 'border-white/80 hover:border-pink-300'
              }`}
            >
              {/* Ribbon Header Accent */}
              <div className={`h-2 -mx-5 -mt-5 mb-4 bg-gradient-to-r ${award.ribbonColor}`} />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-purple-700 shadow-inner">
                    <IconComponent className="w-5 h-5 text-pink-600" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200/60 uppercase">
                    {award.category}
                  </span>
                </div>

                <h3 className="font-serif-title text-lg font-bold text-slate-900 mb-1 leading-snug">
                  {award.title}
                </h3>
                <p className="text-xs text-purple-700/80 italic mb-3 font-medium">
                  {award.subtitle}
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {award.description}
                </p>
              </div>

              {/* Bottom Stamp & View Status */}
              <div className="mt-4 pt-3 border-t border-purple-100/80 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                  {award.stamp}
                </span>

                <span className="text-xs font-semibold flex items-center gap-1">
                  {isViewed ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Inspected ✓
                    </span>
                  ) : (
                    <span className="text-pink-600 hover:underline">
                      View Certificate →
                    </span>
                  )}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Automatic Changing Photo Slideshow */}
      <div className="w-full max-w-md mt-10 flex flex-col items-center">
        <PhotoSlideshow
          photos={photosConfig.awards?.slideshow || photosConfig.awardsSlideshow}
          intervalMs={3500}
          tilt={-1}
          size="w-64 sm:w-72"
        />
      </div>

      {/* DETAILED CERTIFICATE MODAL */}
      <AnimatePresence>
        {selectedAward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-b from-amber-50 via-white to-purple-50 rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-amber-200/80 text-center"
            >
              <button
                onClick={() => setSelectedAward(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="border-2 border-dashed border-amber-300 rounded-2xl p-6">
                <span className="text-[11px] font-bold tracking-widest text-amber-700 uppercase">
                  Official Bond Certificate of Excellence
                </span>

                <h3 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-1">
                  {selectedAward.title}
                </h3>
                <p className="text-xs text-purple-700 italic font-semibold mb-4">
                  Presented to the one and only Ashwini 🐼
                </p>

                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  {selectedAward.description}
                </p>

                <div className="p-3 bg-pink-50/80 rounded-xl border border-pink-200 text-xs text-pink-900 font-medium mb-5">
                  💡 <span className="font-bold">Official Fun Fact:</span> {selectedAward.funFact}
                </div>

                <div className="flex items-center justify-between border-t border-amber-200 pt-4">
                  <div className="text-left">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Signed By</p>
                    <p className="font-handwriting text-xl text-purple-900 font-bold leading-tight">
                      Your Favourite Professional Disturber
                    </p>
                  </div>

                  <div className="w-14 h-14 rounded-full border-2 border-amber-400 bg-amber-100 flex flex-col items-center justify-center rotate-[-12deg] shadow-sm">
                    <span className="text-[8px] font-extrabold text-amber-900 uppercase">SEAL</span>
                    <span className="text-[7px] text-amber-700">CERTIFIED</span>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => {
                      handleClaimAward(selectedAward.id);
                      setSelectedAward(null);
                    }}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-pink-500/30 transition-transform active:scale-95 cursor-pointer"
                  >
                    Accept & Mark As Inspected 🏆
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOCKED/UNLOCKED STEP-BY-STEP NEXT BUTTON */}
      <SectionNextButton
        currentSection={2}
        isCompleted={isCompleted}
        incompleteHint={incompleteHint}
        onNext={onNext}
      />

    </div>
  );
}
