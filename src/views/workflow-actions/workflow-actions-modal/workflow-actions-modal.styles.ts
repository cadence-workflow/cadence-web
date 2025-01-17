import { type Theme } from 'baseui';
import { type ModalOverrides } from 'baseui/modal';
import { type StyleObject } from 'styletron-react';

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
