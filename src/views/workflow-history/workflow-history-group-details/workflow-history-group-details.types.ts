import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import { type EventDetailsEntries } from '../workflow-history-event-details/workflow-history-event-details.types';
import { type WorkflowDiagnosticsIssue } from '../workflow-history.types';

export type EventDetailsTabContent = {
  eventDetails: EventDetailsEntries;
  eventLabel: string;
  diagnosticsIssues?: Array<WorkflowDiagnosticsIssue>;
};

export type GroupDetailsEntries = Array<[string, EventDetailsTabContent]>;

export type Props = {
  groupDetailsEntries: GroupDetailsEntries;
  initialEventId: string | undefined;
  isUngroupedView?: boolean;
  isScrollable?: boolean;
  workflowPageParams: WorkflowPageParams;
  onClose?: () => void;
  onClickShowInTimeline?: () => void;
  onClickShowInTable?: () => void;
  getIsDiagnosticsIssueExpanded: (issueExpansionId: string) => boolean;
  toggleIsDiagnosticsIssueExpanded: (issueExpansionId: string) => void;
};
