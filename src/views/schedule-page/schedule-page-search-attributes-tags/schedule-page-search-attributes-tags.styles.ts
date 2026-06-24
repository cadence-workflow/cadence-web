import { type Theme } from 'baseui';
import { type TagOverrides } from 'baseui/tag';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  container: (_theme) => ({
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> = cssStylesObj;

export const overrides = {
  tag: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
        backgroundColor: $theme.colors.backgroundSecondary,
        color: $theme.colors.contentPrimary,
        borderRadius: $theme.borders.radius200,
        paddingTop: $theme.sizing.scale100,
        paddingBottom: $theme.sizing.scale100,
        paddingLeft: $theme.sizing.scale300,
        paddingRight: $theme.sizing.scale300,
        margin: 0,
        height: 'auto',
      }),
    },
    Text: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
        maxWidth: 'none',
      }),
    },
  } satisfies TagOverrides,
};
