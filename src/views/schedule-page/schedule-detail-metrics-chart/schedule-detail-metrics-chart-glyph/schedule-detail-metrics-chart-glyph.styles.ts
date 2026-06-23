import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

import { CHART_GLYPH_HIT_AREA_RADIUS_PX } from '../schedule-detail-metrics-chart.constants';

export const styled = {
  Overlay: createStyled('div', () => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  })),
  HitArea: createStyled(
    'button',
    ({ $theme, $x, $y }: { $theme: Theme; $x: number; $y: number }) => ({
      position: 'absolute',
      left: `${$x - CHART_GLYPH_HIT_AREA_RADIUS_PX}px`,
      top: `${$y - CHART_GLYPH_HIT_AREA_RADIUS_PX}px`,
      width: `${CHART_GLYPH_HIT_AREA_RADIUS_PX * 2}px`,
      height: `${CHART_GLYPH_HIT_AREA_RADIUS_PX * 2}px`,
      padding: 0,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      pointerEvents: 'auto',
      borderRadius: $theme.borders.radius200,
      ':focus-visible': {
        outline: `2px solid ${$theme.colors.borderAccent}`,
        outlineOffset: '1px',
      },
    })
  ),
};

export const overrides = {
  popover: {
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundPrimary,
        color: $theme.colors.contentPrimary,
        ...$theme.typography.LabelSmall,
        padding: $theme.sizing.scale400,
      }),
    },
  } satisfies PopoverOverrides,
};
