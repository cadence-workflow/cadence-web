import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

/**
 * Since ListOpenWorkflows returns workflows sorted by their start time, and ListClosedWorkflows sorts them by their
 * close time, we cannot merge them. Therefore, the sorting logic prioritizes open workflows over closed workflows.
 */
export default function compareBasicVisibilityWorkflows(
  first: DomainWorkflow,
  second: DomainWorkflow
): number {
  if (!first.closeTime && !second.closeTime) {
    return second.startTime > first.startTime ? 1 : -1;
  }

  if (!first.closeTime || !second.closeTime) {
    return !second.closeTime ? 1 : -1;
  }

  return second.closeTime > first.closeTime ? 1 : -1;
}
