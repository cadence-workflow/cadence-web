import { type Theme, withStyle } from 'baseui';
import {
  ModalBody,
  ModalFooter,
  ModalHeader,
  type ModalOverrides,
} from 'baseui/modal';
import { type StyleObject } from 'styletron-react';

export const styled = {
  ModalHeader: withStyle(ModalHeader, ({ $theme }: { $theme: Theme }) => ({
    marginTop: $theme.sizing.scale850,
  })),
  ModalBody: withStyle(ModalBody, ({ $theme }: { $theme: Theme }) => ({
    marginBottom: $theme.sizing.scale800,
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
  } satisfies ModalOverrides,
};
