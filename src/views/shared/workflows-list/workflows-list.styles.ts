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
      `linear-gradient(to right, ${$theme.colors.backgroundPrimary} 30%, ${$theme.colors.backgroundPrimary}00)`,
      `linear-gradient(to left, ${$theme.colors.backgroundPrimary} 30%, ${$theme.colors.backgroundPrimary}00)`,
      `linear-gradient(to right, ${$theme.colors.borderTransparent}, ${$theme.colors.borderSelected}00)`,
      `linear-gradient(to left, ${$theme.colors.borderTransparent}, ${$theme.colors.borderSelected}00)`,
    ].join(', '),
    backgroundPosition: 'left center, right center, left center, right center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${$theme.sizing.scale1000} 100%, ${$theme.sizing.scale1000} 100%, ${$theme.sizing.scale900} 100%, ${$theme.sizing.scale900} 100%`,
    backgroundAttachment: 'local, local, scroll, scroll',
  })),
  GridHeader: createStyled<'div', { $gridTemplateColumns: string }>(
    'div',
    ({ $theme, $gridTemplateColumns }) => ({
      display: 'grid',
      gridTemplateColumns: $gridTemplateColumns,
      minWidth: 'min-content',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: $theme.colors.borderTransparent,
    })
  ),
  HeaderCell: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelSmall,
    color: $theme.colors.contentSecondary,
    paddingTop: $theme.sizing.scale400,
    paddingBottom: $theme.sizing.scale400,
    paddingLeft: $theme.sizing.scale600,
    paddingRight: $theme.sizing.scale600,
    whiteSpace: 'wrap',
  })),
  SortableHeaderCell: createStyled(
    'button',
    ({ $theme }: { $theme: Theme }) => ({
      ...$theme.typography.LabelSmall,
      display: 'flex',
      alignItems: 'center',
      columnGap: $theme.sizing.scale300,
      color: $theme.colors.contentSecondary,
      paddingTop: $theme.sizing.scale400,
      paddingBottom: $theme.sizing.scale400,
      paddingLeft: $theme.sizing.scale600,
      paddingRight: $theme.sizing.scale600,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      ':hover': {
        color: $theme.colors.contentPrimary,
      },
    })
  ),
  GridRow: createStyled<'a', { $gridTemplateColumns: string }>(
    'a',
    ({ $theme, $gridTemplateColumns }) => ({
      display: 'grid',
      gridTemplateColumns: $gridTemplateColumns,
      minWidth: 'min-content',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: $theme.colors.borderTransparent,
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
      ':hover': {
        backgroundColor: `${$theme.colors.contentPrimary}0A`,
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
