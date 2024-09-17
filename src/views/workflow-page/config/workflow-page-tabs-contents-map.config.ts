import WorkflowHistory from '@/views/workflow-history/workflow-history';
import WorkflowQueries from '@/views/workflow-queries/workflow-queries';
import WorkflowSummaryTab from '@/views/workflow-summary-tab/workflow-summary-tab';

import type { WorkflowPageTabsContentsMap } from '../workflow-page-tab-content/workflow-page-tab-content.types';

const workflowPageTabsContentsMapConfig = {
  summary: WorkflowSummaryTab,
  history: WorkflowHistory,
  queries: WorkflowQueries,
} as const satisfies WorkflowPageTabsContentsMap;

export default workflowPageTabsContentsMapConfig;
