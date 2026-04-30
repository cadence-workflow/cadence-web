export const BATCH_ACTIONS_NEW_ACTION_VISIBLE_COLUMN_IDS = [
  'RunID',
  'CloseStatus',
  'WorkflowID',
  'WorkflowType',
] as const;

// Approx total height of the page chrome above the workflows list:
//   AppNavBar + DomainPageHeader + DomainPageTabs +
//   DetailPanel padding + panel Header + InfoBanner + DomainWorkflowsHeader.
// Update this if any of those change height.
export const WORKFLOWS_LIST_MAX_HEIGHT = 'calc(100dvh - 530px)';
