import { styled as createStyled, type Theme } from 'baseui';
import {
  type SegmentOverrides,
  type SegmentedControlOverrides,
} from 'baseui/segmented-control';
import { type StyleObject } from 'styletron-react';

export const styled = {
  HeaderContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    marginTop: $theme.sizing.scale950,
    marginBottom: $theme.sizing.scale900,
  })),
  InputContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
    marginBottom: $theme.sizing.scale500,
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
  })),
  SearchContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
  })),
};

export const overrides = {
  inputToggle: {
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
  inputToggleSegment: {
    Segment: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale900,
        whiteSpace: 'nowrap',
      }),
    },
  } satisfies SegmentOverrides,
};
