'use client';

import React from 'react';
import { EditorMount } from '../../ui';

type FlowEditorPanelProps = {
  onEditorReady: (container: HTMLDivElement) => (() => void) | void;
  onFlowEnter: () => void;
  onFlowLeave: () => void;
  children: React.ReactNode;
};

export function FlowEditorPanel({
  onEditorReady,
  onFlowEnter,
  onFlowLeave,
  children,
}: FlowEditorPanelProps) {
  return (
    <div
      className="pm-flow-main-col"
      onMouseEnter={onFlowEnter}
      onMouseLeave={onFlowLeave}
    >
      <div className="pm-flow-editor-panel">
        <div className="pm-flow-editor-header">
          <span className="pm-flow-editor-label">EditorView</span>
        </div>
        <EditorMount
          onReady={onEditorReady}
          className="pm-flow-editor pm-flow-editor-prosemirror"
          style={{ minHeight: 80 }}
        />
      </div>
      {children}
    </div>
  );
}
