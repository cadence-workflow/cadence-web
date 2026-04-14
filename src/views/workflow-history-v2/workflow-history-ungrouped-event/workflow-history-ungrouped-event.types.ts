import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';
import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import { type UngroupedEventInfo } from '../workflow-history-ungrouped-table/workflow-history-ungrouped-table.types';

export type Props = {
  // Core data props
  eventInfo: UngroupedEventInfo;
  workflowStartTimeMs: number | null;
  decodedPageUrlParams: WorkflowPageTabsParams;

  // Workflow state props (for "Starts in" badge)
  workflowIsArchived: boolean;
  workflowCloseStatus: WorkflowExecutionCloseStatus | null | undefined;
  loadingMoreEvents: boolean;

  // Expansion state
  isExpanded: boolean;
  toggleIsExpanded: () => void;

  // UI behavior
  animateOnEnter?: boolean;
  onReset?: () => void;
  onClickShowInTimeline: () => void;
};
