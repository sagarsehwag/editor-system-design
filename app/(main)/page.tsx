'use client';

import { useSearchParams } from 'next/navigation';
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
  const demoFromUrl = searchParams.get('demo') || 'rendering';
  const activeDemo = demoFromUrl in demoComponents ? demoFromUrl : 'rendering';
  const ActiveComponent = demoComponents[activeDemo];

  return ActiveComponent ? <ActiveComponent /> : null;
}
