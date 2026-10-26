import {
  MdListAlt,
  MdOutlineHistory,
  MdOutlineManageSearch,
  MdOutlineTerminal,
  MdOutlineHome,
} from 'react-icons/md';
import { RiStethoscopeLine } from 'react-icons/ri';

import getWorkflowDiagnosticsErrorConfig from '@/views/workflow-diagnostics/helpers/get-workflow-diagnostics-error-config';
import WorkflowDiagnostics from '@/views/workflow-diagnostics/workflow-diagnostics';
import WorkflowHistoryWrapper from '@/views/workflow-history/workflow-history-wrapper/workflow-history-wrapper';
import WorkflowHome from '@/views/workflow-home/workflow-home';
import WorkflowQueries from '@/views/workflow-queries/workflow-queries';
import WorkflowStackTrace from '@/views/workflow-stack-trace/workflow-stack-trace';
import WorkflowSummary from '@/views/workflow-summary/workflow-summary';

import getWorkflowPageErrorConfig from '../helpers/get-workflow-page-error-config';
import WorkflowPageDiagnosticsBadge from '../workflow-page-diagnostics-badge/workflow-page-diagnostics-badge';
import WorkflowPageHistoryBadges from '../workflow-page-history-badges/workflow-page-history-badges';
import WorkflowPageHomeBadge from '../workflow-page-home-badge/workflow-page-home-badge';
import type { WorkflowPageTabsConfig } from '../workflow-page-tabs/workflow-page-tabs.types';

const workflowPageTabsConfig: WorkflowPageTabsConfig<
  'summary' | 'home' | 'history' | 'queries' | 'stack-trace' | 'diagnostics'
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
    endEnhancer: WorkflowPageHomeBadge,
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
  diagnostics: {
    title: 'Diagnostics',
    endEnhancer: WorkflowPageDiagnosticsBadge,
    artwork: RiStethoscopeLine,
    content: WorkflowDiagnostics,
    getErrorConfig: getWorkflowDiagnosticsErrorConfig,
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
