import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Sparkles, VolumeX, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import audioService from '../services/audioService';
import notificationService from '../services/notificationService';

export default function SecretEntryGate({ onComplete }) {
  const [stage, setStage] = useState('question'); // 'question' | 'unlocking' | 'video' | 'ready'
  const [inputAnswer, setInputAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef(null);

  const handleUnlock = (e) => {
    e.preventDefault();
    const cleanAnswer = inputAnswer.trim().toLowerCase();

    if (cleanAnswer === 'bewadi') {
      // Correct!
      audioService.playSuccessChime();
      setErrorMsg('');
      setStage('unlocking');

      // Notify Harshit via Telegram (only on correct answer)
      notificationService.notifySecretUnlocked(inputAnswer.trim()).catch(() => {});

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#c084fc', '#fbbf24', '#38bdf8']
      });

      // Advance to video intro after short celebration
      setTimeout(() => {
        setStage('video');
      }, 1600);
    } else {
      // Incorrect!
      audioService.playPop();
      setIsShaking(true);
      setErrorMsg("Oops! That's not the secret name, Ashu! Try again 😂🐼");
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  // Video Autoplay handling when entering video stage
  useEffect(() => {
    if (stage === 'video' && videoRef.current) {
      const vid = videoRef.current;
      vid.muted = false; // Attempt autoplay with audio first

      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Browser blocked autoplay with sound; falling back to muted playback:', err);
          vid.muted = true;
          setIsMuted(true);
          vid.play().catch((playErr) => {
            console.error('Video playback failed:', playErr);
            setVideoError(true);
          });
        });
      }
    }
  }, [stage]);

  const toggleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const handleVideoEnded = () => {
    audioService.playSparkle();
    setStage('ready');
    notificationService.notifyChapterProgress({
      chapter: 'VIDEO INTRO',
      action: 'Finished watching your special video intro! 🎬💗'
    }).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-[100] w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 select-none overflow-hidden px-4">
      {/* Background Floating Ambient Pandas and Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -18, 0], x: [0, 10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-8 text-4xl filter drop-shadow-[0_4px_10px_rgba(244,114,182,0.4)]"
        >
          🐼🌸
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, -8, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-16 left-12 text-3xl filter drop-shadow-[0_4px_10px_rgba(192,132,252,0.4)]"
        >
          🐼💤
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-16 right-10 text-3xl filter drop-shadow-[0_4px_10px_rgba(244,114,182,0.4)]"
        >
          🐼💖
        </motion.div>
        <motion.div
          animate={{ y: [0, -14, 0], x: [0, -8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-12 right-12 text-4xl filter drop-shadow-[0_4px_10px_rgba(168,85,247,0.4)]"
        >
          🎈🐼
        </motion.div>
      </div>

      {/* STAGE 1: SECRET QUESTION SCREEN */}
      {stage === 'question' && (
        <motion.div
          key="question-box"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: isShaking ? [-12, 12, -8, 8, -4, 4, 0] : 0
          }}
          transition={{
            duration: isShaking ? 0.45 : 0.6,
            ease: 'easeOut'
          }}
          className="relative w-full max-w-lg glass-panel bg-white/85 rounded-3xl p-7 sm:p-10 shadow-2xl border-2 border-pink-200/90 text-center z-10"
          style={{
            boxShadow: '0 25px 60px -12px rgba(236, 72, 153, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.9) inset'
          }}
        >
          {/* Top Lock Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 to-purple-600 text-white mb-4 shadow-lg shadow-pink-500/30">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold tracking-widest text-pink-600 uppercase">
            Top Secret Access Gate 🔒
          </span>

          <h2 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-2 leading-tight">
            "What is the name only I can call you?" <span className="inline-block">🐼</span>
          </h2>

          <p className="text-xs sm:text-sm text-purple-900/80 mb-6 font-normal">
            Prove that it's really you, Ashwini! Type the special name below to unlock your birthday universe.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                autoFocus
                required
                value={inputAnswer}
                onChange={(e) => {
                  setInputAnswer(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Type the secret name here..."
                className="w-full py-4 px-5 rounded-2xl bg-white/90 border-2 border-purple-200 focus:border-pink-500 text-slate-900 text-center font-semibold text-base sm:text-lg tracking-wide placeholder:text-purple-300 focus:outline-none shadow-inner transition-colors"
              />
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold"
              >
                {errorMsg}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-xl shadow-pink-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 animate-spin text-pink-200" />
              <span>Unlock My Surprise</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="font-handwriting text-xl text-purple-900 font-bold mt-5">
            "Hint: You act like this animal when you take naps..." 🐼💤
          </p>
        </motion.div>
      )}

      {/* STAGE 1.5: UNLOCKING ANIMATION */}
      {stage === 'unlocking' && (
        <motion.div
          key="unlocking-card"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="relative w-full max-w-md glass-panel bg-white/90 rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-emerald-300 text-center z-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner">
            <Unlock className="w-10 h-10 animate-bounce" />
          </div>

          <h3 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Hehe! You got it right, Bewadi! 💗
          </h3>

          <p className="text-sm text-purple-900 font-medium">
            Starting your special birthday video intro now... 🎬✨
          </p>
        </motion.div>
      )}

      {/* STAGE 2: CINEMATIC VIDEO INTRO */}
      {stage === 'video' && (
        <motion.div
          key="video-frame"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 w-full h-full bg-black/95 flex flex-col items-center justify-center p-2 sm:p-6"
        >
          {/* Top Subtle Status Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between mb-3 px-2 text-white/90">
            <span className="text-xs font-semibold tracking-wider uppercase text-pink-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
              <span>Ashwini's Birthday Video Intro 🎬</span>
            </span>

            {/* Tap to Unmute Button if browser muted autoplay */}
            {isMuted && (
              <button
                onClick={toggleUnmute}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-lg animate-pulse cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Tap to Unmute 🔊</span>
              </button>
            )}
          </div>

          {/* Cinematic Video Container */}
          <div className="relative w-full max-w-4xl max-h-[82vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-pink-500/30 bg-black flex items-center justify-center">
            {!videoError ? (
              <video
                ref={videoRef}
                src="/videos/ashwini-intro.mp4"
                playsInline
                autoPlay
                onEnded={handleVideoEnded}
                onError={() => setVideoError(true)}
                className="w-full h-full max-h-[82vh] object-contain rounded-2xl"
              />
            ) : (
              /* Fallback if video file cannot be decoded by browser */
              <div className="p-8 sm:p-12 text-center text-white flex flex-col items-center">
                <span className="text-4xl mb-3">🎬</span>
                <h4 className="font-serif-title text-xl sm:text-2xl font-bold text-pink-300 mb-2">
                  Special Video Intro Ready!
                </h4>
                <p className="text-xs sm:text-sm text-purple-200 max-w-md mb-6">
                  Your video is located at <code>public/videos/ashwini-intro.mp4</code>.
                </p>
                <button
                  onClick={handleVideoEnded}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-lg hover:brightness-110 cursor-pointer"
                >
                  Continue to Birthday Universe →
                </button>
              </div>
            )}
          </div>

          <p className="text-[11px] text-purple-300/70 mt-3 italic text-center">
            Sit back and enjoy! The surprise will open right as the video ends. 🐼💗
          </p>
        </motion.div>
      )}

      {/* STAGE 3: TRANSITION TO WEBSITE */}
      {stage === 'ready' && (
        <motion.div
          key="ready-card"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md glass-panel bg-white/90 rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-pink-200 text-center z-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-pink-200 to-purple-200 text-purple-900 mb-4 shadow-inner">
            <span className="text-4xl">🐼🌸</span>
          </div>

          <span className="text-[11px] font-bold tracking-widest text-pink-600 uppercase">
            Access Granted
          </span>

          <h3 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-2">
            A Little Universe Made Just for You
          </h3>

          <p className="text-sm text-purple-900/80 mb-6 font-normal">
            Ready to explore all 7 chapters of our madness, memories and bond?
          </p>

          <button
            onClick={() => {
              audioService.playSparkle();
              onComplete();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-white font-bold text-base shadow-xl shadow-pink-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-pink-200" />
            <span>Enter Your Surprise 💗</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
