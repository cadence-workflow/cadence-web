/**
 * System attributes as defined by Cadence.
 * These are built-in attributes that are automatically indexed by the system.
 * https://github.com/cadence-workflow/cadence/blob/0f4b6508d8037fc49cc4c689cffe00f35f5a3703/common/definition/indexedKeys.go#L97
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
  // TODO @adhitya.mamallan - add these after pulling the latest IDLs in
  // 'CronSchedule',
  // 'ExecutionStatus',
  // 'ScheduledExecutionTime',
  'ClusterAttributeScope',
  'ClusterAttributeName',
]);
