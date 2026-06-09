import { type Theme, withStyle } from 'baseui';
import { type BannerOverrides } from 'baseui/banner';
import { type ModalOverrides } from 'baseui/modal';
import { ModalBody, ModalFooter, ModalHeader } from 'baseui/modal';
import { type StyleObject } from 'styletron-react';

export const styled = {
  ModalHeader: withStyle(ModalHeader, ({ $theme }: { $theme: Theme }) => ({
    marginTop: $theme.sizing.scale850,
    // First tab stop inside the dialog so Modal + focus-lock do not send focus to the cron row.
    outline: 'none',
    ':focus': {
      outline: 'none',
    },
  })),
  ModalBody: withStyle(ModalBody, ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: $theme.sizing.scale600,
    marginBottom: $theme.sizing.scale800,
    overflowY: 'auto',
    maxHeight: '70vh',
  })),
  ModalFooter: withStyle(ModalFooter, {
    display: 'flex',
    justifyContent: 'space-between',
  }),
};

export const overrides = {
  banner: {
    Root: {
      style: {
        marginLeft: 0,
        marginRight: 0,
      },
    },
  } satisfies BannerOverrides,
  modal: {
    Close: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        top: $theme.sizing.scale850,
        right: $theme.sizing.scale800,
      }),
    },
    Dialog: {
      style: (): StyleObject => ({
        width: '900px',
      }),
    },
  } satisfies ModalOverrides,
};
