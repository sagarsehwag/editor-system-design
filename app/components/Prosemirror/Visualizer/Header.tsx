'use client';

import React from 'react';

type HeaderProps = {
  animationEnabled: boolean;
  onToggleAnimation: () => void;
  selectedTxId: number | null;
  onBackToLive: () => void;
};

export function Header({ animationEnabled, onToggleAnimation, selectedTxId, onBackToLive }: HeaderProps) {
  const isLive = selectedTxId === null;

  return (
    <header className="viz-header">
      <div className="viz-header-row">
        <div>
          <h3 className="viz-title">
            Prose<span className="viz-title-accent">Mirror</span> Transaction Flow
          </h3>
          <p className="viz-subtitle">
            Type and watch live transaction interception.
          </p>
        </div>
        <div className="viz-header-controls">
          {isLive ? (
            <span className="viz-hdr-chip viz-hdr-chip-live">
              <span className="viz-hdr-chip-dot viz-hdr-chip-dot-live" />
              LIVE
            </span>
          ) : (
            <button className="viz-hdr-chip viz-hdr-chip-tx" onClick={onBackToLive}>
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
        </div>
      </div>
    </header>
  );
}
