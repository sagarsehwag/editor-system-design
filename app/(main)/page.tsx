'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RenderingApproaches from '../components/demos/RenderingApproaches';
import ContentEditableDemo from '../components/demos/ContentEditableDemo';
import SelectionInspector from '../components/demos/SelectionInspector';
import StateModel from '../components/demos/StateModel';
import UpdateLoop from '../components/demos/UpdateLoop';
import NodeStructures from '../components/demos/NodeStructures';

const demoComponents: Record<string, React.ComponentType> = {
  rendering: RenderingApproaches,
  contenteditable: ContentEditableDemo,
  selection: SelectionInspector,
  state: StateModel,
  'update-loop': UpdateLoop,
  'node-structures': NodeStructures,
};

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const demoFromUrl = searchParams.get('demo');

  // ProseMirror is main — redirect / to /prosemirror when no demo (fallback if middleware skipped)
  useEffect(() => {
    if (!demoFromUrl) {
      router.replace('/prosemirror');
    }
  }, [demoFromUrl, router]);

  if (!demoFromUrl) {
    return (
      <div className="demo-section active" style={{ padding: '2rem' }}>
        <p>Redirecting to Prosemirror…</p>
      </div>
    );
  }

  const activeDemo = demoFromUrl in demoComponents ? demoFromUrl : 'rendering';
  const ActiveComponent = demoComponents[activeDemo];

  return ActiveComponent ? <ActiveComponent /> : null;
}
