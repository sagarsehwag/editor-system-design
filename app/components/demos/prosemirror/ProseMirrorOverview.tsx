'use client';

import React from 'react';

export default function ProseMirrorOverview() {
  return (
    <>
      <div className="prosemirror-callout">
        <h3>🎯 Your code gets full control</h3>
        <p>
          The document is not a blob of HTML but a custom data structure. All updates go through a
          single point (transactions). Schema enforces what can exist where.
        </p>
      </div>

      <div className="demo-grid four-cols">
        <div className="demo-card">
          <div className="card-header">
            <h3>prosemirror-model</h3>
            <span className="badge badge-blue">Document</span>
          </div>
          <div className="card-content">
            <p>Document structure: Node, Fragment, Schema. Defines the data shape.</p>
          </div>
          <div className="card-footer">
            <ul className="pros-cons">
              <li className="pro">Node types, marks</li>
              <li className="pro">Content expressions</li>
            </ul>
          </div>
        </div>
        <div className="demo-card">
          <div className="card-header">
            <h3>prosemirror-state</h3>
            <span className="badge badge-green">State</span>
          </div>
          <div className="card-content">
            <p>EditorState, selection, transactions. Single source of truth.</p>
          </div>
          <div className="card-footer">
            <ul className="pros-cons">
              <li className="pro">Immutable updates</li>
              <li className="pro">Plugin state</li>
            </ul>
          </div>
        </div>
        <div className="demo-card">
          <div className="card-header">
            <h3>prosemirror-view</h3>
            <span className="badge badge-purple">UI</span>
          </div>
          <div className="card-content">
            <p>DOM rendering, event handling, contentEditable. Derives from state.</p>
          </div>
          <div className="card-footer">
            <ul className="pros-cons">
              <li className="pro">Efficient diffing</li>
              <li className="pro">Native cursor</li>
            </ul>
          </div>
        </div>
        <div className="demo-card">
          <div className="card-header">
            <h3>prosemirror-transform</h3>
            <span className="badge badge-orange">Changes</span>
          </div>
          <div className="card-content">
            <p>Steps, transforms, invertible operations. Enables undo &amp; collab.</p>
          </div>
          <div className="card-footer">
            <ul className="pros-cons">
              <li className="pro">Invertible steps</li>
              <li className="pro">Step maps</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
