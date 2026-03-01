import type { LifecycleStepDef } from './types';

export const LIFECYCLE_STEPS: LifecycleStepDef[] = [
  {
    id: 'view',
    label: 'View',
    desc: 'User interacts with the EditorView',
    tooltip: 'The EditorView captures DOM events (keydown, input, paste, cut) on the contentEditable element and translates them into ProseMirror operations.',
    color: 'purple',
  },
  {
    id: 'tr',
    label: 'Transaction',
    desc: 'tr = state.tr — steps added to mutable object',
    tooltip: 'A Transaction holds an array of Steps (ReplaceStep, AddMarkStep, etc.). It is a mutable object that accumulates changes before being dispatched.',
    color: 'orange',
  },
  {
    id: 'apply',
    label: 'Apply Transaction',
    desc: 'New immutable EditorState from old + steps',
    tooltip: 'Creates a new EditorState by mapping each step over the document. The old state is unchanged — structural sharing enables undo/redo.',
    color: 'green',
  },
  {
    id: 'update',
    label: 'Update View',
    desc: 'DOM reconciled, plugin view.update() hooks called',
    tooltip: 'Compares new state to current DOM, applies minimal DOM updates. Preserves cursor position and selection. Calls plugin view.update() hooks.',
    color: 'blue',
  },
];

export const LIFECYCLE_DELAY_MS = 1800;
export const MAX_TRANSACTIONS = 60;

export const TYPE_COLORS: Record<string, string> = {
  doc: 'var(--accent-purple)',
  selection: 'var(--accent-red)',
  mark: 'var(--accent-orange)',
  history: 'var(--accent-green)',
  meta: 'var(--text-muted)',
};
