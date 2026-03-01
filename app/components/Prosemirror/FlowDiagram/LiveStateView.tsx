'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { LiveState } from './types';

type Props = { liveState: LiveState };

function FlashCard({ title, children, version }: { title: string; children: React.ReactNode; version: number }) {
  const [flash, setFlash] = useState(false);
  const prevVersion = useRef(version);

  useEffect(() => {
    if (prevVersion.current !== version) {
      prevVersion.current = version;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 500);
      return () => clearTimeout(t);
    }
  }, [version]);

  return (
    <div className={`pm-ls-card ${flash ? 'pm-ls-card-flash' : ''}`}>
      <h4 className="pm-ls-card-title">{title}</h4>
      {children}
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string | number; accent?: boolean }) {
  return (
    <div className="pm-ls-row">
      <span className="pm-ls-key">{k}</span>
      <span className={`pm-ls-val ${accent ? 'pm-ls-val-accent' : ''}`}>{v}</span>
    </div>
  );
}

export function LiveStateView({ liveState: s }: Props) {
  return (
    <div className="pm-ls-container">
      <FlashCard title="Document" version={s.charCount}>
        <Row k="char count" v={s.charCount} accent />
        <Row k="node count" v={s.nodeCount} />
        <Row k="version" v={s.version} />
        <Row k="has marks" v={s.hasMarks ? 'yes' : 'no'} />
      </FlashCard>

      <FlashCard title="Selection" version={s.selFrom + s.selTo}>
        <Row k="type" v={s.selType} accent />
        <Row k="collapsed" v={s.selCollapsed ? 'yes' : 'no'} />
        <Row k="from" v={s.selFrom} />
        <Row k="to" v={s.selTo} />
        {s.selText && <Row k="selected" v={`"${s.selText}"`} />}
      </FlashCard>

      <FlashCard title="Active Marks" version={s.activeMarks.length}>
        {s.activeMarks.length === 0 ? (
          <span className="pm-ls-none">none</span>
        ) : (
          s.activeMarks.map((m) => (
            <span key={m} className="pm-ls-mark-chip">{m}</span>
          ))
        )}
      </FlashCard>

      <FlashCard title="Transaction History" version={s.totalTx}>
        <Row k="total" v={s.totalTx} accent />
        <Row k="doc changes" v={s.docChanges} />
        <Row k="sel changes" v={s.selChanges} />
        <Row k="mark changes" v={s.markChanges} />
        <Row k="history ops" v={s.historyOps} />
      </FlashCard>
    </div>
  );
}
