import { styled as createStyled, withStyle, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import {
  ModalBody,
  ModalFooter,
  ModalHeader,
  type ModalOverrides,
} from 'baseui/modal';
import { type StyleObject } from 'styletron-react';

export const styled = {
  ViewerContainer: createStyled<'div', { $isNegative: boolean }>(
    'div',
    ({ $theme, $isNegative }: { $theme: Theme; $isNegative: boolean }) => ({
      padding: $theme.sizing.scale600,
      backgroundColor: $isNegative
        ? $theme.colors.backgroundNegativeLight
        : $theme.colors.backgroundSecondary,
      borderRadius: $theme.borders.radius300,
      height: '100%',
    })
  ),
  ViewerHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale600,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  })),
  ViewerLabel: createStyled<'div', { $isNegative: boolean }>(
    'div',
    ({ $theme, $isNegative }: { $theme: Theme; $isNegative: boolean }) => ({
      color: $isNegative
        ? $theme.colors.contentNegative
        : $theme.colors.contentPrimary,
      ...$theme.typography.LabelSmall,
    })
  ),
  JsonContainer: createStyled('div', {
    maxHeight: '30vh',
    overflow: 'auto',
  }),
  ViewContainer: createStyled('div', ({ $theme }) => ({
    position: 'relative',
    padding: $theme.sizing.scale600,
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius300,
  })),
  ButtonsContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale600,
    justifyContent: 'flex-end',
  })),
  ModalButtonsContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      position: 'absolute',
      top: '10px',
      right: '10px',
      display: 'flex',
      gap: $theme.sizing.scale600,
    })
  ),
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

export const overrides = {
  modal: {
    Close: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        top: $theme.sizing.scale850,
        right: $theme.sizing.scale800,
      }),
    },
  } satisfies ModalOverrides,
  actionButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        width: $theme.sizing.scale900,
        height: $theme.sizing.scale900,
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }),
    },
  } satisfies ButtonOverrides,
};
