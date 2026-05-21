import { type Theme, withStyle, styled as createStyled } from 'baseui';
import { StyledLink } from 'baseui/link';
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
    display: 'flex',
    flexDirection: 'column',
    rowGap: $theme.sizing.scale600,
    marginBottom: $theme.sizing.scale800,
  })),
  ModalFooter: withStyle(ModalFooter, {
    display: 'flex',
    justifyContent: 'space-between',
  }),
  Description: createStyled(
    'p',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphSmall,
      color: $theme.colors.contentSecondary,
      marginTop: 0,
      marginBottom: 0,
    })
  ),
  SelectionText: createStyled(
    'span',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      color: $theme.colors.contentPrimary,
    })
  ),
  Link: withStyle(StyledLink, ({ $theme }: { $theme: Theme }) => ({
    alignSelf: 'start',
    ...$theme.typography.LabelSmall,
    display: 'flex',
    alignItems: 'center',
    columnGap: $theme.sizing.scale100,
  })),
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
        maxWidth: '600px',
      }),
    },
  } satisfies ModalOverrides,
};
