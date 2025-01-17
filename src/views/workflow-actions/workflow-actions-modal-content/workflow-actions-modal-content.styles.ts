import { type Theme, withStyle } from 'baseui';
import { type BannerOverrides } from 'baseui/banner';
import { ModalBody, ModalFooter, ModalHeader } from 'baseui/modal';

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
  banner: {
    Root: {
      style: {
        marginLeft: 0,
        marginRight: 0,
      },
    },
  } satisfies BannerOverrides,
};
