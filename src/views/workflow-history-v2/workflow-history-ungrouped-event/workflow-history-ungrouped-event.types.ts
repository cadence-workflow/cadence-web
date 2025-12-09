import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import { type UngroupedEventInfo } from '../workflow-history-ungrouped-table/workflow-history-ungrouped-table.types';

export type Props = {
  // Core data props
  eventInfo: UngroupedEventInfo;
  workflowStartTimeMs: number | null;
  decodedPageUrlParams: WorkflowPageTabsParams;

  // Expansion state
  isExpanded: boolean;
  toggleIsExpanded: () => void;

  // UI behavior
  animateOnEnter?: boolean;
  onReset?: () => void;
};
