import {
  type SegmentedControlOverrides,
  type SegmentOverrides,
} from 'baseui/segmented-control';
import { type Theme } from 'baseui/theme';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  viewToggle: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale950,
        padding: $theme.sizing.scale0,
        borderRadius: $theme.borders.radius300,
        ...$theme.typography.ParagraphSmall,
        width: 'auto',
        flexGrow: 1,
        [$theme.mediaQuery.medium]: {
          flexGrow: 0,
        },
      }),
    },
    SegmentList: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale950,
        ...$theme.typography.ParagraphSmall,
      }),
    },
    Active: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale900,
        top: 0,
      }),
    },
  } satisfies SegmentedControlOverrides,
  viewToggleSegment: {
    Segment: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale900,
        whiteSpace: 'nowrap',
      }),
    },
  } satisfies SegmentOverrides,
};
