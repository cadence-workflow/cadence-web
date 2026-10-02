import React from 'react';

import { Spinner } from 'baseui/spinner';

import { styled } from './workflow-history-table-footer.styles';
import { type Props } from './workflow-history-table-footer.types';

export default function WorkflowHistoryTableFooter({
  error,
  noEventsToDisplay,
  canFetchMoreEvents,
  fetchMoreEvents,
  isFetchingMoreEvents,
}: Props) {
  if (error) {
    return (
      <styled.EndMessageContainer $isError={true}>
        Failed to load more items.{' '}
        <styled.RetryLink onClick={() => fetchMoreEvents()}>
          Retry manually
        </styled.RetryLink>
      </styled.EndMessageContainer>
    );
  }

  if (canFetchMoreEvents || isFetchingMoreEvents) {
    return (
      <styled.SpinnerContainer>
        <Spinner data-testid="loading-spinner" />
      </styled.SpinnerContainer>
    );
  }

  if (noEventsToDisplay) {
    return (
      <styled.EndMessageContainer>
        No events to display
      </styled.EndMessageContainer>
    );
  }

  return null;
}
