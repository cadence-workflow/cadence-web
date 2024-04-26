import React from 'react';
import { styled } from 'baseui';
import { Props } from './domains-table-end-message.type';

const EndMessageContainer = styled('div', ({ $theme }) => ({
  ...$theme.typography.LabelSmall,
  color: $theme.colors.contentTertiary,
}));

export default function DomainTableEndMessage({
  canLoadMoreResults,
  hasSearchResults,
  infiniteScrollTargetRef,
}: Props) {
  if (canLoadMoreResults) {
    return (
      <div
        data-testid="infinite-scroll-load-more"
        ref={infiniteScrollTargetRef}
      />
    );
  }

  if (hasSearchResults) {
    return <EndMessageContainer>End of results</EndMessageContainer>;
  }

  return <EndMessageContainer>No results</EndMessageContainer>;
}
