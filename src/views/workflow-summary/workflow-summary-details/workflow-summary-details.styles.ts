import { type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

export const overrides = {
  copyButton: {
    BaseButton: {
      // sized to the value's line height so copy rows stay as tall as the rest
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale650,
        width: $theme.sizing.scale650,
        padding: 0,
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }),
    },
  } satisfies ButtonOverrides,
};

const cssStylesObj = {
  pageContainer: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.sizing.scale500,
  }),
  detailsRow: (theme) => ({
    ':not(:last-child)': {
      borderBottom: `1px solid ${theme.colors.borderOpaque}`,
    },
    display: 'flex',
    flexDirection: 'row',
    gap: theme.sizing.scale300,
    flexWrap: 'wrap',
    paddingTop: theme.sizing.scale400,
    paddingBottom: theme.sizing.scale400,
    wordBreak: 'break-word',
    // keep these as two keys: styletron prepends the row's class to the start of
    // a key, not to each selector in a comma-separated list, so joining them
    // would emit ':focus-within ...' unprefixed and match every row on the page
    ':hover [data-copy-button]': { opacity: 1 },
    ':focus-within [data-copy-button]': { opacity: 1 },
  }),
  detailsLabel: (theme) => ({
    minWidth: '120px',
    maxWidth: '120px',
    display: 'flex',
    ...theme.typography.LabelXSmall,
    lineHeight: theme.typography.ParagraphXSmall.lineHeight, // gives the same line height as the value
  }),
  detailsValue: (theme) => ({
    ...theme.typography.ParagraphXSmall,
    display: 'flex',
    alignItems: 'center',
    gap: theme.sizing.scale100,
    flex: '1 0 300px',
  }),
  copyButton: () => ({
    opacity: 0,
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'opacity 150ms',
  }),
  workflowTitle: (theme) => ({
    ...theme.typography.LabelMedium,
    whiteSpace: 'wrap',
    wordBreak: 'break-all',
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;
