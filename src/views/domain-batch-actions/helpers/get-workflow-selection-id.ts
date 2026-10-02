import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

/**
 * Stable id for a workflow run, used as the selection key when picking
 * workflows for a batch action. RunID is a UUID, so it is unique on its own.
 */
export default function getWorkflowSelectionId(
  workflow: Pick<DomainWorkflow, 'runID'>
): string {
  return workflow.runID;
}
