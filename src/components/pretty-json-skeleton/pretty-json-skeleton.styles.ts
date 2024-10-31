import { type Theme } from 'baseui';
import { type SkeletonOverrides } from 'baseui/skeleton/types';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  borderSkeleton: {
    Row: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale600,
        borderRadius: $theme.borders.radius500,
      }),
    },
  } satisfies SkeletonOverrides,
  centralSkeleton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        marginLeft: $theme.sizing.scale550,
        marginTop: $theme.sizing.scale400,
        marginBottom: $theme.sizing.scale400,
      }),
    },
    Row: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale600,
        borderRadius: $theme.borders.radius500,
      }),
    },
  } satisfies SkeletonOverrides,
};
