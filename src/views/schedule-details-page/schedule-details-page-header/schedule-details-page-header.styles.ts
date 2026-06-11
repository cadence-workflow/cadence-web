import { type BreadcrumbsOverrides } from 'baseui/breadcrumbs';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  breadcrumbItemContainer: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;

export const overrides: { breadcrumbs: BreadcrumbsOverrides } = {
  breadcrumbs: {
    Root: {
      style: () => ({
        display: 'flex',
        alignItems: 'center',
      }),
    },
  },
};
