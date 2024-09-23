import React from 'react';

import { Spinner } from 'baseui/spinner';
import { InView } from 'react-intersection-observer';

import { styled } from './workflow-history-timeline-load-more.styles';
import { type Props } from './workflow-history-timeline-load-more.types';

export default function WorkflowHistoryTimelineLoadMore(props: Props) {
  if (props.isFetchingNextPage) {
    return (
      <styled.SpinnerContainer>
        <Spinner data-testid="loading-spinner" />
      </styled.SpinnerContainer>
    );
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
        data-testid="intersection-observer-container"
        onChange={(inView) => {
          if (inView && !props.isFetchingNextPage) {
            props.fetchNextPage();
          }
        }}
      >
        <styled.SpinnerContainer>
          <Spinner data-testid="loading-spinner" />
        </styled.SpinnerContainer>
      </InView>
    );
  }
  return null;
}
