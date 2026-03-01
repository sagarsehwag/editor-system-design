'use client';

import React from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';

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
      <h3 className="viz-title">
        Prose<span className="viz-title-accent">Mirror</span> Visualizer
      </h3>
      <div className="viz-header-controls">
        {isLive ? (
          <span className="viz-hdr-chip viz-hdr-chip-live">
            <span className="viz-hdr-chip-dot viz-hdr-chip-dot-live" />
            LIVE
          </span>
        ) : (
          <button
            key={selectedTxId}
            className="viz-hdr-chip viz-hdr-chip-tx"
            onClick={onBackToLive}
          >
            <span className="viz-hdr-chip-dot viz-hdr-chip-dot-tx" />
            TX #{selectedTxId}
            <span className="viz-hdr-chip-dismiss">
              <X size={12} strokeWidth={2} aria-hidden />
            </span>
          </button>
        )}
        <button
          className={`viz-hdr-chip viz-hdr-chip-toggle ${animationEnabled ? 'active' : ''}`}
          onClick={onToggleAnimation}
        >
          <span
            className={`viz-hdr-chip-dot ${animationEnabled ? 'viz-hdr-chip-dot-on' : ''}`}
          />
          {animationEnabled ? 'Animate' : 'Paused'}
        </button>
        <button
          className="viz-hdr-chip viz-hdr-chip-fullscreen"
          onClick={onToggleFullscreen}
          title={fullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
        >
          {fullscreen ? (
            <Minimize2 size={16} strokeWidth={2} aria-hidden />
          ) : (
            <Maximize2 size={16} strokeWidth={2} aria-hidden />
          )}
        </button>
      </div>
    </header>
  );
}
