import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  MenuContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
  })),
  MenuHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: $theme.sizing.scale400,
  })),
  FiltersCount: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: $theme.sizing.scale300,
    ...$theme.typography.LabelMedium,
  })),
  MenuFilters: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale700,
  })),
};
