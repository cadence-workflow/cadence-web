import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  MetadataTableContainer: createStyled<'div', { $isCompact?: boolean }>(
    'div',
    ({ $theme, $isCompact }: { $theme: Theme; $isCompact?: boolean }) => ({
      display: 'flex',
      flexDirection: 'column',
      paddingTop: $isCompact ? 0 : $theme.sizing.scale100,
      paddingBottom: $isCompact ? 0 : $theme.sizing.scale100,
    })
  ),
  MetadataItemRow: createStyled<
    'div',
    { $forceWrap?: boolean; $isCompact?: boolean }
  >(
    'div',
    ({
      $theme,
      $forceWrap,
      $isCompact,
    }: {
      $theme: Theme;
      $forceWrap?: boolean;
      $isCompact?: boolean;
    }) => ({
      display: 'flex',
      flexDirection: $forceWrap ? 'column' : 'row',
      gap: $theme.sizing.scale300,
      alignItems: 'stretch',
      wordBreak: 'break-word',
      ...(!$forceWrap && {
        alignItems: 'baseline',
        flexWrap: 'wrap',
      }),
      ...($isCompact
        ? {
            paddingTop: $theme.sizing.scale0,
            paddingBottom: $theme.sizing.scale0,
          }
        : {
            paddingTop: $theme.sizing.scale200,
            paddingBottom: $forceWrap
              ? $theme.sizing.scale500
              : $theme.sizing.scale200,
            ':not(:last-child)': {
              borderColor: $theme.borders.border200.borderColor,
              borderStyle: $theme.borders.border200.borderStyle,
              borderBottomWidth: $theme.borders.border200.borderWidth,
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
            },
          }),
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
