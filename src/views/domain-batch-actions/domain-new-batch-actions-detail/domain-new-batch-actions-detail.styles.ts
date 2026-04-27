import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';

export const overrides = {
  discardButton: {
    StartEnhancer: {
      style: ({ $theme }: { $theme: Theme }) => ({
        fontSize: $theme.sizing.scale700,
      }),
    },
  } satisfies ButtonOverrides,
};

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: $theme.sizing.scale600,
  })),
  Header: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: $theme.sizing.scale600,
  })),
  Title: createStyled('h2', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.HeadingXSmall,
  })),
  WorkflowsListPlaceholder: createStyled('div', () => ({
    position: 'relative',
    flex: 1,
    minHeight: '400px',
  })),
};
