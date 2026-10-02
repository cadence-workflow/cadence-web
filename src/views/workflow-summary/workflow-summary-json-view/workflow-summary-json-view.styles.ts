import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const styled = {
  JsonViewContainer: createStyled<'div', { $isNegative: boolean }>(
    'div',
    ({ $theme, $isNegative }: { $theme: Theme; $isNegative: boolean }) => ({
      padding: $theme.sizing.scale600,
      backgroundColor: $isNegative
        ? $theme.colors.backgroundNegativeLight
        : $theme.colors.backgroundSecondary,
      borderRadius: $theme.borders.radius300,
    })
  ),
};

const cssStylesObj = {
  jsonStaticTitle: (theme) => ({
    ...theme.typography.LabelSmall,
  }),
  jsonViewHeader: (theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.sizing.scale600,
    marginBottom: theme.sizing.scale700,
  }),
  archivedResult: (theme) => ({
    padding: theme.sizing.scale600,
    color: theme.colors.contentTertiary,
    textAlign: 'center',
    ...theme.typography.ParagraphSmall,
  }),
  noResultPlaceholder: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `0px ${theme.sizing.scale600} ${theme.sizing.scale600} ${theme.sizing.scale600}`,
    color: theme.colors.contentTertiary,
    textAlign: 'center',
    ...theme.typography.ParagraphSmall,
  }),
  noResultPlaceholderFirstLine: (theme) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.sizing.scale200,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;

export const overrides = {
  copyButton: {
    BaseButton: {
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
    },
  } satisfies ButtonOverrides,
};
