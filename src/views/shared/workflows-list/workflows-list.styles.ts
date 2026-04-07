import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  ScrollArea: createStyled('div', {
    position: 'relative',
  }),
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    overflowX: 'scroll',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
    backgroundImage: [
      'linear-gradient(to right, #FFFFFF 30%, rgba(255, 255, 255, 0))',
      'linear-gradient(to left, #FFFFFF 30%, rgba(255, 255, 255, 0))',
      'linear-gradient(to right, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0))',
      'linear-gradient(to left, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0))',
    ].join(', '),
    backgroundPosition: 'left center, right center, left center, right center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${$theme.sizing.scale1000} 100%, ${$theme.sizing.scale1000} 100%, ${$theme.sizing.scale900} 100%, ${$theme.sizing.scale900} 100%`,
    backgroundAttachment: 'local, local, scroll, scroll',
  })),
  GridHeader: createStyled<'div', { $gridTemplateColumns: string }>(
    'div',
    ({ $gridTemplateColumns }) => ({
      display: 'grid',
      gridTemplateColumns: $gridTemplateColumns,
      minWidth: 'min-content',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'rgba(0, 0, 0, 0.08)',
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
    ({ $gridTemplateColumns }) => ({
      display: 'grid',
      gridTemplateColumns: $gridTemplateColumns,
      minWidth: 'min-content',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'rgba(0, 0, 0, 0.08)',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
      ':hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
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
  CellPlaceholder: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    color: $theme.colors.contentTertiary,
    fontStyle: 'italic',
  })),
  FooterContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    paddingTop: $theme.sizing.scale800,
    paddingBottom: $theme.sizing.scale800,
  })),
};
