import { styled as createStyled } from 'baseui';

export const styled = {
  H1: createStyled('h1', ({ $theme }) => ({
    ...$theme.typography.HeadingXXLarge,
    marginTop: $theme.sizing.scale800,
    marginBottom: $theme.sizing.scale600,
    borderBottom: `1px solid ${$theme.colors.backgroundTertiary}`,
    paddingBottom: $theme.sizing.scale300,
  })),
  H2: createStyled('h2', ({ $theme }) => ({
    ...$theme.typography.HeadingXLarge,
    marginTop: $theme.sizing.scale700,
    marginBottom: $theme.sizing.scale500,
    borderBottom: `1px solid ${$theme.colors.backgroundTertiary}`,
    paddingBottom: $theme.sizing.scale200,
  })),
  H3: createStyled('h3', ({ $theme }) => ({
    ...$theme.typography.HeadingLarge,
    marginTop: $theme.sizing.scale600,
    marginBottom: $theme.sizing.scale400,
  })),
  H4: createStyled('h4', ({ $theme }) => ({
    ...$theme.typography.HeadingMedium,
    marginTop: $theme.sizing.scale500,
    marginBottom: $theme.sizing.scale300,
  })),
  H5: createStyled('h5', ({ $theme }) => ({
    ...$theme.typography.HeadingSmall,
    marginTop: $theme.sizing.scale400,
    marginBottom: $theme.sizing.scale300,
  })),
  H6: createStyled('h6', ({ $theme }) => ({
    ...$theme.typography.HeadingXSmall,
    marginTop: $theme.sizing.scale400,
    marginBottom: $theme.sizing.scale300,
  })),
};

export const HEADING_BY_LEVEL = {
  1: styled.H1,
  2: styled.H2,
  3: styled.H3,
  4: styled.H4,
  5: styled.H5,
  6: styled.H6,
} as const;
