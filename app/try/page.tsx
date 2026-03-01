'use client';

import dynamic from 'next/dynamic';
import FloatingThemeToggle from '../components/layout/FloatingThemeToggle';

const ProseMirrorVisualizer = dynamic(
  () => import('../components/Prosemirror/Visualizer/ProseMirrorVisualizer'),
  { ssr: false },
);

export default function TryPage() {
  return (
    <div className="try-page">
      <ProseMirrorVisualizer />
      <FloatingThemeToggle />
    </div>
  );
}
