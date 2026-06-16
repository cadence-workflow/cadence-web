import {
  BATCH_ACTION_DEFAULT_QUERY,
  BATCH_ACTION_DEFAULT_QUERY_HINT,
  BATCH_ACTION_EMPTY_QUERY_ERROR,
} from '../domain-batch-actions.constants';
import {
  type BatchActionModeStrategy,
  type QueryHint,
} from '../hooks/use-batch-action-target.types';

export default function getQueryModeStrategy({
  batchQuery,
  submitAttempted,
}: {
  batchQuery: string;
  submitAttempted: boolean;
}): BatchActionModeStrategy {
  const isQueryEmpty = !batchQuery?.trim();
  const showQueryError = submitAttempted && isQueryEmpty;
  const isDefaultQuery = batchQuery === BATCH_ACTION_DEFAULT_QUERY;

  let queryHint: QueryHint | null = null;
  if (showQueryError) {
    queryHint = { kind: 'error', message: BATCH_ACTION_EMPTY_QUERY_ERROR };
  } else if (isDefaultQuery) {
    queryHint = { kind: 'caption', message: BATCH_ACTION_DEFAULT_QUERY_HINT };
  }

  return {
    query: batchQuery,
    resolve: ({ totalWorkflowCount }) => ({
      selectedCount: totalWorkflowCount ?? 0,
      isTargetEmpty: isQueryEmpty,
      blocksSubmit: showQueryError,
      getBatchActionQuery: () => batchQuery,
      queryHint,
      listSelection: undefined,
    }),
  };
}
