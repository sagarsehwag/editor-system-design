'use client';

import React from 'react';
import { Toolbar } from './Toolbar';
import { EditorMount } from './EditorMount';

type EditorPaneProps = {
  onEditorReady: (container: HTMLDivElement) => (() => void) | void;
  onCommand: (cmd: 'bold' | 'italic' | 'undo' | 'redo') => void;
  activeMarks: string[];
  snapshotHtml: string | null;
  onDismissSnapshot: () => void;
};

export function EditorPane({ onEditorReady, onCommand, activeMarks, snapshotHtml, onDismissSnapshot }: EditorPaneProps) {
  const isSnapshot = snapshotHtml !== null;

  return (
    <div className="viz-editor-pane">
      <div className="viz-editor-header">
        <span className="viz-editor-label">EditorView</span>
      </div>
      <Toolbar onCommand={onCommand} activeMarks={activeMarks} disabled={isSnapshot} />
      <div className="viz-editor-body">
        <EditorMount onReady={onEditorReady} />
        {isSnapshot && (
          <div
            className="viz-editor-snapshot"
            onClick={onDismissSnapshot}
            dangerouslySetInnerHTML={{ __html: snapshotHtml }}
          />
        )}
      </div>
    </div>
  );
}
