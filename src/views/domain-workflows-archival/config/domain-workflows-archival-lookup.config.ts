import { type ArchivalLookupConfig } from '../domain-workflows-archival-lookup/domain-workflows-archival-lookup.types';

const domainWorkflowsArchivalLookupConfig = {
  title: 'View a specific archived workflow',
  description:
    'This domain has history archival enabled, but not visibility archival, so archived workflows cannot be listed here. Enter the workflow ID and run ID of an execution below to view its archived history directly. Enabling visibility archival for this domain will also let you list and search archived workflows on this page.',
  workflowIdLabel: 'Workflow ID',
  workflowIdPlaceholder: 'Enter workflow ID',
  runIdLabel: 'Run ID',
  runIdPlaceholder: 'Enter run ID',
  submitButtonLabel: 'View workflow',
} as const satisfies ArchivalLookupConfig;

export default domainWorkflowsArchivalLookupConfig;
