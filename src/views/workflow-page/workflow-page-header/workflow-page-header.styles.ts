import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';
import type { Theme } from 'baseui';
import type { BreadcrumbsOverrides } from 'baseui/breadcrumbs';
import type { StyleObject } from 'styletron-react';

export const overrides = {
  breadcrumbs: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        marginTop: $theme.sizing.scale800,
        marginBottom: $theme.sizing.scale900,
      }),
    },
    List: {
      style: (): StyleObject => ({
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      }),
    },
    ListItem: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        display: 'flex',
        alignItems: 'center',
        marginBottom: $theme.sizing.scale200,
        ...$theme.typography.LabelSmall,
      }),
    },
  } satisfies BreadcrumbsOverrides,
};

const cssStylesObj = {
  breadcrumbItemContainer: (theme) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.sizing.scale550,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
