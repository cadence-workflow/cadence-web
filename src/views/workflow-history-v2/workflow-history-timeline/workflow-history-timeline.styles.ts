import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

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
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
    height: `${TIMELINE_HEIGHT}px`,
    marginTop: $theme.sizing.scale400,
    outline: `1px solid ${$theme.borders.border300.borderColor}`,
  })),
  HeaderRow: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    position: 'sticky',
    top: 0,
    zIndex: 20,
    alignItems: 'center',
    backgroundColor: $theme.colors.backgroundPrimary,
    borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
  })),
  HeaderLabelCell: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    width: `${TIMELINE_LABEL_COLUMN_WIDTH}px`,
    flexShrink: 0,
    padding: $theme.sizing.scale300,
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentSecondary,
  })),
  HeaderTimelineCell: createStyled('div', {
    flex: 1,
    minWidth: 0,
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
  }),
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
  RowContainer: createStyled<
    'div',
    { $isEven?: boolean; $animateOnEnter?: boolean }
  >(
    'div',
    ({
      $theme,
      $isEven,
      $animateOnEnter,
    }: {
      $theme: Theme;
      $isEven?: boolean;
      $animateOnEnter?: boolean;
    }) => {
      const defaultBackgroundColor = $isEven
        ? undefined
        : $theme.colors.backgroundTableStriped;

      return {
        display: 'flex',
        width: '100%',
        height: `${ROW_HEIGHT_PX}px`,
        backgroundColor: defaultBackgroundColor,
        ':hover': {
          backgroundColor: $theme.colors.backgroundTertiary,
        },
        ...($animateOnEnter && {
          animationDuration: '2s',
          animationName: {
            from: {
              backgroundColor: $theme.colors.backgroundTertiary,
            },
            to: {
              backgroundColor: defaultBackgroundColor,
            },
          },
        }),
      };
    }
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
  barAnimated: {
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

export const overrides = {
  popover: {
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundPrimary,
        color: $theme.colors.contentPrimary,
        ...$theme.typography.LabelSmall,
        padding: $theme.sizing.scale400,
        maxWidth: '800px',
      }),
    },
  } satisfies PopoverOverrides,
};
