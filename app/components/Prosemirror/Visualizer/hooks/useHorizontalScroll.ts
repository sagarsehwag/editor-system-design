'use client';

import { useRef, useEffect } from 'react';

export function useHorizontalScroll(depCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [depCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      const canScrollLeft = el.scrollLeft > 0;
      const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth;
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      if ((scrollingDown && canScrollRight) || (scrollingUp && canScrollLeft)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return { scrollRef };
}
