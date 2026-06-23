import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  section: () => ({
    display: 'flex',
    flexDirection: 'column',
  }),
  jsonContainer: () => ({
    position: 'relative',
    width: '100%',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;

export const styled = {
  JsonViewContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    padding: $theme.sizing.scale600,
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius300,
    maxHeight: '50vh',
    overflow: 'auto',
  })),
  JsonViewHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    position: 'absolute',
    right: $theme.sizing.scale400,
    top: $theme.sizing.scale400,
  })),
};

export const overrides = {
  copyButton: {
    BaseButton: {
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
    },
  } satisfies ButtonOverrides,
};
