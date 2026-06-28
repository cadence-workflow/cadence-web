import { styled as createStyled, type Theme } from 'baseui';
import { type TableOverrides } from 'baseui/table-semantic';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Section: createStyled('section', (): StyleObject => ({
    display: 'flex',
    flexDirection: 'column',
  })),
  TableContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      overflowX: 'auto',
      paddingBottom: $theme.sizing.scale400,
    })
  ),
};

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
