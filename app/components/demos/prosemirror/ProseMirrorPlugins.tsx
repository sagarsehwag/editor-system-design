'use client';

import React from 'react';

export default function ProseMirrorPlugins() {
  return (
    <div className='plugins-tab'>
      <div className='prosemirror-section plugins-intro'>
        <h3>What is a Plugin?</h3>
        <p>
          <strong>Plugins</strong> extend Prosemirror with custom state, props,
          and behavior. Each plugin can store its own state, react to
          transactions, add keybindings, and attach UI. They&apos;re passed to{' '}
          <code>{`EditorState.create({ plugins: [...] })`}</code>.
        </p>
        <div className='plugins-intro-tagline'>
          History, keymap, input rules, and collab are all plugins.
        </div>
      </div>

      <div className='prosemirror-section'>
        <h4>Plugin Spec</h4>
        <p>
          A plugin is created with <code>new Plugin(spec)</code>. The spec
          defines how the plugin participates in the editor lifecycle.
        </p>
        <div className='plugins-spec-grid'>
          <div className='plugins-spec-card'>
            <code>state</code>
            <p>Init and reconcile plugin state when transactions are applied</p>
          </div>
          <div className='plugins-spec-card'>
            <code>props</code>
            <p>Add handlers to the view (keymap, nodeViews)</p>
          </div>
          <div className='plugins-spec-card'>
            <code>view</code>
            <p>Optional EditorView extension (e.g. tooltip, menu)</p>
          </div>
          <div className='plugins-spec-card'>
            <code>filterTransaction</code>
            <p>Reject or modify transactions before they&apos;re applied</p>
          </div>
        </div>
      </div>

      <div className='prosemirror-section'>
        <h4>Plugin State</h4>
        <p>
          Plugins store immutable state. When a transaction is applied, each
          plugin&apos;s <code>state.apply(tr, oldState, newState)</code> is
          called to produce new plugin state. Access it via{' '}
          <code>state.pluginState(plugin)</code>.
        </p>
        <div className='code-snippet'>
          <pre>
            <code>{`const myPlugin = new Plugin({
  state: {
    init() { return { count: 0 }; },
    apply(tr, value) {
      return tr.docChanged ? { count: value.count + 1 } : value;
    }
  }
});

const count = state.pluginState(myPlugin)?.count;`}</code>
          </pre>
        </div>
      </div>

      <div className='prosemirror-section'>
        <h4>Common Plugins</h4>
        <p>
          Prosemirror ships with core plugins. Import from{' '}
          <code>prosemirror-history</code>, <code>prosemirror-keymap</code>, and
          similar packages.
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

      <div className='prosemirror-section'>
        <h4>Commands</h4>
        <p>
          <strong>Commands</strong> are functions{' '}
          <code>(state, dispatch, view) → boolean</code>. They read state,
          optionally dispatch a transaction, and return whether they handled the
          action. Used by keymap, menus, and toolbars.
        </p>
        <div className='code-snippet'>
          <pre>
            <code>{`const boldCommand = (state, dispatch) => {
  const { from, to } = state.selection;
  if (from === to) return false;
  const mark = schema.marks.bold.create();
  if (dispatch) dispatch(state.tr.addMark(from, to, mark));
  return true;
};

// Bind to Ctrl+B
keymap({ "Mod-b": boldCommand });`}</code>
          </pre>
        </div>
        <p className='plugins-callout'>
          <strong>Mod</strong> — Cross-platform modifier: <code>Cmd</code> on
          Mac, <code>Ctrl</code> elsewhere. <code>undo</code> and{' '}
          <code>redo</code> from history plugin are commands.
        </p>
      </div>

      <div className='prosemirror-section'>
        <h4>Creating an Editor with Plugins</h4>
        <p>
          Pass plugins when creating state. Order can matter — e.g. history
          should receive transactions before other plugins that might filter
          them.
        </p>
        <div className='code-snippet'>
          <pre>
            <code>{`import { history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";

const state = EditorState.create({
  schema,
  plugins: [
    history(),
    keymap(baseKeymap),
    keymap({ "Mod-z": undo, "Mod-y": redo })
  ]
});`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
