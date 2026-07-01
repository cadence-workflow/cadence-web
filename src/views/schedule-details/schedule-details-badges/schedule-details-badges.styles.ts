import { type Theme } from 'baseui';
import { type BadgeOverrides } from 'baseui/badge';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  container: (theme) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.sizing.scale100,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;

export const overrides = {
  badge: {
    Badge: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundSecondary,
        color: $theme.colors.contentSecondary,
        borderRadius: $theme.borders.radius200,
        paddingTop: $theme.sizing.scale0,
        paddingBottom: $theme.sizing.scale0,
        paddingLeft: $theme.sizing.scale300,
        paddingRight: $theme.sizing.scale300,
        height: 'auto',
        ...$theme.typography.LabelXSmall,
        whiteSpace: 'nowrap',
      }),
    },
  } satisfies BadgeOverrides,
};
