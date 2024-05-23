import workflowPageTabsConfig from '../config/workflow-page-tabs.config';
import type { WorkflowPageTabsParams } from '../workflow-page-tabs/workflow-page-tabs.types';

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
  workflowTab: (typeof workflowPageTabsConfig)[number]['key'];
};

export type WorkflowPageTabContentProps = {
  params: WorkflowPageTabsParams;
};

export type Props = {
  params: WorkflowPageTabsParams;
};
