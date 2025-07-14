import type {
  WorkflowPageTabName,
  WorkflowPageTabsParams,
} from '../workflow-page-tabs/workflow-page-tabs.types';

export type WorkflowPageTabContent =
  | React.ComponentType<WorkflowPageTabContentProps>
  | ((props: WorkflowPageTabContentProps) => React.ReactNode);

export type WorkflowPageTabContentParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  workflowTab: WorkflowPageTabName;
};

export type WorkflowPageTabContentProps = {
  params: WorkflowPageTabsParams;
};

export type Props = {
  params: WorkflowPageTabsParams;
};
