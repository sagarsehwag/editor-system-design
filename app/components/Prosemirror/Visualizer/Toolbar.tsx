'use client';

import React from 'react';
import { IconButton, BoldIcon, ItalicIcon, UndoIcon, RedoIcon } from '../../ui';

type ToolbarProps = {
  onCommand: (cmd: 'bold' | 'italic' | 'undo' | 'redo') => void;
  activeMarks: string[];
  disabled?: boolean;
};

export function Toolbar({ onCommand, activeMarks, disabled }: ToolbarProps) {
  return (
    <div className="viz-toolbar">
      <IconButton
        aria-label="Bold (Cmd+B)"
        title="Bold (Cmd+B)"
        className={`viz-toolbar-btn ${activeMarks.includes('strong') ? 'active' : ''}`}
        onClick={() => onCommand('bold')}
        disabled={disabled}
      >
        <BoldIcon size={16} />
      </IconButton>
      <IconButton
        aria-label="Italic (Cmd+I)"
        title="Italic (Cmd+I)"
        className={`viz-toolbar-btn ${activeMarks.includes('em') ? 'active' : ''}`}
        onClick={() => onCommand('italic')}
        disabled={disabled}
      >
        <ItalicIcon size={16} />
      </IconButton>
      <IconButton
        aria-label="Undo (Cmd+Z)"
        title="Undo (Cmd+Z)"
        className="viz-toolbar-btn wide"
        onClick={() => onCommand('undo')}
        disabled={disabled}
      >
        <UndoIcon size={16} />
      </IconButton>
      <IconButton
        aria-label="Redo (Cmd+Shift+Z)"
        title="Redo (Cmd+Shift+Z)"
        className="viz-toolbar-btn wide"
        onClick={() => onCommand('redo')}
        disabled={disabled}
      >
        <RedoIcon size={16} />
      </IconButton>
    </div>
  );
}
