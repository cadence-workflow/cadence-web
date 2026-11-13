import {
  MdListAlt,
  MdOutlineHistory,
  MdOutlineManageSearch,
  MdOutlineTerminal,
  MdOutlineHome,
} from 'react-icons/md';

import WorkflowHistoryWrapper from '@/views/workflow-history/workflow-history-wrapper/workflow-history-wrapper';
import WorkflowHome from '@/views/workflow-home/workflow-home';
import WorkflowQueries from '@/views/workflow-queries/workflow-queries';
import WorkflowStackTrace from '@/views/workflow-stack-trace/workflow-stack-trace';
import WorkflowSummary from '@/views/workflow-summary/workflow-summary';

import getWorkflowPageErrorConfig from '../helpers/get-workflow-page-error-config';
import WorkflowPageHistoryBadges from '../workflow-page-history-badges/workflow-page-history-badges';
import type { WorkflowPageTabsConfig } from '../workflow-page-tabs/workflow-page-tabs.types';

const workflowPageTabsConfig: WorkflowPageTabsConfig<
  'summary' | 'home' | 'history' | 'queries' | 'stack-trace'
> = {
  summary: {
    title: 'Summary',
    artwork: MdListAlt,
    content: WorkflowSummary,
    getErrorConfig: (err) =>
      getWorkflowPageErrorConfig(
        err,
        'Failed to load workflow summary',
        'summary'
      ),
  },
  home: {
    title: 'Home',
    artwork: MdOutlineHome,
    content: WorkflowHome,
    getErrorConfig: (err) =>
      getWorkflowPageErrorConfig(err, 'Failed to load home page', 'home page'),
  },
  history: {
    title: 'History',
    endEnhancer: WorkflowPageHistoryBadges,
    artwork: MdOutlineHistory,
    content: WorkflowHistoryWrapper,
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
