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
    flexDirection: 'column',
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
  FloatingBarSlot: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    position: 'sticky',
    bottom: $theme.sizing.scale800,
    alignSelf: 'center',
    display: 'flex',
  })),
};
