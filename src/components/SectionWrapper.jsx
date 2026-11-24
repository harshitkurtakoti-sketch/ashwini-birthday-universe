import React from 'react';
import { motion } from 'framer-motion';

export default function SectionWrapper({
  children,
  id,
  className = '',
  theme = 'dreamy' // 'dreamy' | 'sunset' | 'night'
}) {
  const backgrounds = {
    dreamy: 'bg-gradient-to-br from-pink-100/95 via-purple-100/85 to-indigo-100/95 text-slate-900',
    sunset: 'bg-gradient-to-br from-purple-100/95 via-pink-100/85 to-amber-100/75 text-slate-900',
    night: 'bg-gradient-to-b from-[#0e0c1f] via-[#1a1435] to-[#25153b] text-white'
  };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.02, y: -15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`min-h-screen w-full flex flex-col justify-start md:justify-center items-center relative pt-20 pb-20 px-3 sm:px-6 md:px-8 select-none overflow-x-hidden ${backgrounds[theme] || backgrounds.dreamy} ${className}`}
    >
      {/* Decorative ambient blurred glowing orbs */}
      <div className="absolute top-1/4 left-1/10 w-64 md:w-96 h-64 md:h-96 rounded-full bg-pink-300/25 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 right-1/10 w-72 md:w-[30rem] h-72 md:h-[30rem] rounded-full bg-purple-300/25 blur-3xl pointer-events-none -z-0" />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center my-auto">
        {children}
      </div>
    </motion.section>
  );
}
