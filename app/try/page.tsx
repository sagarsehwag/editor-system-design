'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FloatingThemeToggle from '../components/layout/FloatingThemeToggle';

const ProseMirrorVisualizer = dynamic(
  () => import('../components/Prosemirror/Visualizer/ProseMirrorVisualizer'),
  { ssr: false },
);

export default function TryPage() {
  return (
    <div className="try-page">
      <Link href="/" className="floating-back-link">
        <ArrowLeft size={16} />
        Learn Internals
      </Link>
      <ProseMirrorVisualizer />
      <FloatingThemeToggle />
    </div>
  );
}
