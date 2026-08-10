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
  batchActionQuery,
  submitAttempted,
}: {
  batchActionQuery: string;
  submitAttempted: boolean;
}): BatchActionModeStrategy {
  const isQueryEmpty = !batchActionQuery?.trim();
  const showQueryError = submitAttempted && isQueryEmpty;
  const isDefaultQuery = batchActionQuery === BATCH_ACTION_DEFAULT_QUERY;

  let queryHint: QueryHint | null = null;
  if (showQueryError) {
    queryHint = { kind: 'error', message: BATCH_ACTION_EMPTY_QUERY_ERROR };
  } else if (isDefaultQuery) {
    queryHint = { kind: 'caption', message: BATCH_ACTION_DEFAULT_QUERY_HINT };
  }

  return {
    query: batchActionQuery,
    resolve: ({ totalWorkflowCount }) => ({
      selectedCount: totalWorkflowCount ?? 0,
      isTargetEmpty: isQueryEmpty,
      blocksSubmit: showQueryError,
      getBatchActionQuery: () => batchActionQuery,
      queryHint,
      listSelection: undefined,
    }),
  };
}
