import {
  MdListAlt,
  MdOutlineHistory,
  MdOutlineManageSearch,
  MdOutlineTerminal,
} from 'react-icons/md';

import WorkflowHistory from '@/views/workflow-history/workflow-history';
import WorkflowQueries from '@/views/workflow-queries/workflow-queries';
import WorkflowStackTrace from '@/views/workflow-stack-trace/workflow-stack-trace';
import WorkflowSummaryTab from '@/views/workflow-summary-tab/workflow-summary-tab';

import getWorkflowPageErrorConfig from '../helpers/get-workflow-page-error-config';
import WorkflowPagePendingEventsBadge from '../workflow-page-pending-events-badge/workflow-page-pending-events-badge';
import type { WorkflowPageTabsConfig } from '../workflow-page-tabs/workflow-page-tabs.types';

const workflowPageTabsConfig: WorkflowPageTabsConfig<
  'summary' | 'history' | 'queries' | 'stack-trace'
> = {
  summary: {
    title: 'Summary',
    artwork: MdListAlt,
    content: WorkflowSummaryTab,
    getErrorConfig: (err) =>
      getWorkflowPageErrorConfig(
        err,
        'Failed to load workflow summary',
        'summary'
      ),
  },
  history: {
    title: 'History',
    endEnhancer: WorkflowPagePendingEventsBadge,
    artwork: MdOutlineHistory,
    content: WorkflowHistory,
    getErrorConfig: (err) =>
      getWorkflowPageErrorConfig(
        err,
        'Failed to load workflow history',
        'history'
      ),
  },
  queries: {
    title: 'Queries',
    artwork: MdOutlineManageSearch,
    content: WorkflowQueries,
    getErrorConfig: (err) =>
      getWorkflowPageErrorConfig(
        err,
        'Failed to load workflow queries',
        'queries'
      ),
  },
  'stack-trace': {
    title: 'Stack Trace',
    artwork: MdOutlineTerminal,
    content: WorkflowStackTrace,
    getErrorConfig: (err) =>
      getWorkflowPageErrorConfig(
        err,
        'Failed to load workflow stack trace',
        'stack trace'
      ),
  },
} as const;

export default workflowPageTabsConfig;
