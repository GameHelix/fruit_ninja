'use client';

import { motion } from 'framer-motion';
import type { Difficulty } from '@/lib/types';

interface Props {
  score: number;
  difficulty: Difficulty;
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export default function PauseModal({ score, difficulty, onResume, onRestart, onMenu }: Props) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: 'rgba(4,4,15,0.75)',
        backdropFilter: 'blur(4px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-xs w-full mx-4 text-center shadow-2xl"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <h2
          className="text-4xl font-black mb-1"
          style={{
            background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Paused
        </h2>
        <p className="text-purple-500 text-sm uppercase tracking-widest mb-6">{difficulty} mode</p>

        <div className="text-3xl font-black text-white mb-6" style={{ textShadow: '0 0 12px rgba(167,139,250,0.5)' }}>
          {score.toLocaleString()} <span className="text-lg font-normal text-purple-400">pts</span>
        </div>

        <div className="flex flex-col gap-3">
          <motion.button
            onClick={onResume}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl font-bold text-black text-lg"
            style={{
              background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
              boxShadow: '0 4px 20px rgba(167,139,250,0.35)',
            }}
          >
            ▶ Resume
          </motion.button>

          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl font-bold text-purple-300 text-base border border-purple-800 hover:bg-purple-900/30 transition-colors"
          >
            Restart
          </motion.button>

          <motion.button
            onClick={onMenu}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl font-bold text-purple-500 text-sm hover:text-purple-300 transition-colors"
          >
            Main Menu
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
