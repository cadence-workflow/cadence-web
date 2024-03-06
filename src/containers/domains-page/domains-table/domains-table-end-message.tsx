import React from 'react';
import { styled } from 'baseui';
import { Spinner } from 'baseui/spinner';

const EndMessageContainer = styled('div', ({ $theme }) => ({
  ...$theme.typography.LabelSmall,
  color: $theme.colors.contentTertiary,
}));

type DomainTableEndMessageProps = {
  isLoading: boolean;
  hasSearchResults: boolean;
};

export default function DomainTableEndMessage({
  isLoading,
  hasSearchResults,
}: DomainTableEndMessageProps) {
  if (isLoading) {
    return <Spinner />;
  }

  if (hasSearchResults) {
    return <EndMessageContainer>End of results</EndMessageContainer>;
  }

  return <EndMessageContainer>No results</EndMessageContainer>;
}
