'use client';

/**
 * HUD — Score, lives, combo and high-score overlay.
 * Positioned absolutely over the canvas.
 */

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  score: number;
  lives: number;
  combo: number;
  highScore: number;
  onPause: () => void;
  audioEnabled: boolean;
  onAudioToggle: () => void;
}

const HEART = '❤️';
const BROKEN = '🖤';

export default function HUD({
  score,
  lives,
  combo,
  highScore,
  onPause,
  audioEnabled,
  onAudioToggle,
}: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Top bar */}
      <div className="flex items-start justify-between px-4 pt-4">
        {/* Score */}
        <div className="flex flex-col items-start">
          <span className="text-xs text-purple-400 uppercase tracking-widest font-semibold">Score</span>
          <motion.span
            key={score}
            initial={{ scale: 1.3, color: '#fde047' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.2 }}
            className="text-3xl font-black text-white tabular-nums"
            style={{ textShadow: '0 0 12px rgba(167,139,250,0.8)' }}
          >
            {score.toLocaleString()}
          </motion.span>
        </div>

        {/* Lives */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-purple-400 uppercase tracking-widest font-semibold">Lives</span>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.span
                key={i}
                initial={false}
                animate={{ scale: i < lives ? 1 : 0.7, opacity: i < lives ? 1 : 0.3 }}
                className="text-xl"
              >
                {i < lives ? HEART : BROKEN}
              </motion.span>
            ))}
          </div>
        </div>

        {/* High score + controls */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-col items-end">
            <span className="text-xs text-purple-400 uppercase tracking-widest font-semibold">Best</span>
            <span
              className="text-xl font-bold text-yellow-400 tabular-nums"
              style={{ textShadow: '0 0 8px rgba(250,204,21,0.6)' }}
            >
              {highScore.toLocaleString()}
            </span>
          </div>
          {/* Buttons */}
          <div className="flex gap-2 pointer-events-auto">
            <button
              onClick={onAudioToggle}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-sm transition-colors"
              title={audioEnabled ? 'Mute' : 'Unmute'}
            >
              {audioEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={onPause}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-sm transition-colors"
              title="Pause"
            >
              ⏸
            </button>
          </div>
        </div>
      </div>

      {/* Combo indicator */}
      <AnimatePresence>
        {combo >= 2 && (
          <motion.div
            key={combo}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute left-1/2 top-20 -translate-x-1/2 text-center"
          >
            <div
              className="text-2xl font-black tracking-wider"
              style={{
                color: '#fde047',
                textShadow: '0 0 20px #facc15, 0 0 40px #facc15',
              }}
            >
              ×{combo} COMBO!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
