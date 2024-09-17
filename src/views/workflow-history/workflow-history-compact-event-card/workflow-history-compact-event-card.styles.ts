import { type Theme } from 'baseui';
import { type TileOverrides } from 'baseui/tile';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const overrides = {
  Tile: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        padding: $theme.sizing.scale550,
      }),
    },
    BodyContainerContent: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        display: 'flex',
        flexDirection: 'row',
        gap: $theme.sizing.scale500,
        alignItems: 'flex-start',
      }),
    },
  } satisfies TileOverrides,
};

const cssStylesObj = {
  textContainer: ($theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: $theme.sizing.scale200,
  }),
  label: ($theme: Theme) => ({
    ...$theme.typography.LabelSmall,
    color: $theme.colors.contentPrimary,
  }),
  secondaryLabel: ($theme: Theme) => ({
    ...$theme.typography.LabelXSmall,
    color: '#868686',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
