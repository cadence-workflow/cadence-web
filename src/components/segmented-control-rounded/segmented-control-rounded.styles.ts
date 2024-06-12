import type { ComponentProps } from 'react';

import type { Theme } from 'baseui';
import {
  type SegmentOverrides,
  type SegmentedControlOverrides,
  type StyledSegment,
  type StyledActive,
} from 'baseui/segmented-control';
import type { StyleObject } from 'styletron-react';

export const overrides = {
  segmentedControl: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        padding: 0,
        borderRadius: $theme.sizing.scale550,
      }),
    },
    SegmentList: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        background: $theme.colors.backgroundTertiary,
        minHeight: $theme.sizing.scale850,
        height: $theme.sizing.scale850,
      }),
    },
    Active: {
      style: ({
        $theme,
        $length,
      }: { $theme: Theme } & ComponentProps<
        typeof StyledActive
      >): StyleObject => ({
        borderRadius: $theme.sizing.scale550,
        opacity: $length === 0 ? 0 : 1,
        background: $theme.colors.backgroundInversePrimary,
      }),
    },
  } satisfies SegmentedControlOverrides,
  segment: {
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        animationDuration: $theme.animation.timing900,
        ...$theme.typography.LabelXSmall,
      }),
    },
    Segment: {
      style: ({
        $theme,
        $isActive,
      }: { $theme: Theme } & ComponentProps<
        typeof StyledSegment
      >): StyleObject => ({
        color: $isActive ? $theme.colors.contentInversePrimary : '#A6A6A6',
        transitionProperty: 'color',
        transitionDelay: $theme.animation.timing200,
        borderRadius: $theme.sizing.scale550,
      }),
    },
  } satisfies SegmentOverrides,
};
