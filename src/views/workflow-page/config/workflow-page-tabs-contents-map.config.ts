import type { WorkflowPageTabsContentsMap } from '../workflow-page-tab-content/workflow-page-tab-content.types';

const workflowPageTabsContentsMapConfig = {
  // TODO: @assem.hafez add summary tab
  summary: (props: any) => null,
} as const satisfies WorkflowPageTabsContentsMap;

export default workflowPageTabsContentsMapConfig;
