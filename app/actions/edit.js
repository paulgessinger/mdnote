export const EDITOR_OPEN = 'EDITOR_OPEN';
export const EDITOR_CLOSE = 'EDITOR_CLOSE';

export function editorOpen() {
  return {
    type: EDITOR_OPEN
  };
}

export function editorClose() {
  return {
    type: EDITOR_CLOSE
  };
}
