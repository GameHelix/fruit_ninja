// ─── Game-wide enums / union types ────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GamePhase = 'start' | 'playing' | 'paused' | 'gameover';

// ─── Fruit configuration (static data) ───────────────────────────────────────

export interface FruitConfig {
  name: string;
  outerColor: string;  // skin colour
  innerColor: string;  // flesh colour (shown when sliced)
  glowColor: string;   // neon glow tint
  radius: number;
  points: number;
}

// ─── Live game objects (stored in refs, never in React state) ─────────────────

export interface GameFruit {
  id: string;
  cfg: FruitConfig;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;       // radians
  rotationSpeed: number;
  sliced: boolean;
  sliceAngle: number;     // angle of the slice line (radians)
  // half-piece physics (set at slice moment)
  axOff: number; ayOff: number; avx: number; avy: number;
  bxOff: number; byOff: number; bvx: number; bvy: number;
  sliceTimer: number;     // counts down from 1 → 0 for fade
}

export interface GameBomb {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  exploded: boolean;
  explodeTimer: number;   // 1 → 0 for explosion fade
}

export interface Particle {
  id: string;
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  radius: number;
  life: number;    // current
  maxLife: number;
}

export interface ScorePopup {
  id: string;
  x: number; y: number;
  value: number;
  combo: boolean;
  life: number;    // counts down from 1 → 0
}

export interface SlicePoint {
  x: number;
  y: number;
  t: number; // timestamp
}

// ─── Snapshot passed to the renderer each frame ───────────────────────────────

export interface GameSnapshot {
  fruits: GameFruit[];
  bombs: GameBomb[];
  particles: Particle[];
  popups: ScorePopup[];
  trail: SlicePoint[];
  explosions: { x: number; y: number; r: number; alpha: number; id: string }[];
}
