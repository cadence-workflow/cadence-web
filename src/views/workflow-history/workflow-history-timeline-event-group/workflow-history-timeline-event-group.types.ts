import {
  type HistoryEventsGroup,
  type Props as WorkflowHistoryProps,
} from '../workflow-history.types';

export type Props = {
  eventGroup: HistoryEventsGroup;
  decodedPageUrlParams: WorkflowHistoryProps['params'];
  onClickShowInTable: () => void;
  onClose: () => void;
  getIsDiagnosticsIssueExpanded: (issueExpansionId: string) => boolean;
  toggleIsDiagnosticsIssueExpanded: (issueExpansionId: string) => void;
};
