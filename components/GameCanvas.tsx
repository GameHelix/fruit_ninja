'use client';

/**
 * GameCanvas — owns the entire game loop.
 * Physics, rendering, input and scoring all live here.
 * React state is used ONLY for score/lives/combo (to drive the HUD).
 * All game objects live in refs to avoid re-render overhead.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import type {
  Difficulty,
  GameFruit,
  GameBomb,
  Particle,
  ScorePopup,
  SlicePoint,
} from '@/lib/types';
import {
  FRUITS,
  DIFFICULTY_SETTINGS,
  GRAVITY,
  OFFSCREEN_PAD,
  MAX_LIVES,
  PARTICLE_COUNT,
  COMBO_WINDOW_MS,
} from '@/lib/constants';
import { segmentIntersectsCircle, sliceAngle } from '@/lib/slice';
import {
  drawBackground,
  drawFruit,
  drawSlicedFruit,
  drawBomb,
  drawExplosion,
  drawParticle,
  drawScorePopup,
  drawSliceTrail,
} from '@/lib/draw';
import type { useAudio } from '@/hooks/useAudio';

// ─── Types ────────────────────────────────────────────────────────────────────

type AudioHook = ReturnType<typeof useAudio>;
type Explosion = { id: string; x: number; y: number; r: number; alpha: number };

export interface GameCanvasHandle {
  pause: () => void;
  resume: () => void;
}

interface Props {
  difficulty: Difficulty;
  onScoreChange: (s: number) => void;
  onLivesChange: (l: number) => void;
  onComboChange: (c: number) => void;
  onGameOver: (finalScore: number) => void;
  audio: AudioHook;
}

// ─── Utility helpers ──────────────────────────────────────────────────────────

let _id = 0;
const uid = () => String(++_id);
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function spawnFruit(canvasW: number, canvasH: number, diff: Difficulty): GameFruit {
  const s = DIFFICULTY_SETTINGS[diff];
  const cfg = pick(FRUITS);
  const x = rand(cfg.radius + 20, canvasW - cfg.radius - 20);
  return {
    id: uid(),
    cfg,
    x,
    y: canvasH + cfg.radius,
    vx: rand(s.minVx, s.maxVx),
    vy: rand(s.minVy, s.maxVy),
    rotation: rand(0, Math.PI * 2),
    rotationSpeed: rand(-0.06, 0.06),
    sliced: false,
    sliceAngle: 0,
    axOff: 0, ayOff: 0, avx: 0, avy: 0,
    bxOff: 0, byOff: 0, bvx: 0, bvy: 0,
    sliceTimer: 0,
  };
}

function spawnBomb(canvasW: number, canvasH: number, diff: Difficulty): GameBomb {
  const s = DIFFICULTY_SETTINGS[diff];
  const x = rand(40, canvasW - 40);
  return {
    id: uid(),
    x,
    y: canvasH + 30,
    vx: rand(s.minVx, s.maxVx),
    vy: rand(s.minVy, s.maxVy) * 0.85,
    rotation: rand(0, Math.PI * 2),
    rotationSpeed: rand(-0.04, 0.04),
    exploded: false,
    explodeTimer: 0,
  };
}

function createParticles(x: number, y: number, color: string, glowColor: string): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(2, 8);
    return {
      id: uid(),
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: Math.random() > 0.5 ? color : glowColor,
      radius: rand(3, 7),
      life: 1,
      maxLife: 1,
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

const GameCanvas = forwardRef<GameCanvasHandle, Props>(function GameCanvas(
  { difficulty, onScoreChange, onLivesChange, onComboChange, onGameOver, audio },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(false);
  const rafRef = useRef<number>(0);

  // Mutable game state (not React state — avoids re-render every frame)
  const fruitsRef = useRef<GameFruit[]>([]);
  const bombsRef = useRef<GameBomb[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const popupsRef = useRef<ScorePopup[]>([]);
  const trailRef = useRef<SlicePoint[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);

  const scoreRef = useRef(0);
  const livesRef = useRef(MAX_LIVES);
  const comboRef = useRef(0);
  const lastSliceTimeRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const isSlicingRef = useRef(false);

  // React state drives HUD re-renders
  const [, forceUpdate] = useState(0);
  const hudUpdate = useCallback(() => forceUpdate(n => n + 1), []);

  // ─── Expose pause/resume to parent ────────────────────────────────────────

  useImperativeHandle(ref, () => ({
    pause: () => { pausedRef.current = true; },
    resume: () => {
      pausedRef.current = false;
      // Reset spawn timer so a fruit doesn't immediately appear
      lastSpawnTimeRef.current = performance.now();
    },
  }));

  // ─── Game loop ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size canvas to fill its container
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const settings = DIFFICULTY_SETTINGS[difficulty];

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (pausedRef.current) return;

      const ctx = canvas.getContext('2d')!;
      const W = canvas.width;
      const H = canvas.height;

      // ── Spawn ──────────────────────────────────────────────────────────────
      const allObjects = fruitsRef.current.filter(f => !f.sliced).length + bombsRef.current.filter(b => !b.exploded).length;
      if (
        now - lastSpawnTimeRef.current > settings.spawnIntervalMs &&
        allObjects < settings.maxOnScreen
      ) {
        lastSpawnTimeRef.current = now;
        if (Math.random() < settings.bombChance) {
          bombsRef.current.push(spawnBomb(W, H, difficulty));
        } else {
          // Sometimes spawn 2 at once
          fruitsRef.current.push(spawnFruit(W, H, difficulty));
          if (difficulty !== 'easy' && Math.random() < 0.3) {
            fruitsRef.current.push(spawnFruit(W, H, difficulty));
          }
        }
      }

      // ── Update fruits ──────────────────────────────────────────────────────
      const toRemove: string[] = [];
      fruitsRef.current = fruitsRef.current.filter(f => {
        if (f.sliced) {
          // update sliced half positions
          f.axOff += f.avx; f.ayOff += f.avy; f.avy += GRAVITY;
          f.bxOff += f.bvx; f.byOff += f.bvy; f.bvy += GRAVITY;
          f.sliceTimer -= 0.03;
          return f.sliceTimer > 0;
        }
        // Normal physics
        f.x += f.vx;
        f.y += f.vy;
        f.vy += GRAVITY;
        f.rotation += f.rotationSpeed;

        // Fell off screen (missed)
        if (f.y > H + OFFSCREEN_PAD) {
          livesRef.current = Math.max(0, livesRef.current - 1);
          onLivesChange(livesRef.current);
          audio.playMiss();
          if (livesRef.current <= 0) triggerGameOver();
          return false;
        }
        return f.x > -OFFSCREEN_PAD && f.x < W + OFFSCREEN_PAD;
      });

      // ── Update bombs ───────────────────────────────────────────────────────
      bombsRef.current = bombsRef.current.filter(b => {
        if (b.exploded) {
          b.explodeTimer -= 0.05;
          return b.explodeTimer > 0;
        }
        b.x += b.vx;
        b.y += b.vy;
        b.vy += GRAVITY;
        b.rotation += b.rotationSpeed;
        return !(b.y > H + OFFSCREEN_PAD) &&
          b.x > -OFFSCREEN_PAD && b.x < W + OFFSCREEN_PAD;
      });

      // ── Update particles ───────────────────────────────────────────────────
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += GRAVITY * 0.4;
        p.vx *= 0.97;
        p.life -= 0.025;
        return p.life > 0;
      });

      // ── Update popups ──────────────────────────────────────────────────────
      popupsRef.current = popupsRef.current.filter(p => {
        p.life -= 0.022;
        return p.life > 0;
      });

      // ── Update explosions ──────────────────────────────────────────────────
      explosionsRef.current = explosionsRef.current.filter(e => {
        e.r += 6;
        e.alpha -= 0.06;
        return e.alpha > 0;
      });

      // ── Prune old trail points ─────────────────────────────────────────────
      trailRef.current = trailRef.current.filter(p => now - p.t < 120);

      // ── Render ─────────────────────────────────────────────────────────────
      drawBackground(ctx, W, H);

      explosionsRef.current.forEach(e => drawExplosion(ctx, e));

      fruitsRef.current.forEach(f => {
        if (f.sliced) drawSlicedFruit(ctx, f);
        else drawFruit(ctx, f);
      });

      bombsRef.current.forEach(b => {
        if (!b.exploded) drawBomb(ctx, b);
      });

      particlesRef.current.forEach(p => drawParticle(ctx, p));
      popupsRef.current.forEach(p => drawScorePopup(ctx, p));
      drawSliceTrail(ctx, trailRef.current);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  // ─── Game over helper ──────────────────────────────────────────────────────

  const triggerGameOver = useCallback(() => {
    pausedRef.current = true;
    audio.stopBgMusic();
    onGameOver(scoreRef.current);
  }, [audio, onGameOver]);

  // ─── Slice processing ──────────────────────────────────────────────────────

  const processSlice = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      const now = performance.now();
      const ang = sliceAngle(x1, y1, x2, y2);
      let slicedCount = 0;

      // Check fruits
      fruitsRef.current.forEach(f => {
        if (f.sliced) return;
        if (!segmentIntersectsCircle(x1, y1, x2, y2, f.x, f.y, f.cfg.radius)) return;

        // Slice it!
        f.sliced = true;
        f.sliceAngle = ang;
        f.sliceTimer = 1;
        // Half physics
        const perp = ang + Math.PI / 2;
        const speed = 3;
        f.avx = Math.cos(perp) * speed + f.vx * 0.5;
        f.avy = Math.sin(perp) * speed + f.vy * 0.5 - 1;
        f.bvx = -Math.cos(perp) * speed + f.vx * 0.5;
        f.bvy = -Math.sin(perp) * speed + f.vy * 0.5 - 1;

        // Particles
        particlesRef.current.push(...createParticles(f.x, f.y, f.cfg.innerColor, f.cfg.glowColor));

        // Score
        const pts = f.cfg.points;
        scoreRef.current += pts;
        onScoreChange(scoreRef.current);
        slicedCount++;

        popupsRef.current.push({
          id: uid(),
          x: f.x,
          y: f.y - f.cfg.radius,
          value: pts,
          combo: false,
          life: 1,
        });

        audio.playSlice();
      });

      // Combo check
      if (slicedCount > 0) {
        const timeSinceLast = now - lastSliceTimeRef.current;
        if (timeSinceLast < COMBO_WINDOW_MS && comboRef.current > 0) {
          comboRef.current += slicedCount;
          const bonus = comboRef.current * 5;
          scoreRef.current += bonus;
          onScoreChange(scoreRef.current);
          popupsRef.current.push({
            id: uid(),
            x: (x1 + x2) / 2,
            y: (y1 + y2) / 2 - 30,
            value: comboRef.current,
            combo: true,
            life: 1,
          });
          audio.playCombo(comboRef.current);
        } else {
          comboRef.current = slicedCount;
        }
        lastSliceTimeRef.current = now;
        onComboChange(comboRef.current);
      }

      // Check bombs
      bombsRef.current.forEach(b => {
        if (b.exploded) return;
        if (!segmentIntersectsCircle(x1, y1, x2, y2, b.x, b.y, 28)) return;

        b.exploded = true;
        b.explodeTimer = 1;
        explosionsRef.current.push({ id: uid(), x: b.x, y: b.y, r: 10, alpha: 1 });
        audio.playBoom();

        livesRef.current = Math.max(0, livesRef.current - 1);
        onLivesChange(livesRef.current);
        if (livesRef.current <= 0) triggerGameOver();
      });
    },
    [audio, onComboChange, onLivesChange, onScoreChange, triggerGameOver],
  );

  // ─── Input handlers ────────────────────────────────────────────────────────

  const getPos = (e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const t = e.touches[0] ?? e.changedTouches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return {
      x: (e as MouseEvent).clientX - rect.left,
      y: (e as MouseEvent).clientY - rect.top,
    };
  };

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (pausedRef.current) return;
    audio.startBgMusic();
    isSlicingRef.current = true;
    const pos = getPos(e);
    trailRef.current = [{ ...pos, t: performance.now() }];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio]);

  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isSlicingRef.current || pausedRef.current) return;
    const pos = getPos(e);
    const trail = trailRef.current;
    if (trail.length > 0) {
      const prev = trail[trail.length - 1];
      const dx = pos.x - prev.x;
      const dy = pos.y - prev.y;
      if (dx * dx + dy * dy > 4) {
        processSlice(prev.x, prev.y, pos.x, pos.y);
        trail.push({ ...pos, t: performance.now() });
        if (trail.length > 20) trail.shift();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processSlice]);

  const handlePointerUp = useCallback(() => {
    isSlicingRef.current = false;
    comboRef.current = 0;
    onComboChange(0);
  }, [onComboChange]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full touch-none cursor-crosshair"
      style={{ display: 'block' }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={e => { e.preventDefault(); handlePointerDown(e); }}
      onTouchMove={e => { e.preventDefault(); handlePointerMove(e); }}
      onTouchEnd={e => { e.preventDefault(); handlePointerUp(); }}
    />
  );
});

export default GameCanvas;
