'use client';

import { motion } from 'framer-motion';
import type { Difficulty } from '@/lib/types';

interface Props {
  score: number;
  highScore: number;
  isNewHigh: boolean;
  difficulty: Difficulty;
  onRestart: (difficulty: Difficulty) => void;
  onMenu: () => void;
}

export default function GameOverScreen({ score, highScore, isNewHigh, difficulty, onRestart, onMenu }: Props) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(127,0,0,0.35) 0%, rgba(4,4,15,0.92) 70%)',
        backdropFilter: 'blur(2px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Card */}
      <motion.div
        className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 max-w-sm w-full mx-4 text-center shadow-2xl"
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
      >
        {/* Title */}
        <motion.h2
          className="text-5xl font-black mb-1"
          style={{
            background: 'linear-gradient(135deg, #f87171, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 14px rgba(248,113,113,0.5))',
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Game Over
        </motion.h2>

        <p className="text-purple-400 text-sm uppercase tracking-widest mb-6">
          {difficulty} mode
        </p>

        {/* Score */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-5xl font-black text-white tabular-nums"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.6)' }}>
            {score.toLocaleString()}
          </div>
          <div className="text-purple-400 text-sm mt-1">points</div>
        </motion.div>

        {/* New high score badge */}
        {isNewHigh && (
          <motion.div
            className="mb-5 py-2 px-4 rounded-full inline-block"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              boxShadow: '0 0 20px rgba(251,191,36,0.4)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <span className="text-black font-bold text-sm">🏆 NEW HIGH SCORE!</span>
          </motion.div>
        )}

        {/* Best score */}
        {!isNewHigh && (
          <p className="text-yellow-500 text-sm mb-5">
            🏆 Best: {highScore.toLocaleString()}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <motion.button
            onClick={() => onRestart(difficulty)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl font-bold text-black text-lg"
            style={{
              background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
              boxShadow: '0 4px 20px rgba(167,139,250,0.4)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Play Again
          </motion.button>

          <motion.button
            onClick={onMenu}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl font-bold text-purple-300 text-base border border-purple-800 hover:bg-purple-900/30 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Main Menu
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
