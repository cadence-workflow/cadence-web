import getWorkflowIsCompleted from './get-workflow-is-completed';

export default function getWorkflowIsRunning(
  closeEventAttributes: string | null | undefined
): boolean {
  return !closeEventAttributes || !getWorkflowIsCompleted(closeEventAttributes);
}
