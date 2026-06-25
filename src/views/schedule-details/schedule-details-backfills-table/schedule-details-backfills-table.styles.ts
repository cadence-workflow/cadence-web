import { type Theme } from 'baseui';
import { type TableOverrides } from 'baseui/table-semantic';
import { type StyleObject } from 'styletron-react';

import type {
  StyletronCSSObject,
  StyletronCSSObjectOf,
} from '@/hooks/use-styletron-classes';

const cssStylesObj = {
  section: () => ({
    display: 'flex',
    flexDirection: 'column',
  }),
  tableContainer: (theme) => ({
    overflowX: 'auto',
    paddingBottom: theme.sizing.scale400,
  }),
} satisfies StyletronCSSObject;

export const cssStyles: StyletronCSSObjectOf<typeof cssStylesObj> =
  cssStylesObj;

export const overrides = {
  table: {
    TableHeadCell: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelXSmall,
        lineHeight: $theme.typography.ParagraphXSmall.lineHeight,
        color: $theme.colors.contentTertiary,
      }),
    },
    TableBodyCell: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.ParagraphXSmall,
      }),
    },
    TableBodyRow: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ':not(:last-child)': {
          borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
        },
      }),
    },
  } satisfies TableOverrides,
};
