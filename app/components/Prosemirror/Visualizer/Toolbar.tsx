'use client';

import React from 'react';

type ToolbarProps = {
  onCommand: (cmd: 'bold' | 'italic' | 'undo' | 'redo') => void;
  activeMarks: string[];
  disabled?: boolean;
};

export function Toolbar({ onCommand, activeMarks, disabled }: ToolbarProps) {
  return (
    <div className="viz-toolbar">
      <button
        className={`viz-toolbar-btn ${activeMarks.includes('strong') ? 'active' : ''}`}
        onClick={() => onCommand('bold')}
        title="Bold (Cmd+B)"
        disabled={disabled}
      >
        <b>B</b>
      </button>
      <button
        className={`viz-toolbar-btn ${activeMarks.includes('em') ? 'active' : ''}`}
        onClick={() => onCommand('italic')}
        title="Italic (Cmd+I)"
        disabled={disabled}
      >
        <i>I</i>
      </button>
      <button
        className="viz-toolbar-btn wide"
        onClick={() => onCommand('undo')}
        title="Undo (Cmd+Z)"
        disabled={disabled}
      >
        ↩
      </button>
      <button
        className="viz-toolbar-btn wide"
        onClick={() => onCommand('redo')}
        title="Redo (Cmd+Shift+Z)"
        disabled={disabled}
      >
        ↪
      </button>
    </div>
  );
}
