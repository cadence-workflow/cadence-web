import { type ButtonOverrides } from 'baseui/button';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  jsonStaticTitle: (theme) => ({
    ...theme.typography.LabelSmall,
  }),
  jsonViewContainer: (theme) => ({
    padding: theme.sizing.scale600,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borders.radius300,
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
