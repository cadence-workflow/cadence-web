import { styled as createStyled, type Theme } from 'baseui';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const styled = {
  DetailsRow: createStyled<'div', { $forceWrap?: boolean }>(
    'div',
    ({ $theme, $forceWrap }: { $theme: Theme; $forceWrap?: boolean }) => ({
      gap: $theme.sizing.scale300,
      paddingTop: $theme.sizing.scale200,
      paddingBottom: $theme.sizing.scale200,
      wordBreak: 'break-word',
      display: 'flex',
      flexDirection: $forceWrap ? 'column' : 'row',
      ...(!$forceWrap && { flexWrap: 'wrap' }),
    })
  ),
  DetailsValue: createStyled<'div', { $forceWrap?: boolean }>(
    'div',
    ({ $theme, $forceWrap }: { $theme: Theme; $forceWrap?: boolean }) => ({
      color: $theme.colors.contentPrimary,
      ...$theme.typography.LabelXSmall,
      display: 'flex',
      ...(!$forceWrap && { flex: '1 0 300px' }),
    })
  ),
};

const cssStylesObj = {
  emptyDetails: (theme) => ({
    ...theme.typography.LabelXSmall,
    color: theme.colors.contentTertiary,
    textAlign: 'center',
    padding: `${theme.sizing.scale700} 0`,
  }),
  detailsLabel: (theme) => ({
    minWidth: '150px',
    maxWidth: '150px',
    display: 'flex',
    color: theme.colors.contentTertiary,
    ...theme.typography.LabelXSmall,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
