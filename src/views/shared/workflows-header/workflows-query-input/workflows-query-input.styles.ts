import type { CSSProperties } from 'react';

import type { Theme } from 'baseui';
import { styled as createStyled } from 'baseui';
import type { ButtonOverrides } from 'baseui/button';
import type { InputOverrides } from 'baseui/input';
import type { StyleObject } from 'styletron-react';

export const styled = {
  QueryForm: createStyled('form', ({ $theme }: { $theme: Theme }) => ({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
    position: 'relative',
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
  })),
  AutosuggestContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    })
  ),
  SuggestionsContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      background: $theme.colors.backgroundPrimary,
      boxShadow: $theme.lighting.shadow400,
      borderRadius: $theme.borders.radius200,
      marginTop: $theme.sizing.scale100,
      zIndex: 10,
      position: 'absolute',
      width: '100%',
      maxHeight: '300px',
      overflowY: 'auto',
      left: 0,
      right: 0,
      top: '44px', // Consider using a theme value if possible
    })
  ),
  Suggestion: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    padding: `${$theme.sizing.scale200} ${$theme.sizing.scale600}`,
    cursor: 'pointer',
  })),
  SuggestionHighlighted: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      background: $theme.colors.buttonTertiaryHover,
    })
  ),
};

export const overrides = {
  input: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        flexGrow: 1,
        height: $theme.sizing.scale950,
      }),
    },
    Input: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.MonoParagraphXSmall,
      }),
    },
  } satisfies InputOverrides,
  runButton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        whiteSpace: 'nowrap',
        height: $theme.sizing.scale950,
        ...$theme.typography.LabelSmall,
      }),
    },
  } satisfies ButtonOverrides,
  suggestionButton: {
    Root: {
      style: ({ $theme, $isHighlighted }: any): StyleObject => ({
        width: '100%',
        justifyContent: 'flex-start',
        backgroundColor: $isHighlighted
          ? $theme.colors.buttonTertiaryHover
          : 'transparent',
      }),
    },
  },
};
