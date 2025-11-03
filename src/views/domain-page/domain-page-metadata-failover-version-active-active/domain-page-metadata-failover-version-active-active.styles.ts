import { styled as createStyled, type Theme } from 'baseui';
import { type TableOverrides } from 'baseui/table-semantic';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  table: {
    TableHeadCell: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelXSmall,
        paddingTop: $theme.sizing.scale300,
        paddingBottom: $theme.sizing.scale300,
        paddingLeft: $theme.sizing.scale500,
        paddingRight: $theme.sizing.scale500,
      }),
    },
    TableBodyCell: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.ParagraphXSmall,
        paddingTop: $theme.sizing.scale300,
        paddingBottom: $theme.sizing.scale300,
        paddingLeft: $theme.sizing.scale500,
        paddingRight: $theme.sizing.scale500,
      }),
    },
  } satisfies TableOverrides,
};

export const styled = {
  FailoverVersionsContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: $theme.sizing.scale500,
  })),
};
