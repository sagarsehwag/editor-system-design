'use client';

import React from 'react';

type HeaderProps = {
  animationEnabled: boolean;
  onToggleAnimation: () => void;
  selectedTxId: number | null;
  onBackToLive: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
};

export function Header({
  animationEnabled,
  onToggleAnimation,
  selectedTxId,
  onBackToLive,
  fullscreen,
  onToggleFullscreen,
}: HeaderProps) {
  const isLive = selectedTxId === null;

  return (
    <header className="viz-header">
      <div className="viz-header-row">
        <div>
          <h3 className="viz-title">
            Prose<span className="viz-title-accent">Mirror</span> Data Flow
          </h3>
          <p className="viz-subtitle">
            Every edit follows the same cycle: a DOM event is intercepted by the EditorView, translated into a Transaction, applied to produce a new immutable EditorState, and rendered back to the DOM.
          </p>
        </div>
        <div className="viz-header-controls">
          {isLive ? (
            <span className="viz-hdr-chip viz-hdr-chip-live">
              <span className="viz-hdr-chip-dot viz-hdr-chip-dot-live" />
              LIVE
            </span>
          ) : (
            <button key={selectedTxId} className="viz-hdr-chip viz-hdr-chip-tx" onClick={onBackToLive}>
              <span className="viz-hdr-chip-dot viz-hdr-chip-dot-tx" />
              TX #{selectedTxId}
              <span className="viz-hdr-chip-dismiss">&times;</span>
            </button>
          )}
          <button
            className={`viz-hdr-chip viz-hdr-chip-toggle ${animationEnabled ? 'active' : ''}`}
            onClick={onToggleAnimation}
          >
            <span className={`viz-hdr-chip-dot ${animationEnabled ? 'viz-hdr-chip-dot-on' : ''}`} />
            {animationEnabled ? 'Animate' : 'Paused'}
          </button>
          <button
            className="viz-hdr-chip viz-hdr-chip-fullscreen"
            onClick={onToggleFullscreen}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >

            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 5 1 1 5 1" />
              <polyline points="11 1 15 1 15 5" />
              <polyline points="15 11 15 15 11 15" />
              <polyline points="5 15 1 15 1 11" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
