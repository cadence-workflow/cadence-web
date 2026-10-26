import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  ScrollArea: createStyled('div', {
    position: 'relative',
  }),
  Container: createStyled<'div', { $maxHeight?: string }>(
    'div',
    ({ $theme, $maxHeight }) => ({
      ...($maxHeight
        ? { maxHeight: $maxHeight, overflowX: 'auto', overflowY: 'auto' }
        : {
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': {
              display: 'none',
            },
          }),
      // Covers (local) hide the shadows (scroll) when the content is at that edge
      backgroundImage: [
        `linear-gradient(to right, ${$theme.colors.backgroundPrimary} 30%, ${$theme.colors.backgroundPrimary}00)`,
        `linear-gradient(to left, ${$theme.colors.backgroundPrimary} 30%, ${$theme.colors.backgroundPrimary}00)`,
        ...($maxHeight
          ? [
              `linear-gradient(to top, ${$theme.colors.backgroundPrimary} 30%, ${$theme.colors.backgroundPrimary}00)`,
            ]
          : []),
        `linear-gradient(to right, ${$theme.colors.borderTransparent}, ${$theme.colors.borderSelected}00)`,
        `linear-gradient(to left, ${$theme.colors.borderTransparent}, ${$theme.colors.borderSelected}00)`,
        ...($maxHeight
          ? [
              `linear-gradient(to top, ${$theme.colors.borderTransparent}, ${$theme.colors.borderSelected}00)`,
            ]
          : []),
      ].join(', '),
      backgroundPosition: [
        'left center',
        'right center',
        ...($maxHeight ? ['center bottom'] : []),
        'left center',
        'right center',
        ...($maxHeight ? ['center bottom'] : []),
      ].join(', '),
      backgroundRepeat: 'no-repeat',
      backgroundSize: [
        `${$theme.sizing.scale1000} 100%`,
        `${$theme.sizing.scale1000} 100%`,
        ...($maxHeight ? [`100% ${$theme.sizing.scale1000}`] : []),
        `${$theme.sizing.scale900} 100%`,
        `${$theme.sizing.scale900} 100%`,
        ...($maxHeight ? [`100% ${$theme.sizing.scale900}`] : []),
      ].join(', '),
      backgroundAttachment: [
        'local',
        'local',
        ...($maxHeight ? ['local'] : []),
        'scroll',
        'scroll',
        ...($maxHeight ? ['scroll'] : []),
      ].join(', '),
    })
  ),
  GridHeader: createStyled<
    'div',
    { $gridTemplateColumns: string; $isSticky?: boolean; $isScrolled?: boolean }
  >('div', ({ $theme, $gridTemplateColumns, $isSticky, $isScrolled }) => ({
    display: 'grid',
    gridTemplateColumns: $gridTemplateColumns,
    minWidth: 'min-content',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: $theme.colors.borderTransparent,
    ...($isSticky
      ? {
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: $theme.colors.backgroundPrimary,
          // The sticky header covers the top edge, so it draws the top shadow
          '::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            height: $theme.sizing.scale900,
            backgroundImage: `linear-gradient(to bottom, ${$theme.colors.borderTransparent}, ${$theme.colors.borderSelected}00)`,
            pointerEvents: 'none',
            opacity: $isScrolled ? 1 : 0,
            transitionProperty: 'opacity',
            transitionDuration: $theme.animation.timing200,
          },
        }
      : {}),
  })),
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
      WebkitUserDrag: 'none',
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
    userSelect: 'text',
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
