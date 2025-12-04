import { type Timestamp } from '@/__generated__/proto-ts/google/protobuf/Timestamp';
import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import { type UngroupedEventInfo } from '../workflow-history-ungrouped-table/workflow-history-ungrouped-table.types';

export type Props = {
  // Core data props
  eventInfo: UngroupedEventInfo;
  workflowStartTime: Timestamp | null;
  decodedPageUrlParams: WorkflowPageTabsParams;

  // Expansion state
  isExpanded: boolean;
  toggleIsExpanded: () => void;

  // UI behavior
  animateOnEnter?: boolean;
  onReset?: () => void;
};
