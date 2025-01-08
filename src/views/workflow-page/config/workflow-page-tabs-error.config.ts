import getWorkflowPageErrorConfig from '../helpers/get-workflow-page-error-config';
import { type WorkflowPageTabsErrorConfig } from '../workflow-page-tabs-error/workflow-page-tabs-error.types';

const workflowPageTabsErrorConfig: WorkflowPageTabsErrorConfig = {
  summary: (err) =>
    getWorkflowPageErrorConfig(
      err,
      'Failed to load workflow summary',
      'summary'
    ),
  history: (err) =>
    getWorkflowPageErrorConfig(
      err,
      'Failed to load workflow history',
      'history'
    ),
  queries: (err) =>
    getWorkflowPageErrorConfig(
      err,
      'Failed to load workflow queries',
      'queries'
    ),
  'stack-trace': (err) =>
    getWorkflowPageErrorConfig(
      err,
      'Failed to load workflow stack trace',
      'stack trace'
    ),
} as const;

export default workflowPageTabsErrorConfig;
