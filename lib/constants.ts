import type { FruitConfig } from './types';

// ─── Physics ──────────────────────────────────────────────────────────────────
export const GRAVITY = 0.28;          // pixels per frame²
export const OFFSCREEN_PAD = 80;      // remove objects once this far past edges

// ─── Lives & timing ───────────────────────────────────────────────────────────
export const MAX_LIVES = 3;
export const SLICE_DECAY_MS = 600;    // how long sliced halves stay visible
export const EXPLODE_DECAY_MS = 500;  // bomb explosion ring duration
export const TRAIL_MAX_AGE_MS = 120;  // slice trail fade time

// ─── Fruit catalogue ──────────────────────────────────────────────────────────
export const FRUITS: FruitConfig[] = [
  { name: 'watermelon', outerColor: '#16a34a', innerColor: '#f87171', glowColor: '#4ade80', radius: 44, points: 10 },
  { name: 'orange',     outerColor: '#ea580c', innerColor: '#fde68a', glowColor: '#fb923c', radius: 32, points: 15 },
  { name: 'apple',      outerColor: '#dc2626', innerColor: '#fca5a5', glowColor: '#f87171', radius: 30, points: 20 },
  { name: 'lemon',      outerColor: '#ca8a04', innerColor: '#fef9c3', glowColor: '#facc15', radius: 28, points: 15 },
  { name: 'grape',      outerColor: '#7c3aed', innerColor: '#ddd6fe', glowColor: '#a78bfa', radius: 26, points: 30 },
  { name: 'peach',      outerColor: '#db2777', innerColor: '#fbcfe8', glowColor: '#f472b6', radius: 30, points: 20 },
  { name: 'pineapple',  outerColor: '#a16207', innerColor: '#fef08a', glowColor: '#fde047', radius: 38, points: 25 },
];

// ─── Difficulty presets ───────────────────────────────────────────────────────
export const DIFFICULTY_SETTINGS = {
  easy: {
    spawnIntervalMs: 1900,
    minVy: -15, maxVy: -11,   // negative = upward
    minVx: -1.5, maxVx: 1.5,
    bombChance: 0.06,
    maxOnScreen: 5,
  },
  medium: {
    spawnIntervalMs: 1300,
    minVy: -18, maxVy: -13,
    minVx: -2.5, maxVx: 2.5,
    bombChance: 0.14,
    maxOnScreen: 7,
  },
  hard: {
    spawnIntervalMs: 850,
    minVy: -22, maxVy: -16,
    minVx: -3.5, maxVx: 3.5,
    bombChance: 0.22,
    maxOnScreen: 10,
  },
} as const;

// ─── Scoring ──────────────────────────────────────────────────────────────────
export const COMBO_WINDOW_MS = 400;   // time between slices to count as combo
export const COMBO_BONUS_MULTIPLIER = 0.5; // extra × per extra fruit in combo

// ─── Rendering ────────────────────────────────────────────────────────────────
export const PARTICLE_COUNT = 14;
export const NEON_GLOW_BLUR = 18;
