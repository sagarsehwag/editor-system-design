'use client';

import React from 'react';
import type { ProseMirrorProps, ProseMirrorTab } from './types';
import ProseMirrorOverview from './ProseMirrorOverview';
import ProseMirrorSchema from './ProseMirrorSchema';
import ProseMirrorState from './ProseMirrorState';
import ProseMirrorView from './ProseMirrorView';
import ProseMirrorPositions from './ProseMirrorPositions';
import ProseMirrorImmutable from './ProseMirrorImmutable';
import ProseMirrorTransactions from './ProseMirrorTransactions';
import ProseMirrorPlugins from './ProseMirrorPlugins';
import './styles/index.css';

export type { ProseMirrorTab, ProseMirrorProps };

export default function ProseMirror({ activeTab }: ProseMirrorProps) {
  const show = (tab: ProseMirrorTab) => !activeTab || activeTab === tab;

  return (
    <section id="prosemirror" className="demo-section active">
      <div className="demo-header">
        <h2>Prosemirror</h2>
        <p className="demo-subtitle">
          The schema-based editor toolkit — document model, positions, transforms, and why it enables
          undo &amp; collaborative editing
        </p>
      </div>

      {show('overview') && <ProseMirrorOverview />}
      {show('schema') && <ProseMirrorSchema />}
      {show('state') && <ProseMirrorState />}
      {show('transform') && <ProseMirrorTransactions />}
      {show('view') && <ProseMirrorView />}
      {show('positions') && <ProseMirrorPositions />}
      {show('plugins') && <ProseMirrorPlugins />}
      {show('immutable') && <ProseMirrorImmutable />}
    </section>
  );
}
