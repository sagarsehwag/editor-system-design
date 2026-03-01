'use client';

import React, { useEffect, useRef } from 'react';

type EditorMountProps = {
  onReady: (container: HTMLDivElement) => (() => void) | void;
  className?: string;
  style?: React.CSSProperties;
};

export const EditorMount = React.memo(function EditorMount({
  onReady,
  className = '',
  style,
}: EditorMountProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cleanup = onReady(el);
    return () => cleanup?.();
  }, [onReady]);

  return <div ref={ref} className={className} style={style} />;
});
