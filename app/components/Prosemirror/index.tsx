'use client';

import React from 'react';
import type { ProseMirrorProps, ProseMirrorTab } from './types';
import ProseMirrorOverview from './Overview/ProseMirrorOverview';
import ProseMirrorSchema from './Schema/ProseMirrorSchema';
import ProseMirrorState from './State/ProseMirrorState';
import ProseMirrorTransactions from './Transform/ProseMirrorTransactions';
import ProseMirrorView from './View/ProseMirrorView';
import ProseMirrorPositions from './Positions/ProseMirrorPositions';
import ProseMirrorImmutable from './Immutable/ProseMirrorImmutable';
import ProseMirrorPlugins from './Plugins/ProseMirrorPlugins';

import './shared.css';
import './Overview/Overview.css';
import './Schema/Schema.css';
import './State/State.css';
import './Transform/Transform.css';
import './View/View.css';
import './Positions/Positions.css';
import './Plugins/Plugins.css';
import './Immutable/Immutable.css';

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
