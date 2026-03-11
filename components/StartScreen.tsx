'use client';

import { motion } from 'framer-motion';
import type { Difficulty } from '@/lib/types';

interface Props {
  highScore: number;
  onStart: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: { key: Difficulty; label: string; desc: string; color: string; glow: string }[] = [
  { key: 'easy',   label: 'Easy',   desc: 'Relaxed pace · few bombs',    color: 'from-green-500 to-emerald-600',   glow: '#22c55e' },
  { key: 'medium', label: 'Medium', desc: 'Balanced challenge',           color: 'from-yellow-500 to-orange-500',   glow: '#f59e0b' },
  { key: 'hard',   label: 'Hard',   desc: 'Fast & furious · many bombs',  color: 'from-red-500 to-pink-600',        glow: '#ef4444' },
];

// Floating fruit emojis for background decoration
const FLOATERS = ['🍉', '🍊', '🍎', '🍋', '🍇', '🍑', '🍍'];

export default function StartScreen({ highScore, onStart }: Props) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #04040f 0%, #0a0a22 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Floating background emojis */}
      {FLOATERS.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl select-none opacity-20"
          style={{
            left: `${(i / FLOATERS.length) * 90 + 5}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Logo */}
      <motion.div
        className="text-center mb-10"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <h1
          className="text-6xl sm:text-7xl font-black tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #a78bfa, #f472b6, #fb923c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 24px rgba(167,139,250,0.5))',
          }}
        >
          Fruit Ninja
        </h1>
        <p className="text-purple-400 mt-2 text-lg tracking-widest uppercase">
          Slice &amp; Score
        </p>

        {highScore > 0 && (
          <motion.p
            className="mt-3 text-yellow-400 font-semibold text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ textShadow: '0 0 10px rgba(250,204,21,0.5)' }}
          >
            🏆 Best: {highScore.toLocaleString()}
          </motion.p>
        )}
      </motion.div>

      {/* Difficulty buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 px-6 w-full max-w-md"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {DIFFICULTIES.map(({ key, label, desc, color, glow }) => (
          <motion.button
            key={key}
            onClick={() => onStart(key)}
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.96 }}
            className={`flex-1 py-4 px-4 rounded-2xl bg-gradient-to-br ${color} font-bold text-white shadow-lg text-center transition-shadow`}
            style={{ boxShadow: `0 4px 24px ${glow}55` }}
          >
            <div className="text-xl">{label}</div>
            <div className="text-xs opacity-75 font-normal mt-0.5">{desc}</div>
          </motion.button>
        ))}
      </motion.div>

      {/* Controls hint */}
      <motion.div
        className="mt-10 text-center text-purple-500 text-sm space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>🖱️ Click &amp; drag to slice &nbsp;|&nbsp; 📱 Swipe on mobile</p>
        <p>Avoid 💣 bombs! Missed fruits cost lives ❤️</p>
      </motion.div>
    </motion.div>
  );
}
