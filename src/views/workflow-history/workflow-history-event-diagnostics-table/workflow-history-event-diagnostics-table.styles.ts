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
      alignItems: 'stretch',
      paddingTop: $theme.sizing.scale200,
      paddingBottom: $theme.sizing.scale500,
      wordBreak: 'break-word',
      ...(!$forceWrap && {
        alignItems: 'baseline',
        flexWrap: 'wrap',
        paddingBottom: $theme.sizing.scale200,
      }),
      ':not(:last-child)': {
        borderColor: $theme.borders.border200.borderColor,
        borderStyle: $theme.borders.border200.borderStyle,
        borderBottomWidth: $theme.borders.border200.borderWidth,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
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
