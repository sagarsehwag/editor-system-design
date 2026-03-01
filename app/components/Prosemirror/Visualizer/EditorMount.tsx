'use client';

import React, { useEffect, useRef } from 'react';

export const EditorMount = React.memo(function EditorMount({
  onReady,
}: {
  onReady: (container: HTMLDivElement) => (() => void) | void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cleanup = onReady(el);
    return () => cleanup?.();
  }, [onReady]);
  return <div ref={ref} className="viz-editor-mount" />;
});
