import { type Theme } from 'baseui';
import { type BadgeOverrides } from 'baseui/badge';
import { type TileOverrides } from 'baseui/tile';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const overrides = {
  title: {
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
  badge: {
    Badge: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundSecondary,
        color: $theme.colors.contentSecondary,
        ...$theme.typography.LabelXSmall,
        whiteSpace: 'nowrap',
      }),
    },
  } satisfies BadgeOverrides,
};

const cssStylesObj = {
  textContainer: ($theme: Theme) => ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: $theme.sizing.scale200,
    textAlign: 'start',
    wordBreak: 'break-word',
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
