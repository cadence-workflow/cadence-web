export const DEFAULT_WORKFLOWS_LIST_COLUMNS = [
  'WorkflowID',
  'CloseStatus',
  'RunID',
  'WorkflowType',
  'StartTime',
  'CloseTime',
] as const satisfies Array<string>;

export const DEFAULT_WORKFLOWS_LIST_COLUMN_WIDTH = 'minmax(200px, 2fr)';
