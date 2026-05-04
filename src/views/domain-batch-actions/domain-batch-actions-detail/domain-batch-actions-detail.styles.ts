import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';

export const overrides = {
  abortButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }) => ({
        background: $theme.colors.negative,
      }),
    },
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
    width: '100%',
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
  ProgressSection: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    paddingTop: $theme.sizing.scale600,
  })),
};
