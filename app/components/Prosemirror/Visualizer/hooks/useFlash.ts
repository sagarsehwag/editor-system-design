'use client';

import { useEffect, useRef } from 'react';

const FLASH_CLASSES = ['viz-card-flash', 'viz-flash-doc', 'viz-flash-selection', 'viz-flash-mark', 'viz-flash-history', 'viz-flash-meta'];

export function useFlash(dep: unknown, colorKey?: string) {
  const ref = useRef<HTMLDivElement>(null);
  const prevDep = useRef(dep);
  useEffect(() => {
    if (dep && prevDep.current !== dep && ref.current) {
      FLASH_CLASSES.forEach((c) => ref.current!.classList.remove(c));
      void ref.current.offsetWidth;
      ref.current.classList.add('viz-card-flash');
      if (colorKey) ref.current.classList.add(`viz-flash-${colorKey}`);
    }
    prevDep.current = dep;
  }, [dep, colorKey]);
  return ref;
}
