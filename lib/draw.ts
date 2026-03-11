/**
 * Pure canvas drawing helpers — no React, no state.
 * All functions accept a CanvasRenderingContext2D and draw immediately.
 */

import type { GameFruit, GameBomb, Particle, ScorePopup, SlicePoint } from './types';
import { NEON_GLOW_BLUR } from './constants';

// ─── Background ───────────────────────────────────────────────────────────────

export function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#04040f');
  grad.addColorStop(1, '#0a0a22');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // subtle grid lines
  ctx.save();
  ctx.strokeStyle = 'rgba(120,120,255,0.04)';
  ctx.lineWidth = 1;
  const step = 60;
  for (let x = 0; x < w; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  ctx.restore();
}

// ─── Whole fruit ──────────────────────────────────────────────────────────────

export function drawFruit(ctx: CanvasRenderingContext2D, f: GameFruit) {
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.rotation);

  const r = f.cfg.radius;

  // glow
  ctx.shadowColor = f.cfg.glowColor;
  ctx.shadowBlur = NEON_GLOW_BLUR;

  // outer skin gradient
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, lighten(f.cfg.outerColor, 0.4));
  grad.addColorStop(1, f.cfg.outerColor);

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // specular highlight
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(-r * 0.28, -r * 0.28, r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fill();

  ctx.restore();
}

// ─── Sliced fruit halves ──────────────────────────────────────────────────────

export function drawSlicedFruit(ctx: CanvasRenderingContext2D, f: GameFruit) {
  const t = f.sliceTimer; // 1 = just sliced, 0 = gone
  if (t <= 0) return;

  const r = f.cfg.radius;
  const ang = f.sliceAngle;

  ctx.save();
  ctx.globalAlpha = Math.min(1, t * 1.5); // fade out near end

  // Half A
  ctx.save();
  ctx.translate(f.x + f.axOff, f.y + f.ayOff);
  ctx.rotate(ang);
  drawHalf(ctx, r, f.cfg.outerColor, f.cfg.innerColor, f.cfg.glowColor, 1);
  ctx.restore();

  // Half B
  ctx.save();
  ctx.translate(f.x + f.bxOff, f.y + f.byOff);
  ctx.rotate(ang + Math.PI);
  drawHalf(ctx, r, f.cfg.outerColor, f.cfg.innerColor, f.cfg.glowColor, -1);
  ctx.restore();

  ctx.restore();
}

function drawHalf(
  ctx: CanvasRenderingContext2D,
  r: number,
  outerColor: string,
  innerColor: string,
  glowColor: string,
  side: 1 | -1,
) {
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 12;

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI, side === -1);
  ctx.closePath();

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  grad.addColorStop(0, innerColor);
  grad.addColorStop(0.6, lighten(outerColor, 0.2));
  grad.addColorStop(1, outerColor);
  ctx.fillStyle = grad;
  ctx.fill();

  // flat inner edge colour
  ctx.beginPath();
  ctx.moveTo(-r, 0);
  ctx.lineTo(r, 0);
  ctx.strokeStyle = innerColor;
  ctx.lineWidth = 3;
  ctx.shadowBlur = 0;
  ctx.stroke();
}

// ─── Bomb ─────────────────────────────────────────────────────────────────────

export function drawBomb(ctx: CanvasRenderingContext2D, b: GameBomb) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.rotation);

  const r = 28;

  // body
  ctx.shadowColor = '#ff4400';
  ctx.shadowBlur = 14;
  const grad = ctx.createRadialGradient(-8, -8, 3, 0, 0, r);
  grad.addColorStop(0, '#555');
  grad.addColorStop(1, '#111');
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.stroke();

  // fuse
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(14, -r - 14, 10, -r - 22);
  ctx.strokeStyle = '#8B6914';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();

  // spark at tip
  ctx.shadowColor = '#ffcc00';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ffcc00';
  ctx.beginPath();
  ctx.arc(10, -r - 22, 4, 0, Math.PI * 2);
  ctx.fill();

  // skull icon
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.font = `bold ${Math.round(r * 0.9)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('💣', 0, 2);

  ctx.restore();
}

// ─── Bomb explosion ───────────────────────────────────────────────────────────

export function drawExplosion(
  ctx: CanvasRenderingContext2D,
  ex: { x: number; y: number; r: number; alpha: number },
) {
  ctx.save();
  const grad = ctx.createRadialGradient(ex.x, ex.y, 0, ex.x, ex.y, ex.r);
  grad.addColorStop(0, `rgba(255,200,50,${ex.alpha})`);
  grad.addColorStop(0.4, `rgba(255,80,0,${ex.alpha * 0.7})`);
  grad.addColorStop(1, `rgba(255,0,0,0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(ex.x, ex.y, ex.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ─── Particles ────────────────────────────────────────────────────────────────

export function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  const alpha = p.life / p.maxLife;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = p.color;
  ctx.shadowBlur = 8;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ─── Score popups ─────────────────────────────────────────────────────────────

export function drawScorePopup(ctx: CanvasRenderingContext2D, p: ScorePopup) {
  const alpha = Math.min(1, p.life * 2);
  const rise = (1 - p.life) * 40;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = p.combo
    ? 'bold 32px "Inter", sans-serif'
    : 'bold 22px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = p.combo ? '#facc15' : '#a78bfa';
  ctx.shadowBlur = 12;
  ctx.fillStyle = p.combo ? '#fde047' : '#e9d5ff';
  ctx.fillText(
    p.combo ? `COMBO ×${p.value}` : `+${p.value}`,
    p.x,
    p.y - rise,
  );
  ctx.restore();
}

// ─── Slice trail ──────────────────────────────────────────────────────────────

export function drawSliceTrail(ctx: CanvasRenderingContext2D, trail: SlicePoint[]) {
  if (trail.length < 2) return;
  const now = performance.now();

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let i = 1; i < trail.length; i++) {
    const a = trail[i - 1];
    const b = trail[i];
    const age = (now - b.t) / 120; // normalise 0..1
    const alpha = Math.max(0, 1 - age);
    if (alpha <= 0) continue;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 18;
    ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.95})`;
    ctx.lineWidth = (1 - age) * 6 + 1;
    ctx.stroke();
  }

  ctx.restore();
}

// ─── Colour utility ───────────────────────────────────────────────────────────

/** Lighten a hex colour by mixing with white. amount = 0..1 */
function lighten(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `rgb(${lr},${lg},${lb})`;
}
