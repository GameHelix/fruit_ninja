'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Procedural audio via Web Audio API.
 * No external audio files needed — all sounds synthesised on the fly.
 */
export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(true);
  const bgNodeRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  // Lazily create AudioContext on first user interaction
  const getCtx = useCallback((): AudioContext | null => {
    if (!enabled) return null;
    if (!ctxRef.current) {
      try {
        ctxRef.current = new AudioContext();
      } catch {
        return null;
      }
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, [enabled]);

  // ── Slice sound ──────────────────────────────────────────────────────────────
  const playSlice = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  }, [getCtx]);

  // ── Bomb/miss sound ──────────────────────────────────────────────────────────
  const playBoom = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    // noise-like burst
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    src.start(ctx.currentTime);
    src.stop(ctx.currentTime + 0.3);
  }, [getCtx]);

  // ── Miss sound ───────────────────────────────────────────────────────────────
  const playMiss = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  }, [getCtx]);

  // ── Combo sound ──────────────────────────────────────────────────────────────
  const playCombo = useCallback((count: number) => {
    const ctx = getCtx();
    if (!ctx) return;
    const freqs = [523, 659, 784, 988, 1175];
    const freq = freqs[Math.min(count - 2, freqs.length - 1)];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }, [getCtx]);

  // ── Background ambient hum ───────────────────────────────────────────────────
  const startBgMusic = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || bgNodeRef.current) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 55; // deep bass drone
    gain.gain.value = 0.04;
    osc.start();
    bgNodeRef.current = { osc, gain };
  }, [getCtx]);

  const stopBgMusic = useCallback(() => {
    if (bgNodeRef.current) {
      bgNodeRef.current.osc.stop();
      bgNodeRef.current = null;
    }
  }, []);

  // Stop bg music when disabled
  useEffect(() => {
    if (!enabled) stopBgMusic();
  }, [enabled, stopBgMusic]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopBgMusic();
      ctxRef.current?.close();
    };
  }, [stopBgMusic]);

  const toggle = useCallback(() => setEnabled(e => !e), []);

  return { enabled, toggle, playSlice, playBoom, playMiss, playCombo, startBgMusic, stopBgMusic };
}
