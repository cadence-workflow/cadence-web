import { styled as createStyled, withStyle, type Theme } from 'baseui';
import { ModalBody, ModalFooter, type ModalOverrides } from 'baseui/modal';
import { type TableOverrides } from 'baseui/table-semantic';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  modal: {
    Close: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
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
  ModalHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    padding: $theme.sizing.scale600,
  })),
  Title: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.HeadingSmall,
  })),
  ModalBody: withStyle(ModalBody, ({ $theme }: { $theme: Theme }) => ({
    padding: $theme.sizing.scale600,
  })),
  InfoRow: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale800,
    marginBottom: $theme.sizing.scale500,
    ':last-child': {
      marginBottom: 0,
    },
  })),
  InfoItem: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
  }),
  InfoLabel: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentSecondary,
    marginBottom: $theme.sizing.scale200,
  })),
  InfoValue: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentPrimary,
  })),
  TableContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    marginTop: $theme.sizing.scale600,
    maxHeight: '50vh',
    overflowY: 'auto',
  })),
  ModalFooter: withStyle(ModalFooter, ({ $theme }: { $theme: Theme }) => ({
    padding: `${$theme.sizing.scale500} ${$theme.sizing.scale600}`,
    borderTop: `1px solid ${$theme.colors.borderOpaque}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: $theme.sizing.scale400,
  })),
};
