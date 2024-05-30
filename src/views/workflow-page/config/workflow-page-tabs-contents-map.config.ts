import WorkflowSummaryTab from '@/views/workflow-summary-tab/workflow-summary-tab';
import type { WorkflowPageTabsContentsMap } from '../workflow-page-tab-content/workflow-page-tab-content.types';

const workflowPageTabsContentsMapConfig = {
  summary: WorkflowSummaryTab,
} as const satisfies WorkflowPageTabsContentsMap;

export default workflowPageTabsContentsMapConfig;
