import type { WorkflowPageParams } from '../workflow-page.types';

export const PLACEHOLDER_MAP: Record<string, keyof WorkflowPageParams> = {
  '{domain-name}': 'domain',
  '{workflow-id}': 'workflowId',
  '{run-id}': 'runId',
};

export const PLACEHOLDER_REGEX =
  /(\{domain-name\}|\{workflow-id\}|\{run-id\})/g;
