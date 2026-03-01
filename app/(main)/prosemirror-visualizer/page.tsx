'use client';

import dynamic from 'next/dynamic';

const ProseMirrorVisualizer = dynamic(
  () => import('../../components/Prosemirror/Visualizer/ProseMirrorVisualizer'),
  { ssr: false },
);

export default function VisualizerPage() {
  return <ProseMirrorVisualizer />;
}
