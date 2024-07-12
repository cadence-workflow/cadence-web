import React from 'react';

import { Spinner } from 'baseui/spinner';
import { InView } from 'react-intersection-observer';

import { styled } from './domain-page-workflows-table-end-message.styles';
import { type Props } from './domain-page-workflows-table-end-message.types';

export default function DomainPageWorkflowsTableEndMessage(props: Props) {
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
      <InView
        as="div"
        data-testid="infinite-scroll-spinner"
        onChange={(inView) => {
          if (inView && !props.isFetchingNextPage) {
            props.fetchNextPage();
          }
        }}
      >
        <Spinner />
      </InView>
    );
  }

  if (props.hasWorkflows) {
    return (
      <styled.EndMessageContainer>End of results</styled.EndMessageContainer>
    );
  }

  return <styled.EndMessageContainer>No results</styled.EndMessageContainer>;
}
