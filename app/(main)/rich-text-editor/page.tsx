'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  RenderingApproaches,
  ContentEditableDemo,
  SelectionInspector,
  StateModel,
  UpdateLoop,
  NodeStructures,
} from '../../components/RichEditor';

const tabComponents: Record<string, React.ComponentType> = {
  rendering: RenderingApproaches,
  contenteditable: ContentEditableDemo,
  selection: SelectionInspector,
  state: StateModel,
  'update-loop': UpdateLoop,
  'node-structures': NodeStructures,
};

const VALID_TABS = Object.keys(tabComponents);

function RichTextEditorContent() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'rendering';
  const activeTab = VALID_TABS.includes(tabFromUrl) ? tabFromUrl : 'rendering';
  const ActiveComponent = tabComponents[activeTab];

  return ActiveComponent ? <ActiveComponent /> : null;
}

export default function RichTextEditorPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <RichTextEditorContent />
    </Suspense>
  );
}
