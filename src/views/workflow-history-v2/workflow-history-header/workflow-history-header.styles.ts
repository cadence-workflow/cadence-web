import { styled as createStyled, type Theme } from 'baseui';
import {
  type SegmentOverrides,
  type SegmentedControlOverrides,
} from 'baseui/segmented-control';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Sentinel: createStyled('div', {
    height: '1px',
    visibility: 'hidden',
  }),
  Container: createStyled<
    'div',
    { $isSticky?: boolean; $isStickyEnabled?: boolean }
  >(
    'div',
    ({ $theme, $isSticky, $isStickyEnabled }): StyleObject => ({
      paddingTop: $theme.sizing.scale600,
      paddingBottom: $theme.sizing.scale600,
      marginTop: `-${$theme.sizing.scale600}`,
      backgroundColor: $theme.colors.backgroundPrimary,
      transition: 'box-shadow 0.2s ease-in-out',
      // Non-sticky by default or when disabled
      position: 'static',
      boxShadow: 'none',
      // Sticky only on medium screens and up when enabled
      ...($isStickyEnabled && {
        [$theme.mediaQuery.medium]: {
          position: 'sticky',
          top: 0,
          boxShadow: $isSticky ? $theme.lighting.shallowBelow : 'none',
          zIndex: 1,
        },
      }),
    })
  ),
  Header: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: $theme.sizing.scale500,
      [$theme.mediaQuery.medium]: {
        alignItems: 'center',
        flexDirection: 'row',
      },
    })
  ),
  Actions: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      gap: $theme.sizing.scale500,
      [$theme.mediaQuery.medium]: {
        flexDirection: 'row',
      },
    })
  ),
};

export const overrides = {
  groupToggle: {
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
  groupToggleSegment: {
    Segment: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale900,
        whiteSpace: 'nowrap',
      }),
    },
  } satisfies SegmentOverrides,
};
