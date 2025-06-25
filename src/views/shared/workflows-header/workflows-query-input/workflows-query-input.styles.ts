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
};

export const autosuggestStyles: Partial<
  Record<string, string | CSSProperties>
> = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  suggestionsContainer: {
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    borderRadius: '4px',
    marginTop: '4px',
    zIndex: 10,
    position: 'absolute',
    width: '100%',
    maxHeight: '300px',
    overflowY: 'auto',
    left: 0,
    right: 0,
    top: '44px',
  },
  suggestion: {
    padding: '8px 16px',
    cursor: 'pointer',
  },
  suggestionHighlighted: {
    background: '#f0f0f0',
  },
};
