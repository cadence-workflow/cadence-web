'use client';
import { HeadingXSmall } from 'baseui/typography';
import { styled } from 'baseui';
import AlertIcon from 'baseui/icon/alert';

// TODO: @assem.hafez extract error component to reusable error messages component

const StyledContainer = styled('div', ({ $theme }) => {
  return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: $theme.sizing.scale800,
    padding: `${$theme.sizing.scale900} ${$theme.sizing.scale600}`,
  };
});

export default function HomePageError({
  error,
}: Readonly<{
  error: Error;
}>) {
  return (
    <StyledContainer>
      <AlertIcon size={64} />
      <HeadingXSmall>Failed to load workflow</HeadingXSmall>
    </StyledContainer>
  );
}
