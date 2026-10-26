export const MARKDOC_WORKFLOW_PAYLOAD_PLACEHOLDERS = {
  missingContext: 'Workflow data needs a domain, cluster and workflowId',
  missingRunId: 'A runId is required when workflowId is set',
  running: 'Workflow is still running',
  archived: 'Workflow is archived, result is only available in history',
  archivedSearchAttributes:
    'Search attributes are not available for archived workflows',
  noValue: 'No value',
} as const;
