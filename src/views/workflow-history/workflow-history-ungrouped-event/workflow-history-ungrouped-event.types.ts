import { type Timestamp } from '@/__generated__/proto-ts/google/protobuf/Timestamp';
import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import {
  type HistoryGroupEventMetadata,
  type PendingActivityTaskStartEvent,
  type PendingDecisionTaskStartEvent,
} from '../workflow-history.types';

export type WorkflowHistoryUngroupedEventInfo = {
  id: string;
  label: string;
  shortLabel?: string;
  event:
    | HistoryEvent
    | PendingDecisionTaskStartEvent
    | PendingActivityTaskStartEvent;
  eventMetadata: HistoryGroupEventMetadata;
  canReset?: boolean;
};

export type Props = {
  // Core data props
  eventInfo: WorkflowHistoryUngroupedEventInfo;
  workflowStartTime: Timestamp | null;
  decodedPageUrlParams: WorkflowPageTabsParams;

  // Expansion state
  isExpanded: boolean;
  toggleIsExpanded: () => void;

  // UI behavior
  animateOnEnter?: boolean;
  onReset?: () => void;
};
