import type { WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

export type Props = {
  firstHistoryEvent: any; //TODO: @assem.hafez add type form response
  lastHistoryEvent: any; //TODO: @assem.hafez add type form response
  params: WorkflowPageTabContentProps['params'];
};

export type WorkflowSummaryTabDetailsComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

export type WorkflowSummaryTabDetailsConfig = {
  key: string;
  getLabel: () => string;
  valueComponent: React.ComponentType<{
    firstEvent: any;
    lastEvent: any;
    params: Props['params'];
  }>;
  hide?: (args: {
    firstEvent: any;
    lastEvent: any;
    params: Props['params'];
  }) => boolean;
};
