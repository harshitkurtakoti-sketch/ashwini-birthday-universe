import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

export default function PhotoSlideshow({
  photos = [],
  intervalMs = 3500,
  tilt = 0,
  aspectRatio = 'aspect-[4/5]',
  size = 'w-64 md:w-72',
  className = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  // Automatic slideshow timer
  useEffect(() => {
    if (!photos || photos.length <= 1 || isPaused) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [photos, intervalMs, isPaused]);

  if (!photos || photos.length === 0) {
    return null;
  }

  const currentPhoto = photos[currentIndex];
  const isImageFailed = failedImages.has(currentPhoto?.src);

  const handleImageError = (src) => {
    setFailedImages((prev) => new Set(prev).add(src));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, rotate: tilt - 1 }}
      whileInView={{ opacity: 1, scale: 1, rotate: tilt }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, rotate: 0, y: -4 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative group bg-white/90 p-3 pb-5 rounded-2xl shadow-xl border border-white/60 backdrop-blur-md max-w-full ${size} ${className}`}
      style={{
        boxShadow: '0 20px 35px -10px rgba(180, 140, 220, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.8) inset'
      }}
    >
      {/* Decorative Washi Tape / Pin */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-200/80 backdrop-blur-sm border border-pink-300/60 rounded-sm shadow-sm rotate-1 z-20 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-pink-400/80 shadow-inner" />
      </div>

      {/* Photo Frame Container */}
      <div className={`relative overflow-hidden rounded-xl bg-gradient-to-tr from-pink-100 via-purple-50 to-indigo-100 ${aspectRatio} flex items-center justify-center`}>
        <AnimatePresence mode="wait">
          {!isImageFailed ? (
            <motion.div
              key={currentPhoto?.src || currentIndex}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={currentPhoto?.src}
                alt={currentPhoto?.alt || 'Ashwini portrait'}
                onError={() => handleImageError(currentPhoto?.src)}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            /* Elegant Pastel Placeholder */
            <div className="flex flex-col items-center justify-center p-6 text-center text-purple-500 bg-gradient-to-br from-pink-50 to-purple-100/70 h-full w-full">
              <div className="w-12 h-12 rounded-full bg-white/80 shadow-md flex items-center justify-center mb-2 text-pink-400">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="font-handwriting text-xl text-purple-800 font-semibold">
                Ashwini's Special Memory
              </p>
            </div>
          )}
        </AnimatePresence>

        {/* Subtle glass reflection overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 opacity-50 z-10" />

        {/* Subtle pause pill when hovering */}
        {photos.length > 1 && isPaused && (
          <div className="absolute top-2 right-2 z-20 bg-black/40 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full">
            Paused
          </div>
        )}
      </div>

      {/* Handwritten Caption & Slideshow Dots */}
      <div className="mt-3 text-center px-1">
        <p className="font-handwriting text-lg md:text-xl text-purple-900 leading-tight">
          {currentPhoto?.caption || "A moment to remember ✨"}
        </p>

        {photos.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {photos.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(dotIdx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  dotIdx === currentIndex
                    ? 'w-5 bg-gradient-to-r from-pink-500 to-purple-600'
                    : 'w-1.5 bg-purple-200 hover:bg-purple-300'
                }`}
                title={`Photo ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
