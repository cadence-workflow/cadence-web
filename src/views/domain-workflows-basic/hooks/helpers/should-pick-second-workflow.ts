import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

/**
 * Since ListOpenWorkflows returns workflows sorted by their start time, and ListClosedWorkflows sorts them by their
 * close time, we cannot merge them. Therefore, the sorting logic prioritizes open workflows over closed workflows.
 * Returns true if the second workflow should be picked over the first workflow.
 */
export default function shouldPickSecondWorkflow(
  first: DomainWorkflow,
  second: DomainWorkflow
): boolean {
  if (!first.closeTime && !second.closeTime) {
    return second.startTime > first.startTime;
  }

  if (!first.closeTime || !second.closeTime) {
    return !second.closeTime;
  }

  return second.closeTime > first.closeTime;
}
