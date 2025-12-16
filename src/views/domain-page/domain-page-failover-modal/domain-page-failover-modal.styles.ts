import { styled as createStyled, withStyle } from 'baseui';
import { ModalFooter, ModalHeader, type ModalOverrides } from 'baseui/modal';
import { type TableOverrides } from 'baseui/table-semantic';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  modal: {
    Close: {
      style: ({ $theme }): StyleObject => ({
        top: $theme.sizing.scale850,
        right: $theme.sizing.scale800,
      }),
    },
    Dialog: {
      style: (): StyleObject => ({
        width: '700px',
      }),
    },
  } satisfies ModalOverrides,
  table: {
    TableHeadCell: {
      style: ({ $theme }): StyleObject => ({
        ...$theme.typography.LabelXSmall,
        paddingTop: $theme.sizing.scale300,
        paddingBottom: $theme.sizing.scale300,
        paddingLeft: $theme.sizing.scale500,
        paddingRight: $theme.sizing.scale500,
        color: $theme.colors.contentTertiary,
      }),
    },
    TableBodyCell: {
      style: ({ $theme }): StyleObject => ({
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
  ModalHeader: withStyle(ModalHeader, ({ $theme }) => ({
    marginTop: $theme.sizing.scale850,
  })),
  InfoRow: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale800,
    marginBottom: 0,
    paddingLeft: $theme.sizing.scale500,
    paddingRight: $theme.sizing.scale500,
  })),
  InfoItem: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale200,
  })),
  InfoLabel: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentTertiary,
  })),
  InfoValue: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentPrimary,
  })),
  TableContainer: createStyled('div', ({ $theme }) => ({
    marginTop: $theme.sizing.scale600,
    maxHeight: '50vh',
    overflowY: 'auto',
  })),
  ModalFooter: withStyle(ModalFooter, {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  }),
};
