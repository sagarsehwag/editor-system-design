export type ProseMirrorTab =
  | 'overview'
  | 'schema'
  | 'state'
  | 'view'
  | 'positions'
  | 'immutable'
  | 'transform'
  | 'plugins';

export interface ProseMirrorProps {
  activeTab?: ProseMirrorTab;
}
