import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const pseudoRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function FloatingParticles({ count = 18, theme = 'light' }) {
  const particles = useMemo(() => {
    const items = [];
    const symbols = ['🌸', '✨', '🦋', '⭐', '🌸', '✨', '💫', '🌸'];
    for (let i = 0; i < count; i++) {
      const r1 = pseudoRandom(i * 13 + 1);
      const r2 = pseudoRandom(i * 17 + 2);
      const r3 = pseudoRandom(i * 19 + 3);
      const r4 = pseudoRandom(i * 23 + 4);
      const r5 = pseudoRandom(i * 29 + 5);
      const r6 = pseudoRandom(i * 31 + 6);

      items.push({
        id: i,
        symbol: symbols[i % symbols.length],
        left: (r1 * 95) + '%',
        top: (r2 * 90) + '%',
        size: r3 * 12 + 14,
        duration: r4 * 8 + 8,
        delay: r5 * 5,
        opacity: r6 * 0.45 + 0.35,
        xOffset: (r1 - 0.5) * 80,
        yOffset: (r2 - 0.5) * 60
      });
    }
    return items;
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            x: 0,
            y: 0,
            rotate: 0
          }}
          animate={{
            opacity: [p.opacity * 0.5, p.opacity, p.opacity * 0.6],
            x: [0, p.xOffset, -p.xOffset, 0],
            y: [0, p.yOffset, -p.yOffset, 0],
            rotate: [0, 15, -15, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay
          }}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            fontSize: `${p.size}px`,
            filter: theme === 'dark' ? 'drop-shadow(0 0 8px rgba(255,200,240,0.6))' : 'drop-shadow(0 2px 6px rgba(220,180,240,0.4))'
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
}
