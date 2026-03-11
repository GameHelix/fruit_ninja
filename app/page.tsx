'use client';

/**
 * Root page — orchestrates game phases (start → playing → paused → gameover).
 * GameCanvas is the single source of truth for physics and rendering.
 */

import { useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Difficulty } from '@/lib/types';
import { MAX_LIVES } from '@/lib/constants';
import { useHighScore } from '@/hooks/useHighScore';
import { useAudio } from '@/hooks/useAudio';
import GameCanvas, { type GameCanvasHandle } from '@/components/GameCanvas';
import HUD from '@/components/HUD';
import StartScreen from '@/components/StartScreen';
import GameOverScreen from '@/components/GameOverScreen';
import PauseModal from '@/components/PauseModal';

type Phase = 'start' | 'playing' | 'paused' | 'gameover';

// Key that changes every new game to force full remount of GameCanvas
let gameKey = 0;

export default function Home() {
  const [phase, setPhase] = useState<Phase>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [combo, setCombo] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [canvasKey, setCanvasKey] = useState(0);

  const { highScore, saveIfBetter } = useHighScore();
  const audio = useAudio();
  const canvasHandle = useRef<GameCanvasHandle>(null);

  // ── Game lifecycle ────────────────────────────────────────────────────────

  const startGame = useCallback((diff: Difficulty) => {
    gameKey++;
    setCanvasKey(gameKey);
    setDifficulty(diff);
    setScore(0);
    setLives(MAX_LIVES);
    setCombo(0);
    setPhase('playing');
  }, []);

  const handleGameOver = useCallback((fs: number) => {
    setFinalScore(fs);
    saveIfBetter(fs);
    setPhase('gameover');
  }, [saveIfBetter]);

  const handlePause = useCallback(() => {
    canvasHandle.current?.pause();
    setPhase('paused');
  }, []);

  const handleResume = useCallback(() => {
    canvasHandle.current?.resume();
    setPhase('playing');
  }, []);

  const handleRestart = useCallback((diff?: Difficulty) => {
    startGame(diff ?? difficulty);
  }, [difficulty, startGame]);

  const handleMenu = useCallback(() => {
    setPhase('start');
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  const isNewHigh = finalScore > 0 && finalScore >= highScore;

  return (
    <main className="w-screen h-screen overflow-hidden relative bg-[#04040f]">
      {/* Game canvas — mounted only when in a game phase */}
      {phase !== 'start' && (
        <div className="absolute inset-0">
          <GameCanvas
            key={canvasKey}
            ref={canvasHandle}
            difficulty={difficulty}
            onScoreChange={setScore}
            onLivesChange={setLives}
            onComboChange={setCombo}
            onGameOver={handleGameOver}
            audio={audio}
          />
        </div>
      )}

      {/* HUD — visible while playing or paused */}
      {(phase === 'playing' || phase === 'paused') && (
        <HUD
          score={score}
          lives={lives}
          combo={combo}
          highScore={highScore}
          onPause={handlePause}
          audioEnabled={audio.enabled}
          onAudioToggle={audio.toggle}
        />
      )}

      {/* Screen overlays */}
      <AnimatePresence mode="wait">
        {phase === 'start' && (
          <StartScreen key="start" highScore={highScore} onStart={startGame} />
        )}
        {phase === 'paused' && (
          <PauseModal
            key="pause"
            score={score}
            difficulty={difficulty}
            onResume={handleResume}
            onRestart={() => handleRestart()}
            onMenu={handleMenu}
          />
        )}
        {phase === 'gameover' && (
          <GameOverScreen
            key="gameover"
            score={finalScore}
            highScore={highScore}
            isNewHigh={isNewHigh}
            difficulty={difficulty}
            onRestart={handleRestart}
            onMenu={handleMenu}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
