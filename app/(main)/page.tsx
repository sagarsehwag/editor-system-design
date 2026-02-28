'use client';

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
  const demoFromUrl = searchParams.get('demo');

  // ProseMirror is main — redirect / to /prosemirror when no demo (client-side, works on static export)
  useEffect(() => {
    if (!demoFromUrl) {
      // Relative path works: /editor-system-design/ → /editor-system-design/prosemirror
      window.location.replace('prosemirror');
    }
  }, [demoFromUrl]);

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
