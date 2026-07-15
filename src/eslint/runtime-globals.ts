import type { Linter } from 'eslint';
import globals from 'globals';

export const browserGlobals: Linter.Globals = globals.browser;
export const nodeGlobals: Linter.Globals = globals.node;
export const bunGlobals: Linter.Globals = {
  ...globals.node,
  alert: 'readonly',
  BuildMessage: 'readonly',
  Bun: 'readonly',
  confirm: 'readonly',
  HTMLRewriter: 'readonly',
  prompt: 'readonly',
  ResolveMessage: 'readonly',
  ShadowRealm: 'readonly',
};
