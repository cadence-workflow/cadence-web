import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  MetadataTableContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      flexDirection: 'column',
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
      alignItems: 'baseline',
      paddingTop: $theme.sizing.scale200,
      paddingBottom: $theme.sizing.scale200,
      wordBreak: 'break-word',
      ...(!$forceWrap && { flexWrap: 'wrap' }),
      ':not(:last-child)': {
        borderBottom: `1px solid hsla(0, 0%, 0%, 0.08)`,
      },
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
      color: $theme.colors.contentPrimary,
      ...$theme.typography.ParagraphXSmall,
      ...($forceWrap && { whiteSpace: 'nowrap' }),
    })
  ),
};
