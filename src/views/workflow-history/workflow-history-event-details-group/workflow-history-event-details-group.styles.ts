import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  DetailsRow: createStyled<'div', { $forceWrap?: boolean }>(
    'div',
    ({ $theme, $forceWrap }: { $theme: Theme; $forceWrap?: boolean }) => ({
      gap: $theme.sizing.scale300,
      paddingTop: $theme.sizing.scale200,
      paddingBottom: $theme.sizing.scale200,
      wordBreak: 'break-word',
      display: 'flex',
      flexDirection: $forceWrap ? 'column' : 'row',
      ...(!$forceWrap && { flexWrap: 'wrap' }),
    })
  ),
  DetailsValue: createStyled<'div', { $forceWrap?: boolean }>(
    'div',
    ({ $theme, $forceWrap }: { $theme: Theme; $forceWrap?: boolean }) => ({
      color: $theme.colors.contentPrimary,
      ...$theme.typography.LabelXSmall,
      display: 'flex',
      ...(!$forceWrap && { flex: '1 0 300px' }),
    })
  ),
  DetailsLabel: createStyled<
    'div',
    { $forceWrap?: boolean; $useBlackText?: boolean }
  >('div', ({ $theme, $forceWrap, $useBlackText }) => ({
    minWidth: '150px',
    maxWidth: '150px',
    display: 'flex',
    color: $useBlackText
      ? $theme.colors.contentPrimary
      : $theme.colors.contentTertiary,
    ...$theme.typography.LabelXSmall,
    ...($forceWrap && { whiteSpace: 'nowrap' }),
  })),
  IndentedDetails: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: $theme.sizing.scale400,
    borderLeft: `2px solid ${$theme.colors.borderOpaque}`,
  })),
};
