'use client';

import React from 'react';
import { CodeBlock } from '../../CodeBlock';

export default function ProseMirrorPlugins() {
  return (
    <div className='plugins-tab'>
      {/* 1. Intro */}
      <div className='demo-card prosemirror-section plugins-intro'>
        <div className='card-header'>
          <h3>What is a Plugin?</h3>
        </div>
        <div className='card-content'>
          <p>
            <strong>Plugins</strong> extend ProseMirror with custom state,
            props, and behavior. They hook into the editor lifecycle: filter
            transactions, store state, add keybindings, and attach UI. Pass them
            to <code>{`EditorState.create({ plugins: [...] })`}</code>.
          </p>
          <div className='plugins-intro-tagline'>
            History, keymap, input rules, and collab are all plugins.
          </div>
        </div>
      </div>

      {/* 2. Plugin Spec — one section, one example */}
      <div className='demo-card prosemirror-section'>
        <div className='card-header'>
          <h4>Plugin Spec</h4>
        </div>
        <div className='card-content'>
          <p>
            A plugin is <code>new Plugin(spec)</code>. The spec defines how it
            participates in the editor lifecycle.
          </p>
          <div className='plugins-spec-grid'>
            <div className='plugins-spec-card'>
              <code>state</code>
              <p>
                Init and reconcile plugin state when transactions are applied
              </p>
            </div>
            <div className='plugins-spec-card'>
              <code>props</code>
              <p>
                Add handlers to the view (handleDOMEvents, decorations, etc.)
              </p>
            </div>
            <div className='plugins-spec-card'>
              <code>view</code>
              <p>Optional EditorView extension (tooltip, menu, DOM overlay)</p>
            </div>
            <div className='plugins-spec-card'>
              <code>filterTransaction</code>
              <p>Reject or modify transactions before they&apos;re applied</p>
            </div>
          </div>
          <details className='plugins-spec-accordion'>
            <summary>Example: word count plugin</summary>
            <div className='code-snippet'>
              <CodeBlock
                code={`const wordCountPlugin = new Plugin({
  state: {
    init() { return { words: 0 }; },
    apply(tr, value) {
      if (!tr.docChanged) return value;
      const text = tr.doc.textBetween(0, tr.doc.content.size);
      return { words: text.trim() ? text.trim().split(/\\s+/).length : 0 };
    },
  },
  filterTransaction(tr) { return true; },
});

// Access: state.pluginState(wordCountPlugin)?.words`}
              />
            </div>
          </details>
        </div>
      </div>

      {/* 3. Common Plugins */}
      <div className='demo-card prosemirror-section'>
        <div className='card-header'>
          <h4>Common Plugins</h4>
        </div>
        <div className='card-content'>
          <p>
            ProseMirror ships with core plugins. Import from{' '}
            <code>prosemirror-history</code>, <code>prosemirror-keymap</code>,
            and similar packages.
          </p>
          <div className='plugins-list'>
            <div className='plugins-list-item'>
              <span className='plugins-list-name'>history()</span>
              <span className='plugins-list-desc'>
                Undo/redo. Stores inverse steps; <code>undo</code> and{' '}
                <code>redo</code> commands apply them.
              </span>
            </div>
            <div className='plugins-list-item'>
              <span className='plugins-list-name'>keymap(keyBindings)</span>
              <span className='plugins-list-desc'>
                Binds keys to commands. <code>baseKeymap</code> adds Enter,
                Backspace, etc.
              </span>
            </div>
            <div className='plugins-list-item'>
              <span className='plugins-list-name'>inputRules</span>
              <span className='plugins-list-desc'>
                Transform typed text (e.g. &quot;---&quot; → horizontal rule,
                &quot;1. &quot; → ordered list).
              </span>
            </div>
            <div className='plugins-list-item'>
              <span className='plugins-list-name'>collab</span>
              <span className='plugins-list-desc'>
                Collaborative editing. Send/receive steps over the wire; merge
                with CRDT-like logic.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Commands */}
      <div className='demo-card prosemirror-section'>
        <div className='card-header'>
          <h4>Commands</h4>
        </div>
        <div className='card-content'>
          <p>
            <strong>Commands</strong> are functions{' '}
            <code>(state, dispatch, view) → boolean</code>. They read state,
            optionally dispatch a transaction, and return whether they handled
            the action. Used by keymap, menus, and toolbars.
          </p>
          <div className='code-snippet'>
            <CodeBlock
              code={`const boldCommand = (state, dispatch) => {
  const { from, to } = state.selection;
  if (from === to) return false;
  const mark = schema.marks.bold.create();
  if (dispatch) dispatch(state.tr.addMark(from, to, mark));
  return true;
};

keymap({ "Mod-b": boldCommand });`}
            />
          </div>
          <p className='plugins-callout'>
            <strong>Mod</strong> — Cross-platform modifier: <code>Cmd</code> on
            Mac, <code>Ctrl</code> elsewhere. <code>undo</code> and{' '}
            <code>redo</code> from history are commands.
          </p>
        </div>
      </div>

      {/* 5. Wiring it up */}
      <div className='demo-card prosemirror-section'>
        <div className='card-header'>
          <h4>Creating an Editor with Plugins</h4>
        </div>
        <div className='card-content'>
          <p>
            Pass plugins when creating state. Order can matter — e.g. history
            should receive transactions before other plugins that might filter
            them.
          </p>
          <div className='code-snippet'>
            <CodeBlock
              code={`import { history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";

const state = EditorState.create({
  schema,
  plugins: [
    history(),
    keymap(baseKeymap),
    keymap({ "Mod-z": undo, "Mod-y": redo })
  ]
});`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
