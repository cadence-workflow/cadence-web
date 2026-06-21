import { type Theme, withStyle } from 'baseui';
import { type BannerOverrides } from 'baseui/banner';
import { type ModalOverrides } from 'baseui/modal';
import { ModalBody, ModalFooter, ModalHeader } from 'baseui/modal';
import { type StyleObject } from 'styletron-react';

export const styled = {
  ModalHeader: withStyle(ModalHeader, ({ $theme }: { $theme: Theme }) => ({
    marginTop: $theme.sizing.scale850,
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
  banner: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        marginTop: $theme.sizing.scale400,
        marginBottom: 0,
      }),
    },
  } satisfies BannerOverrides,
};
