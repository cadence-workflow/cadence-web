import {
  type HistoryEventsGroup,
  type Props as WorkflowHistoryProps,
  type WorkflowDiagnosticsIssuesByEventId,
} from '../workflow-history.types';

export type Props = {
  eventGroup: HistoryEventsGroup;
  decodedPageUrlParams: WorkflowHistoryProps['params'];
  onClickShowInTable: () => void;
  onClose: () => void;
  workflowDiagnosticsByEventIdMap: WorkflowDiagnosticsIssuesByEventId;
};
