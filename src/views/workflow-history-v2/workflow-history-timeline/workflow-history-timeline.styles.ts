import { styled as createStyled, type Theme } from 'baseui';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

import {
  ROW_HEIGHT_PX,
  TIMELINE_HEIGHT,
  TIMELINE_LABEL_COLUMN_WIDTH,
} from './workflow-history-timeline.constants';

export const styled = {
  Container: createStyled('div', () => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
    height: `${TIMELINE_HEIGHT}px`,
  })),
  HeaderRow: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    position: 'sticky',
    top: 0,
    zIndex: 20,
    alignItems: 'center',
    backgroundColor: $theme.colors.backgroundPrimary,
    borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
    paddingTop: $theme.sizing.scale400,
  })),
  HeaderLabelCell: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    width: `${TIMELINE_LABEL_COLUMN_WIDTH}px`,
    flexShrink: 0,
    padding: $theme.sizing.scale300,
    borderRight: `1px solid ${$theme.colors.borderOpaque}`,
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentSecondary,
  })),
  HeaderTimelineCell: createStyled('div', () => ({
    flex: 1,
    minWidth: 0,
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
  })),
  HeaderTimelineViewport: createStyled('div', () => ({
    overflowX: 'auto',
    overflowY: 'visible',
    width: '100%',
    height: '100%',
    scrollBehavior: 'auto',
  })),
  HeaderTimelineContent: createStyled<'div', { $widthPx?: number }>(
    'div',
    ({ $theme, $widthPx }: { $theme: Theme; $widthPx?: number }) => ({
      position: 'relative',
      paddingTop: $theme.sizing.scale500,
      paddingBottom: $theme.sizing.scale200,
      ...($widthPx !== undefined && { width: `${$widthPx}px` }),
    })
  ),
  AxisSvg: createStyled('svg', () => ({
    display: 'block',
    width: '100%',
    height: '100%',
  })),
  RowContainer: createStyled<'div', { $isEven?: boolean }>(
    'div',
    ({ $theme, $isEven }: { $theme: Theme; $isEven?: boolean }) => ({
      display: 'flex',
      width: '100%',
      height: `${ROW_HEIGHT_PX}px`,
      backgroundColor: $isEven
        ? undefined
        : $theme.colors.backgroundTableStriped,
      ':hover': {
        backgroundColor: $theme.colors.backgroundTertiary,
      },
    })
  ),
  LabelCell: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    width: `${TIMELINE_LABEL_COLUMN_WIDTH}px`,
    flexShrink: 0,
    position: 'sticky',
    left: 0,
    zIndex: 10,
    padding: $theme.sizing.scale300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRight: `1px solid ${$theme.colors.borderOpaque}`,
  })),
  LabelText: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelXSmall,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  })),
  TimelineCell: createStyled('div', () => ({
    flex: 1,
    minWidth: 0,
    padding: 0,
    position: 'relative',
  })),
  TimelineViewport: createStyled('div', () => ({
    overflowX: 'auto',
    overflowY: 'hidden',
    width: '100%',
    height: `${ROW_HEIGHT_PX}px`,
    scrollbarWidth: 'none',
  })),
  TimelineContent: createStyled<'div', { $widthPx?: number }>(
    'div',
    ({ $theme, $widthPx }: { $theme: Theme; $widthPx?: number }) => ({
      height: '100%',
      position: 'relative',
      paddingTop: $theme.sizing.scale200,
      paddingBottom: $theme.sizing.scale200,
      ...($widthPx !== undefined && { width: `${$widthPx}px` }),
    })
  ),
  TimelineSvg: createStyled('svg', () => ({
    display: 'block',
    width: '100%',
    height: '100%',
  })),
};

const cssStylesObj = {
  bar: {
    cursor: 'pointer',
  },
  barAnimated: {
    cursor: 'pointer',
    '@keyframes stripeMove': {
      '0%': {
        transform: 'translate(0, 0)',
      },
      '100%': {
        transform: 'translate(8px, 8px)',
      },
    },
    '& defs pattern[id^="striped-pattern-"]': {
      animation: 'stripeMove 1s linear infinite',
    },
  },
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
