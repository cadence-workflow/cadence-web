import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

import { CHART_GLYPH_HIT_AREA_RADIUS_PX } from '@/views/schedule-details/schedule-details-runs-chart/schedule-details-runs-chart.constants';

export const styled = {
  HitArea: createStyled<'button', { $x: number; $y: number }>(
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
