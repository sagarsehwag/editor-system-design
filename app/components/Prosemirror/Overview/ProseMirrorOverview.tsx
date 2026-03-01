'use client';

import React from 'react';
import dynamic from 'next/dynamic';
const ProseMirrorVisualizer = dynamic(
  () => import('../Visualizer/ProseMirrorVisualizer'),
  { ssr: false },
);

export default function ProseMirrorOverview() {
  return (
    <>
      <div className='demo-card prosemirror-section overview-libraries'>
        <div className='card-header'>
          <h3>Core Libraries</h3>
        </div>
        <div className='card-content'>
          <p>
            ProseMirror is not a single monolithic library — it&apos;s a
            collection of small, focused modules that each handle one concern.
            Together they form a toolkit for building rich text editors with
            full control over document structure, state management, rendering,
            and change tracking.
          </p>
          <div className='demo-grid four-cols'>
            <div className='demo-card'>
              <div className='card-header'>
                <h3>prosemirror-model</h3>
                <span className='badge badge-blue'>Document</span>
              </div>
              <div className='card-content'>
                <p>
                  Document structure: Node, Fragment, Schema. Defines the data
                  shape.
                </p>
              </div>
              <div className='card-footer'>
                <ul className='pros-cons'>
                  <li className='pro'>Node types, marks</li>
                  <li className='pro'>Content expressions</li>
                </ul>
              </div>
            </div>
            <div className='demo-card'>
              <div className='card-header'>
                <h3>prosemirror-state</h3>
                <span className='badge badge-green'>State</span>
              </div>
              <div className='card-content'>
                <p>
                  EditorState, selection, transactions. Single source of truth.
                </p>
              </div>
              <div className='card-footer'>
                <ul className='pros-cons'>
                  <li className='pro'>Immutable updates</li>
                  <li className='pro'>Plugin state</li>
                </ul>
              </div>
            </div>
            <div className='demo-card'>
              <div className='card-header'>
                <h3>prosemirror-view</h3>
                <span className='badge badge-purple'>UI</span>
              </div>
              <div className='card-content'>
                <p>
                  DOM rendering, event handling, contentEditable. Derives from
                  state.
                </p>
              </div>
              <div className='card-footer'>
                <ul className='pros-cons'>
                  <li className='pro'>Efficient diffing</li>
                  <li className='pro'>Native cursor</li>
                </ul>
              </div>
            </div>
            <div className='demo-card'>
              <div className='card-header'>
                <h3>prosemirror-transform</h3>
                <span className='badge badge-orange'>Changes</span>
              </div>
              <div className='card-content'>
                <p>
                  Steps, transforms, invertible operations. Enables undo &amp;
                  collab.
                </p>
              </div>
              <div className='card-footer'>
                <ul className='pros-cons'>
                  <li className='pro'>Invertible steps</li>
                  <li className='pro'>Step maps</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProseMirrorVisualizer />
    </>
  );
}
