import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export default function PhotoFrame({
  src,
  alt = 'Ashwini',
  caption,
  className = '',
  tilt = 0,
  aspectRatio = 'aspect-[4/5]',
  size = 'w-64 md:w-72',
  priority = false
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotate: tilt - 2 }}
      animate={{ opacity: 1, scale: 1, rotate: tilt }}
      whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className={`relative group bg-white/90 p-3 pb-5 rounded-2xl shadow-xl border border-white/60 backdrop-blur-md ${size} ${className}`}
      style={{
        boxShadow: '0 20px 35px -10px rgba(180, 140, 220, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.8) inset'
      }}
    >
      {/* Decorative Washi Tape / Pin */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-200/80 backdrop-blur-sm border border-pink-300/60 rounded-sm shadow-sm rotate-1 z-20 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-pink-400/80 shadow-inner" />
      </div>

      {/* Photo Container */}
      <div className={`relative overflow-hidden rounded-xl bg-gradient-to-tr from-pink-100 via-purple-50 to-indigo-100 ${aspectRatio} flex items-center justify-center`}>
        {!hasError ? (
          <>
            {!isLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-purple-50 animate-pulse text-purple-400">
                <Sparkles className="w-6 h-6 animate-spin text-pink-400" />
                <span className="text-xs font-medium mt-2">Loading photo...</span>
              </div>
            )}
            <img
              src={src}
              alt={alt}
              loading={priority ? 'eager' : 'lazy'}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          /* Elegant Fallback Placeholder */
          <div className="flex flex-col items-center justify-center p-6 text-center text-purple-500 bg-gradient-to-br from-pink-50 to-purple-100/70 h-full w-full">
            <div className="w-12 h-12 rounded-full bg-white/80 shadow-md flex items-center justify-center mb-2 text-pink-400">
              <ImageIcon className="w-6 h-6" />
            </div>
            <p className="font-handwriting text-xl text-purple-800 font-semibold">
              Ashwini's Portrait
            </p>
            <p className="text-[11px] text-purple-400 max-w-[160px] mt-1">
              Add your photo in <br/>
              <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded text-[10px]">{src}</code>
            </p>
          </div>
        )}

        {/* Subtle glass reflection overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 opacity-60" />
      </div>

      {/* Handwritten Caption */}
      {caption && (
        <div className="mt-3 text-center px-1">
          <p className="font-handwriting text-lg md:text-xl text-purple-900 leading-tight">
            {caption}
          </p>
        </div>
      )}
    </motion.div>
  );
}
