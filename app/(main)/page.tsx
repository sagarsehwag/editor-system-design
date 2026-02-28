'use client';

import { useRouter } from 'next/navigation';
import { useSearchParamsClient } from '../hooks/useSearchParams';
import { useEffect } from 'react';
import {
  RenderingApproaches,
  ContentEditableDemo,
  SelectionInspector,
  StateModel,
  UpdateLoop,
  NodeStructures,
} from '../components/RichEditor';

const demoComponents: Record<string, React.ComponentType> = {
  rendering: RenderingApproaches,
  contenteditable: ContentEditableDemo,
  selection: SelectionInspector,
  state: StateModel,
  'update-loop': UpdateLoop,
  'node-structures': NodeStructures,
};

export default function Home() {
  const searchParams = useSearchParamsClient();
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
