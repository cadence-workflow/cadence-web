import { styled as createStyled } from 'baseui';

type ButtonProps = {
  $isLoading?: boolean;
};

export const styled = {
  ViewContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale600,
  })),
  
  SectionContainer: createStyled('div', ({ $theme }) => ({
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
  
  Button: createStyled<'button', ButtonProps>('button', ({ $theme, $isLoading }) => ({
    ...$theme.typography.LabelMedium,
    backgroundColor: $theme.colors.buttonPrimaryFill,
    color: $theme.colors.buttonPrimaryText,
    border: 'none',
    borderRadius: $theme.borders.radius300,
    padding: `${$theme.sizing.scale300} ${$theme.sizing.scale500}`,
    cursor: $isLoading ? 'not-allowed' : 'pointer',
    opacity: $isLoading ? 0.6 : 1,
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: $isLoading ? $theme.colors.buttonPrimaryFill : $theme.colors.buttonPrimaryHover,
    },
    ':active': {
      backgroundColor: $isLoading ? $theme.colors.buttonPrimaryFill : $theme.colors.buttonPrimaryActive,
    },
    ':disabled': {
      backgroundColor: $theme.colors.buttonDisabledFill,
      color: $theme.colors.buttonDisabledText,
      cursor: 'not-allowed',
    },
  })),
};

