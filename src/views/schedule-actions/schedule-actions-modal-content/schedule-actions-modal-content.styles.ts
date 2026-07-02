import { styled as createStyled, type Theme, withStyle } from 'baseui';
import { type BannerOverrides } from 'baseui/banner';
import { StyledLink } from 'baseui/link';
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
  Link: withStyle(StyledLink, ({ $theme }: { $theme: Theme }) => ({
    alignSelf: 'start',
    ...$theme.typography.LabelSmall,
    display: 'flex',
    alignItems: 'center',
    columnGap: $theme.sizing.scale100,
  })),
};

export const overrides = {
  banner: {
    Root: {
      style: {
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
      },
    },
  } satisfies BannerOverrides,
};
