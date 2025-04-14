import { styled as createStyled, withStyle, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import {
  ModalBody,
  ModalFooter,
  ModalHeader,
  type ModalOverrides,
} from 'baseui/modal';
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
  viewButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        paddingLeft: $theme.sizing.scale400,
        paddingRight: $theme.sizing.scale400,
      }),
    },
  } satisfies ButtonOverrides,
  jsonButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        width: $theme.sizing.scale950,
        height: $theme.sizing.scale950,
        backgroundColor: $theme.colors.backgroundSecondary,
      }),
    },
  } satisfies ButtonOverrides,
};

export const styled = {
  ViewContainer: createStyled('div', ({ $theme }) => ({
    flex: '1 0 150px',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column-reverse',
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: $theme.sizing.scale600,
    padding: $theme.sizing.scale600,
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius300,
  })),
  ButtonsContainer: createStyled('div', {
    display: 'flex',
  }),
  ModalHeader: withStyle(ModalHeader, ({ $theme }: { $theme: Theme }) => ({
    marginTop: $theme.sizing.scale800,
    marginBottom: $theme.sizing.scale700,
  })),
  ModalBody: withStyle(ModalBody, ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: $theme.sizing.scale600,
    marginBottom: $theme.sizing.scale800,
  })),
  ModalFooter: withStyle(ModalFooter, ({ $theme }: { $theme: Theme }) => ({
    marginBottom: $theme.sizing.scale700,
    paddingTop: 0,
    paddingBottom: 0,
  })),
};
