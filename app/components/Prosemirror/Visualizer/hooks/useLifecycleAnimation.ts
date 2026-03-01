'use client';

import { useState, useCallback, useRef } from 'react';
import { LIFECYCLE_STEPS, LIFECYCLE_DELAY_MS } from '../constants';

const DEBOUNCE_MS = 800;

export function useLifecycleAnimation() {
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAnimTimer = useCallback(() => {
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
  }, []);

  const startAnimation = useCallback(() => {
    clearAnimTimer();
    let i = 0;
    setActiveStepIndex(null);

    function next() {
      if (i >= LIFECYCLE_STEPS.length) {
        setActiveStepIndex(null);
        return;
      }
      setActiveStepIndex(i);
      i++;
      animTimerRef.current = setTimeout(next, LIFECYCLE_DELAY_MS);
    }
    next();
  }, [clearAnimTimer]);

  const runAnimation = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(startAnimation, DEBOUNCE_MS);
  }, [startAnimation]);

  const reset = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    clearAnimTimer();
    setActiveStepIndex(null);
  }, [clearAnimTimer]);

  return { activeStepIndex, runAnimation, replayAnimation: startAnimation, reset };
}
