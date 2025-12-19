import React from 'react';

import { Spinner } from 'baseui/spinner';

import { styled } from './workflow-history-table-footer.styles';
import { type Props } from './workflow-history-table-footer.types';

export default function WorkflowHistoryTableFooter(props: Props) {
  if (props.error) {
    return (
      <styled.EndMessageContainer $isError={true}>
        Failed to load more items.{' '}
        <styled.RetryLink onClick={() => props.fetchMoreEvents()}>
          Retry manually
        </styled.RetryLink>
      </styled.EndMessageContainer>
    );
  }

  if (props.hasMoreEvents || props.isFetchingMoreEvents) {
    return (
      <styled.SpinnerContainer>
        <Spinner data-testid="loading-spinner" />
      </styled.SpinnerContainer>
    );
  }

  return null;
}
