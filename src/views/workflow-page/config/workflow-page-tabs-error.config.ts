import getWorkflowPageErrorConfig from '../helpers/get-workflow-page-error-config';
import { type WorkflowPageTabsErrorConfig } from '../workflow-page-tabs-error/workflow-page-tabs-error.types';

const workflowPageTabsErrorConfig: WorkflowPageTabsErrorConfig = {
  summary: (err) =>
    getWorkflowPageErrorConfig(err, 'Failed to load workflow summary'),
  history: (err) =>
    getWorkflowPageErrorConfig(err, 'Failed to load workflow history'),
  queries: (err) =>
    getWorkflowPageErrorConfig(err, 'Failed to load workflow queries'),
  'stack-trace': (err) =>
    getWorkflowPageErrorConfig(err, 'Failed to load workflow stack trace'),
} as const;

export default workflowPageTabsErrorConfig;
