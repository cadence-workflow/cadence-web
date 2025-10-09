import { styled as createStyled, type Theme } from 'baseui';
import type { StyleObject } from 'styletron-react';

export const styled = {
  PopoverContent: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      padding: $theme.sizing.scale600,
    })
  ),

  PopoverTitle: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      color: $theme.colors.contentPrimary,
      marginBottom: $theme.sizing.scale600,
      fontWeight: 600,
    })
  ),

  ExamplesContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      marginTop: $theme.sizing.scale200,
    })
  ),

  ExamplesList: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
    })
  ),

  ExampleItem: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale200,
      padding: `${$theme.sizing.scale200} 0`,
      borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
      ':last-child': {
        borderBottom: 'none',
      },
    })
  ),

  ExampleSymbol: createStyled(
    'span',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.MonoLabelXSmall,
      minWidth: '70px',
    })
  ),

  ExampleDescription: createStyled(
    'span',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      color: $theme.colors.contentTertiary,
      ...$theme.typography.LabelXSmall,
    })
  ),
};
