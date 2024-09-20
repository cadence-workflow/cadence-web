import type workflowPageTabsConfig from '../config/workflow-page-tabs.config';
import type { WorkflowPageTabsParams } from '../workflow-page-tabs/workflow-page-tabs.types';

export type WorkflowPageTabName =
  (typeof workflowPageTabsConfig)[number]['key'];

export type WorkflowPageTabsContentsMap = {
  [k in (typeof workflowPageTabsConfig)[number]['key']]:
    | React.ComponentType<WorkflowPageTabContentProps>
    | ((props: WorkflowPageTabContentProps) => React.ReactNode);
};

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
