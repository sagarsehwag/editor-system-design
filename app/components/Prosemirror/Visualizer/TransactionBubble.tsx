'use client';

import React from 'react';
import type { TransactionRecord } from './types';

type TransactionBubbleProps = {
  record: TransactionRecord;
  isSelected: boolean;
  onClick: () => void;
};

function StepChips({ record }: { record: TransactionRecord }) {
  if (record.steps.length === 0) return null;
  return (
    <div className="viz-tr-chips">
      {record.steps.map((s, i) => {
        if (s.type === 'insert')
          return <span key={i} className="viz-chip viz-chip-insert">INSERT +{s.delta}</span>;
        if (s.type === 'delete')
          return <span key={i} className="viz-chip viz-chip-delete">DELETE {s.delta}</span>;
        if (s.type === 'mark')
          return <span key={i} className="viz-chip viz-chip-mark">{(s.cmd || 'MARK').toUpperCase()}</span>;
        if (s.type === 'hist')
          return <span key={i} className="viz-chip viz-chip-hist">{(s.action || 'HIST').toUpperCase()}</span>;
        return <span key={i} className="viz-chip viz-chip-sel">{s.type.toUpperCase()}</span>;
      })}
    </div>
  );
}

export function TransactionBubble({ record, isSelected, onClick }: TransactionBubbleProps) {
  const delta = record.charsAfter - record.charsBefore;
  return (
    <div
      className={`viz-tr-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="viz-tr-card-top">
        <span className="viz-tr-card-id">#{record.id}</span>
        <span className="viz-tr-card-time">{record.time}</span>
      </div>
      <div className={`viz-tr-card-type viz-tr-type-${record.type}`}>
        {record.type.toUpperCase()}
      </div>
      <StepChips record={record} />
      {record.steps.length === 0 && (
        <div className="viz-tr-card-nosteps">no steps</div>
      )}
      <div className="viz-tr-card-meta">
        chars: {record.charsBefore}→{record.charsAfter}
        {delta !== 0 && (
          <span style={{ color: delta > 0 ? 'var(--accent-green)' : 'var(--accent-red)', marginLeft: 4 }}>
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>
    </div>
  );
}
