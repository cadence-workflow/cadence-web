import { styled as createStyled, type Theme, withStyle } from 'baseui';
import { type BannerOverrides } from 'baseui/banner';
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
  ContextBanner: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      marginBottom: $theme.sizing.scale500,
    })
  ),
  ModalBodyContent: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      rowGap: $theme.sizing.scale600,
    })
  ),
  ModalFooter: withStyle(ModalFooter, {
    display: 'flex',
    justifyContent: 'space-between',
  }),
};

export const overrides = {
  contextBanner: {
    Root: {
      style: {
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
      },
    },
  } satisfies BannerOverrides,
  banner: {
    Root: {
      style: {
        marginLeft: 0,
        marginRight: 0,
      },
    },
  } satisfies BannerOverrides,
};
