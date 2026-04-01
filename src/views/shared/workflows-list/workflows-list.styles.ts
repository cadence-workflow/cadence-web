import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  ScrollArea: createStyled('div', {
    position: 'relative',
  }),
  Container: createStyled('div', {
    overflowX: 'scroll',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  GridHeader: createStyled<'div', { $gridTemplateColumns: string }>(
    'div',
    ({ $theme, $gridTemplateColumns }) => ({
      display: 'grid',
      gridTemplateColumns: $gridTemplateColumns,
      minWidth: 'min-content',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: $theme.colors.borderOpaque,
    })
  ),
  HeaderCell: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelSmall,
    color: $theme.colors.contentSecondary,
    paddingTop: $theme.sizing.scale400,
    paddingBottom: $theme.sizing.scale400,
    paddingLeft: $theme.sizing.scale600,
    paddingRight: $theme.sizing.scale600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  })),
  GridRow: createStyled<'a', { $gridTemplateColumns: string }>(
    'a',
    ({ $theme, $gridTemplateColumns }) => ({
      display: 'grid',
      gridTemplateColumns: $gridTemplateColumns,
      minWidth: 'min-content',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: $theme.colors.borderOpaque,
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
      ':hover': {
        backgroundColor: $theme.colors.backgroundSecondary,
      },
    })
  ),
  GridCell: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphSmall,
    paddingTop: $theme.sizing.scale400,
    paddingBottom: $theme.sizing.scale400,
    paddingLeft: $theme.sizing.scale600,
    paddingRight: $theme.sizing.scale600,
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    minWidth: 0,
  })),
  FooterContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    paddingTop: $theme.sizing.scale800,
    paddingBottom: $theme.sizing.scale800,
  })),
};
