import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  MetadataTableContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale500,
      paddingTop: $theme.sizing.scale100,
      paddingBottom: $theme.sizing.scale100,
    })
  ),
  MetadataItemRow: createStyled<'div', { $forceWrap?: boolean }>(
    'div',
    ({ $theme, $forceWrap }: { $theme: Theme; $forceWrap?: boolean }) => ({
      display: 'flex',
      flexDirection: $forceWrap ? 'column' : 'row',
      gap: $theme.sizing.scale300,
      wordBreak: 'break-word',
      ...(!$forceWrap && { flexWrap: 'wrap' }),
    })
  ),
  MetadataItemValue: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    color: $theme.colors.contentPrimary,
    ...$theme.typography.LabelXSmall,
    display: 'flex',
  })),
  MetadataItemLabel: createStyled<'div', { $forceWrap?: boolean }>(
    'div',
    ({ $theme, $forceWrap }) => ({
      minWidth: '140px',
      maxWidth: '140px',
      display: 'flex',
      color: $theme.colors.contentSecondary,
      ...$theme.typography.LabelXSmall,
      ...($forceWrap && { whiteSpace: 'nowrap' }),
    })
  ),
};
