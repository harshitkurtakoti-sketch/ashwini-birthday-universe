import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import PhotoSlideshow from '../components/PhotoSlideshow';
import SectionNextButton from '../components/SectionNextButton';
import { photosConfig } from '../config/photos.config';
import audioService from '../services/audioService';
import notificationService from '../services/notificationService';
import progressService from '../services/progressService';

export default function Section04Letter({ progress, onUpdateProgress, onNext }) {
  const [isOpen, setIsOpen] = useState(Boolean(progress.letterOpened));
  const isLetterOpen = isOpen || Boolean(progress.letterOpened);

  const handleOpenEnvelope = () => {
    audioService.playRustle();
    setIsOpen(true);
    onUpdateProgress({ letterOpened: true });
    notificationService.notifyChapterProgress({
      chapter: 'CHAPTER 04 • PERSONAL LETTER',
      action: 'Broke the wax seal and opened your letter! 💌'
    }).catch(() => {});
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#e879f9', '#c084fc']
    });
  };

  const isCompleted = progressService.isSectionComplete(3, progress);
  const incompleteHint = progressService.getIncompleteHint(3, progress);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100/90 text-pink-800 text-xs font-semibold mb-3 border border-pink-200"
        >
          <Mail className="w-3.5 h-3.5 text-pink-600" />
          <span>Chapter 04 • From the Heart 💌</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
        >
          A Letter <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            For You, Ash
          </span>
        </motion.h2>

        <p className="text-sm md:text-base text-purple-900/80 mt-2 font-normal">
          Click the wax seal to open and read your personal letter to unlock the next chapter.
        </p>
      </div>

      {/* Main Layout: Envelope/Letter + Photo Slideshow */}
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        
        {/* Left/Main: Animated Envelope or Unfolded Letter */}
        <div className="flex-1 w-full max-w-xl">
          {!isLetterOpen ? (
            /* Closed Interactive Envelope */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleOpenEnvelope}
              className="cursor-pointer relative group rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 shadow-2xl border-2 border-pink-200/80 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Wax Seal Visual */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/40 mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-white/60">
                <Heart className="w-9 h-9 fill-white/90 text-white animate-pulse" />
              </div>

              <span className="font-handwriting text-2xl text-purple-900 font-semibold mb-1">
                For: Ashwini (Ashu 🐼)
              </span>
              <p className="text-xs text-purple-600 font-medium">
                Tap wax seal to break & read letter 💌
              </p>

              <div className="mt-8 px-6 py-2 rounded-full bg-white/80 text-pink-600 font-semibold text-xs shadow-sm flex items-center gap-2 group-hover:bg-white transition-colors">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>Open Letter</span>
              </div>
            </motion.div>
          ) : (
            /* Open Letter Experience */
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative rounded-3xl p-5 sm:p-10 max-h-[68vh] sm:max-h-[75vh] overflow-y-auto bg-white shadow-2xl border border-pink-100/80 text-slate-800"
              style={{
                boxShadow: '0 25px 50px -12px rgba(180, 130, 220, 0.25)'
              }}
            >
              {/* Top Letter Header */}
              <div className="flex items-center justify-between border-b border-pink-100 pb-4 mb-6">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-pink-600 uppercase">
                    Personal Note to Ashu 🐼
                  </span>
                  <p className="font-serif-title text-xl font-bold text-slate-900">
                    Dear Ash,
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-purple-500 font-medium">
                    Today & Always ✨
                  </span>
                </div>
              </div>

              {/* Exact Letter Content */}
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
                <p className="font-medium text-pink-600">
                  First of all, HAPPY BIRTHDAY!
                </p>

                <p>
                  I don't know how to make this sound perfect, but I just want you to know something.
                </p>

                <p className="bg-pink-50/80 p-3.5 rounded-2xl border-l-4 border-pink-400 text-purple-950 italic">
                  You don't have to explain every little thing or pretend to be okay all the time. Whenever things get difficult, remember that you have a friend who's ready to listen.
                </p>

                <p className="font-semibold text-purple-900">
                  No judgement, no pressure.
                </p>

                <p>
                  I know everyone has their own battles, and I might not always know exactly what you're going through, but I'll always be willing to listen whenever you need someone.
                </p>

                <p>
                  And yes, I'll keep disturbing you, teasing you, calling you Ashu and Bewadi, and reminding you that you're basically a panda.
                </p>

                <p>
                  Never stop smiling, never stop being yourself, and never think that you aren't capable of achieving wonderful things.
                </p>

                <p>
                  I genuinely wish you happiness, success, peace and countless beautiful moments ahead.
                </p>

                <p className="font-semibold text-slate-900">
                  Happy Birthday once again, Ash!
                </p>
              </div>

              {/* Sign-off */}
              <div className="mt-8 pt-4 border-t border-purple-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-500 font-medium">Forever in your corner,</p>
                  <p className="font-handwriting text-2xl text-purple-900 font-bold">
                    — Your favourite professional disturber.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Ashwini's Automatic Changing Photo Slideshow */}
        <div className="flex flex-col items-center">
          <PhotoSlideshow
            photos={photosConfig.letter.slideshow}
            intervalMs={3500}
            tilt={2}
            size="w-64 sm:w-72"
          />
        </div>

      </div>

      {/* LOCKED/UNLOCKED STEP-BY-STEP NEXT BUTTON */}
      <SectionNextButton
        currentSection={3}
        isCompleted={isCompleted}
        incompleteHint={incompleteHint}
        onNext={onNext}
      />

    </div>
  );
}
