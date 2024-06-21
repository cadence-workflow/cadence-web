import React from 'react';

import { Spinner } from 'baseui/spinner';

import useInfiniteScrollRef from '@/hooks/use-infinite-scroll-ref';

import { styled } from './domain-page-workflows-table-end-message.styles';
import { type Props } from './domain-page-workflows-table-end-message.types';

export default function DomainPageWorkflowsTableEndMessage(props: Props) {
  const targetRef = useInfiniteScrollRef({
    fetchResults: props.fetchNextPage,
    isFetchingResults: props.isFetchingNextPage,
  });

  if (props.isFetchingNextPage) {
    return <Spinner data-testid="loading-spinner" />;
  }

  if (props.error) {
    return (
      <styled.EndMessageContainer $isError={true}>
        Failed to load more items.{' '}
        <styled.RetryLink
          onClick={() => props.fetchNextPage()}
          target="_blank"
          rel="noreferrer"
        >
          Retry manually
        </styled.RetryLink>
      </styled.EndMessageContainer>
    );
  }

  if (props.hasNextPage) {
    return (
      <div data-testid="infinite-scroll-spinner" ref={targetRef}>
        <Spinner />
      </div>
    );
  }

  if (props.hasWorkflows) {
    return (
      <styled.EndMessageContainer>End of results</styled.EndMessageContainer>
    );
  }

  return <styled.EndMessageContainer>No results</styled.EndMessageContainer>;
}
