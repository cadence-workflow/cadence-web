import { type WorkflowPageTabContentProps } from '../workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

export type Props = WorkflowPageTabContentProps;

export type VisibleHistoryRanges = {
  groupedStartIndex: number;
  groupedEndIndex: number;
  ungroupedStartIndex: number;
  ungroupedEndIndex: number;
};
