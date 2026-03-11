'use client';

import { useCallback, useState } from 'react';

const KEY = 'fruitNinja_highScore';

export function useHighScore() {
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem(KEY) ?? '0', 10) || 0;
  });

  const saveIfBetter = useCallback((score: number) => {
    setHighScore(prev => {
      if (score > prev) {
        localStorage.setItem(KEY, String(score));
        return score;
      }
      return prev;
    });
  }, []);

  return { highScore, saveIfBetter };
}
