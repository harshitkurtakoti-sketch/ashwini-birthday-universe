import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Car, Moon, Stars, CheckCircle2, Music2, Heart, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';
import PhotoSlideshow from '../components/PhotoSlideshow';
import FinalClosingMessage from '../components/FinalClosingMessage';
import { photosConfig } from '../config/photos.config';
import audioService from '../services/audioService';
import notificationService from '../services/notificationService';

// Calculated outside component render to maintain pure render function
const minDateString = new Date().toISOString().split('T')[0];

export default function Section07Finale({ progress, onUpdateProgress }) {
  // Decision flow states: 'prompt' | 'form' | 'fomo' | 'confirmed' | 'declined'
  const [decisionState, setDecisionState] = useState(() => {
    if (progress.finaleSubmitted) {
      return progress.longDriveAccepted === false ? 'declined' : 'confirmed';
    }
    return 'prompt';
  });

  const [date, setDate] = useState('');
  const [time, setTime] = useState('Evening (Sunset vibes) 🌅');
  const [playlistOrNote, setPlaylistOrNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const timeOptions = [
    'Evening (Sunset vibes) 🌅',
    'Night (City lights & calm breeze) 🌃',
    'Midnight (Zero traffic & pure chaos) 🌙',
    'Panda Hour (Whenever I wake up) 🐼'
  ];

  const handleInitialChoice = (accepted) => {
    if (accepted) {
      audioService.playPop();
      setDecisionState('form');
      notificationService.notifyLongDriveDecision({
        decision: 'YES! Accepted the invitation ❤️'
      }).catch(() => {});
    } else {
      audioService.playPop();
      setDecisionState('fomo');
      notificationService.notifyLongDriveDecision({
        decision: 'Maybe / Not now — entered FOMO scene 😂'
      }).catch(() => {});
    }
  };

  const handleFinalDecline = async () => {
    audioService.playPop();
    setDecisionState('declined');
    onUpdateProgress({
      finaleSubmitted: true,
      longDriveAccepted: false
    });

    try {
      await notificationService.notifyLongDriveDecision({
        decision: 'Playfully declined for now 😂',
        note: 'Deal! No pressure, Ash. Maybe another day, another road, another memory. ❤️'
      });
    } catch (e) {
      console.warn('Decline record error:', e);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!date) {
      alert('Please select a preferred date for our drive, Ash!');
      return;
    }

    setIsSubmitting(true);
    audioService.playSuccessChime();

    const payload = {
      date,
      time,
      playlistOrNote: playlistOrNote.trim() || 'No specific playlist added'
    };

    setSubmittedData(payload);

    try {
      await notificationService.submitLongDrive(payload);
    } catch (err) {
      console.warn('Notification submit error:', err);
    }

    setIsSubmitting(false);
    setDecisionState('confirmed');
    onUpdateProgress({
      finaleSubmitted: true,
      longDriveAccepted: true
    });

    // Multi-stage celebration confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f472b6', '#c084fc', '#38bdf8', '#fbbf24']
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);
  };

  return (
    <div className="w-full flex flex-col items-center relative z-10 text-white">
      
      {/* Night Sky Header */}
      <div className="flex items-center gap-2 mb-2">
        <Moon className="w-5 h-5 text-amber-200 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-pink-300">
          The Grand Finale • Midnight Highway 🐼🚗
        </span>
        <Stars className="w-5 h-5 text-purple-300 animate-spin" />
      </div>

      {/* Main Title & Invitation */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-pink-400 font-semibold text-sm sm:text-base tracking-wide uppercase mb-1"
        >
          ONE LAST QUESTION, ASH...
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white"
        >
          So, you said you wanted a long drive... <br />
          <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
            CAN I JOIN YOU?
          </span>
        </motion.h2>

        <p className="text-sm sm:text-base text-purple-200/90 mt-3 font-normal max-w-lg mx-auto leading-relaxed">
          "Just a little drive, some music, random conversations and a beautiful memory."
        </p>
      </div>

      {/* Main Container: Dynamic Interactive Decision Stage + Photo Slideshow */}
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        
        {/* Left Side: Decision Stages */}
        <div className="flex-1 w-full max-w-lg">
          <AnimatePresence mode="wait">
            
            {/* STAGE 1: PROMPT YES / NO */}
            {decisionState === 'prompt' && (
              <motion.div
                key="prompt-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel-dark rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-400/30 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-4 border border-pink-400/40">
                  <Car className="w-8 h-8" />
                </div>

                <h3 className="font-serif-title text-2xl font-bold text-white mb-2">
                  What do you say, Ashu? 🐼
                </h3>

                <p className="text-xs sm:text-sm text-purple-200 mb-6">
                  A scenic drive with zero stress, good songs, and endless teasing. Will you let me join?
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => handleInitialChoice(true)}
                    className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-white font-bold text-sm shadow-xl shadow-pink-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Yes! Let's plan it! 🚗✨</span>
                  </button>

                  <button
                    onClick={() => handleInitialChoice(false)}
                    className="py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-[0.98] text-purple-200 hover:text-white font-semibold text-sm border border-purple-300/30 transition-all cursor-pointer"
                  >
                    <span>Not now / No 🙈</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: CINEMATIC PLAYFUL FOMO EXPERIENCE */}
            {decisionState === 'fomo' && (
              <motion.div
                key="fomo-card"
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -15 }}
                className="glass-panel-dark rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pink-400/50 text-left relative overflow-hidden"
              >
                {/* Floating Panda Icon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold tracking-widest text-pink-400 uppercase">
                    Panda Emergency Alert 🚨🐼
                  </span>
                  <span className="text-2xl animate-bounce">🚗✨</span>
                </div>

                <h3 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  WAIT… ASH! Are you sure, Bewadi? 🥺
                </h3>

                {/* Imagined Drive Moment */}
                <div className="my-4 p-4 rounded-2xl bg-white/10 border border-purple-300/30 text-purple-100 text-xs sm:text-sm space-y-2 leading-relaxed">
                  <p className="flex items-start gap-2">
                    <span>🌙</span>
                    <span>Imagine the cool night breeze on your face, your favourite songs blasting on the speakers, hot roadside tea & snacks...</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span>😂</span>
                    <span>Zero traffic, ridiculous inside jokes, deep conversations and pure unfiltered laughter with no judgement.</span>
                  </p>
                  <p className="pt-2 font-handwriting text-xl text-pink-300 font-bold border-t border-white/15">
                    "That would've been one beautiful memory." 🌸
                  </p>
                </div>

                {/* Second Chance Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      audioService.playSuccessChime();
                      setDecisionState('form');
                      notificationService.notifyLongDriveDecision({
                        decision: "Reconsidered in FOMO: Okay fine, let's plan it! ❤️"
                      }).catch(() => {});
                    }}
                    className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-xl shadow-pink-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-white text-white" />
                    <span>Okay fine, let's plan it! ❤️</span>
                  </button>

                  <button
                    onClick={handleFinalDecline}
                    className="py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-purple-200 hover:text-white font-semibold text-xs sm:text-sm border border-purple-300/30 transition-all cursor-pointer"
                  >
                    <span>Still not now 😂</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: DATE & TIME PLANNING FORM */}
            {decisionState === 'form' && (
              <motion.form
                key="form-card"
                onSubmit={handleSubmitForm}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel-dark rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-400/30 text-left"
              >
                <h3 className="font-serif-title text-xl font-bold text-white mb-5 flex items-center gap-2">
                  <Car className="w-5 h-5 text-pink-400" />
                  <span>Plan Our Long Drive</span>
                </h3>

                {/* Date Selection */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-purple-200 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <span>Choose Your Preferred Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={minDateString}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-purple-300/30 text-white text-sm focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>

                {/* Time Selection */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-purple-200 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    <span>Select Time Window *</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {timeOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setTime(opt)}
                        className={`text-left p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          time === opt
                            ? 'bg-gradient-to-r from-pink-500/80 to-purple-600/80 border-pink-300 text-white shadow-sm'
                            : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/10'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Music / Note */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-purple-200 mb-1.5 flex items-center gap-1.5">
                    <Music2 className="w-3.5 h-3.5 text-pink-400" />
                    <span>Playlist Requests or Notes (Optional)</span>
                  </label>
                  <textarea
                    rows="3"
                    value={playlistOrNote}
                    onChange={(e) => setPlaylistOrNote(e.target.value)}
                    placeholder="Drop your favorite songs, snack requests, or rules for the car..."
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-purple-300/30 text-white text-sm placeholder:text-purple-300/50 focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-white font-bold text-sm shadow-xl shadow-pink-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>{isSubmitting ? 'Locking in the plans...' : 'Confirm Our Long Drive! 🚗✨'}</span>
                </button>
              </motion.form>
            )}

            {/* STAGE 4: ACCEPTED CONFIRMATION BOX */}
            {decisionState === 'confirmed' && (
              <motion.div
                key="confirmed-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel-dark rounded-3xl p-8 shadow-2xl border-2 border-pink-400/50 text-center relative overflow-hidden"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 mb-4 border border-pink-400/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
                  Invitation Accepted!
                </span>

                <h3 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-3">
                  "It's a date then, Ash! <br />
                  <span className="text-pink-300">Now don't be late like your replies!"</span>
                </h3>

                <div className="my-5 p-4 rounded-2xl bg-white/10 border border-white/20 text-left text-xs sm:text-sm text-purple-200 space-y-2">
                  <p><span className="text-pink-300 font-semibold">📅 Date:</span> {submittedData?.date || 'Confirmed'}</p>
                  <p><span className="text-pink-300 font-semibold">⏰ Time:</span> {submittedData?.time || 'Scheduled'}</p>
                  {submittedData?.playlistOrNote && (
                    <p><span className="text-pink-300 font-semibold">🎵 Note:</span> "{submittedData?.playlistOrNote}"</p>
                  )}
                </div>

                <p className="text-xs text-purple-300 italic">
                  Your response is saved and dispatched to Harshit's phone and email! Get ready for good tunes and nonstop teasing! 🌸🐼
                </p>
              </motion.div>
            )}

            {/* STAGE 5: GENTLE RESPECTFUL DECLINE BOX */}
            {decisionState === 'declined' && (
              <motion.div
                key="declined-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel-dark rounded-3xl p-8 shadow-2xl border-2 border-purple-400/40 text-center relative overflow-hidden"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 text-purple-300 mb-4 border border-purple-400/40">
                  <Smile className="w-8 h-8" />
                </div>

                <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-white mb-2 leading-relaxed">
                  "Deal! No pressure, Ash. <br />
                  <span className="text-pink-300">Maybe another day, another road, another memory. ❤️"</span>
                </h3>

                <p className="text-xs text-purple-200/90 mt-3 font-normal max-w-sm mx-auto">
                  Our bond is about being 100% comfortable without any expectations. Scroll down below for your final birthday note! 🐼🌸
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Side: Automatic Changing Photo Slideshow */}
        <div className="flex flex-col items-center">
          <PhotoSlideshow
            photos={photosConfig.finale.slideshow}
            intervalMs={3500}
            tilt={2}
            size="w-64 sm:w-72"
          />
        </div>

      </div>

      {/* Cinematic Animated Road & Moving Car Illustration */}
      <div className="w-full max-w-4xl mt-12 overflow-hidden relative pt-6 pb-2">
        <div className="absolute inset-x-0 bottom-10 h-16 bg-gradient-to-t from-pink-500/10 via-purple-500/10 to-transparent blur-sm pointer-events-none" />

        <div className="relative w-full h-14">
          <motion.div
            animate={{ x: ['-20%', '110%'] }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute -top-3 flex items-center gap-1 text-pink-300"
          >
            <div className="flex flex-col items-center">
              <span className="text-xs font-handwriting text-pink-200">Ash & Harshit 🐼🚗</span>
              <Car className="w-9 h-9 text-pink-400 filter drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
            </div>
          </motion.div>
        </div>

        <div className="w-full h-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-full border-t border-purple-500/40 relative overflow-hidden flex items-center justify-around">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="flex gap-8 w-[200%]"
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="inline-block w-8 h-1 bg-amber-300/80 rounded-full flex-shrink-0" />
            ))}
          </motion.div>
        </div>
      </div>

      {/* FINAL CLOSING MESSAGE: Revealed once either confirmed or declined */}
      {(decisionState === 'confirmed' || decisionState === 'declined') && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full mt-10"
        >
          <FinalClosingMessage />
        </motion.div>
      )}

    </div>
  );
}
