/**
 * System attributes as defined by Cadence.
 * These are built-in attributes that are automatically indexed by the system.
 * https://github.com/cadence-workflow/cadence/blob/5c79d73b2bd31ae492c84d780b5b4fb7afdc2417/common/definition/indexedKeys.go#L94
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
  'ClusterAttributeScope',
  'ClusterAttributeName',
]);
