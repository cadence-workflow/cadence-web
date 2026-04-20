import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';

export const overrides = {
  newActionButton: {
    BaseButton: {
      style: () => ({
        justifyContent: 'flex-start',
        width: '100%',
      }),
    },
  } satisfies ButtonOverrides,
};

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    padding: $theme.sizing.scale600,
    gap: $theme.sizing.scale400,
  })),
  SectionLabel: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentSecondary,
    paddingTop: $theme.sizing.scale300,
    paddingLeft: $theme.sizing.scale500,
  })),
  List: createStyled('ul', () => ({
    listStyle: 'none',
    margin: 0,
    padding: 0,
  })),
  DraftIcon: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    display: 'inline-flex',
    fontSize: $theme.sizing.scale600,
    color: $theme.colors.contentSecondary,
  })),
};
