import React from 'react';

import { BATCH_ACTION_DEFAULT_QUERY } from '../domain-batch-actions.constants';
import { type BatchActionModeStrategy } from '../hooks/use-batch-action-target.types';

import { styled } from './get-query-mode-strategy.styles';

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

  let queryHint: React.ReactNode = null;
  if (showQueryError) {
    queryHint = <styled.QueryError>Query must not be empty</styled.QueryError>;
  } else if (isDefaultQuery) {
    queryHint = (
      <styled.QueryCaption>
        Showing all running workflows. Edit the query to narrow the set.
      </styled.QueryCaption>
    );
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
