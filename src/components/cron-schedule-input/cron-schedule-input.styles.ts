import { styled as createStyled, type Theme } from 'baseui';
import type { FormControlOverrides } from 'baseui/form-control/types';
import { type InputOverrides } from 'baseui/input';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  formControl: {
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelXSmall,
        color: $theme.colors.contentTertiary,
        marginBottom: '4px',
      }),
    },
    ControlContainer: {
      style: (): StyleObject => ({
        margin: '0px',
      }),
    },
  } satisfies FormControlOverrides,
  input: {
    Root: {
      style: ({ $theme: _theme }: { $theme: Theme }): StyleObject => ({
        width: '100px',
      }),
    },
    Input: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        textAlign: 'center',
        ...$theme.typography.LabelSmall,
      }),
    },
  } satisfies InputOverrides,
  popover: {
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
        background: $theme.colors.backgroundPrimary,
        maxWidth: '320px',
      }),
    },
  } satisfies PopoverOverrides,
};

export const styled = {
  Container: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'flex-end',
      gap: $theme.sizing.scale300,
      flexWrap: 'wrap',
    })
  ),

  FieldContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: $theme.sizing.scale100,
    })
  ),
  Description: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelXSmall,
      color: $theme.colors.contentSecondary,
      width: '100%',
      marginTop: $theme.sizing.scale300,
    })
  ),
};
