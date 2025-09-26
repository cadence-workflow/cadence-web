import { styled as createStyled } from 'baseui';

export const styled = {
  ViewContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale600,
  })),

  SectionContainer: createStyled('div', () => ({
    display: 'block',
    wordBreak: 'break-word',
    overflow: 'hidden',
  })),

  DividerContainer: createStyled('hr', ({ $theme }) => ({
    border: 'none',
    borderTop: `2px solid ${$theme.colors.backgroundTertiary}`,
    margin: `${$theme.sizing.scale400} 0`,
    width: '100%',
  })),
  ActionsContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: $theme.sizing.scale400,
    flexWrap: 'wrap',
    alignItems: 'center',
  })),
};
