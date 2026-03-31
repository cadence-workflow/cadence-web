import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import type { StyleObject } from 'styletron-react';

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    backgroundColor: $theme.colors.backgroundPrimary,
    borderRadius: $theme.borders.radius400,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
    maxWidth: '380px',
    minWidth: '300px',
    outline: 'none',
  })),
  Header: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: `${$theme.sizing.scale600} ${$theme.sizing.scale600} 0`,
    gap: $theme.sizing.scale300,
  })),
  Title: createStyled('h2', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelMedium,
    color: $theme.colors.contentPrimary,
    margin: '0',
    flex: '1',
  })),
  Body: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphSmall,
    color: $theme.colors.contentSecondary,
    padding: `${$theme.sizing.scale400} ${$theme.sizing.scale600}`,
  })),
  Footer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${$theme.sizing.scale400} ${$theme.sizing.scale600} ${$theme.sizing.scale600}`,
  })),
  Progress: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentTertiary,
  })),
  FooterActions: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale300,
    alignItems: 'center',
  })),
};

export const overrides = {
  closeButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        paddingTop: $theme.sizing.scale100,
        paddingRight: $theme.sizing.scale100,
        paddingBottom: $theme.sizing.scale100,
        paddingLeft: $theme.sizing.scale100,
      }),
    },
  } satisfies ButtonOverrides,
};
