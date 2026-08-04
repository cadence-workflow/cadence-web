import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

import { CHART_GLYPH_HIT_AREA_RADIUS_PX } from '@/views/schedule-details/schedule-details-runs-chart/schedule-details-runs-chart.constants';

const hitAreaDiameterPx = CHART_GLYPH_HIT_AREA_RADIUS_PX * 2;

export const styled = {
  TriggerAnchor: createStyled<'div', { $x: number; $y: number }>(
    'div',
    ({ $x, $y }: { $x: number; $y: number }) => ({
      position: 'absolute',
      left: `${$x - CHART_GLYPH_HIT_AREA_RADIUS_PX}px`,
      top: `${$y - CHART_GLYPH_HIT_AREA_RADIUS_PX}px`,
      width: `${hitAreaDiameterPx}px`,
      height: `${hitAreaDiameterPx}px`,
      pointerEvents: 'none',
    })
  ),
  HitArea: createStyled('button', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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
  })),
};

export const overrides = {
  popover: {
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundPrimary,
        color: $theme.colors.contentPrimary,
        ...$theme.typography.ParagraphXSmall,
        // horizontal padding lives on the popover rows, so entry separators span the full width
        padding: `${$theme.sizing.scale300} 0`,
        width: 'auto',
      }),
    },
  } satisfies PopoverOverrides,
};
