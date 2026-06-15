import escapeVisibilityQueryValue from '@/utils/visibility/escape-visibility-query-value';
import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

/**
 * Builds a visibility query that targets exactly the given workflow runs, by
 * OR-ing a RunID clause for each one. Used to translate a
 * manual checkbox selection into the single query string the batch API accepts.
 */
export default function buildSelectionQuery(
  workflows: ReadonlyArray<Pick<DomainWorkflow, 'runID'>>
): string {
  return workflows
    .map(({ runID }) => `(RunID = "${escapeVisibilityQueryValue(runID)}")`)
    .join(' OR ');
}
