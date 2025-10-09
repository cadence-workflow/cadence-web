/**
 * System attributes as defined by Cadence.
 * These are built-in attributes that are automatically indexed by the system.
 * https://github.com/cadence-workflow/cadence/blob/b9e01ea9b881daff690434419b253d1d36fc486a/common/definition/indexedKeys.go#L92
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
