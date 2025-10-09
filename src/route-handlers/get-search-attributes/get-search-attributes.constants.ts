/**
 * System attributes as defined by Cadence.
 * These are built-in attributes that are automatically indexed by the system.
 */
export const SYSTEM_SEARCH_ATTRIBUTES: Set<string> = new Set([
  'DomainID',
  'WorkflowID',
  'RunID',
  'WorkflowType',
  'StartTime',
  'ExecutionTime',
  'CloseTime',
  'CloseStatus',
  'HistoryLength',
  'TaskList',
  'IsCron',
  'NumClusters',
  'UpdateTime',
]);
