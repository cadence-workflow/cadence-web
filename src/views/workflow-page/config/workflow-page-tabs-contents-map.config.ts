import WorkflowHistory from '@/views/workflow-history/workflow-history';
import WorkflowSummaryTab from '@/views/workflow-summary-tab/workflow-summary-tab';

import type { WorkflowPageTabsContentsMap } from '../workflow-page-tab-content/workflow-page-tab-content.types';

const workflowPageTabsContentsMapConfig = {
  summary: WorkflowSummaryTab,
  history: WorkflowHistory,
} as const satisfies WorkflowPageTabsContentsMap;

export default workflowPageTabsContentsMapConfig;
