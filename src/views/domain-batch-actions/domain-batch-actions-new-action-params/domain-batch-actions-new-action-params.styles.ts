import { styled as createStyled, type Theme } from 'baseui';
import { type FormControlOverrides } from 'baseui/form-control';

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale600,
    alignItems: 'flex-start',
  })),
  DescriptionField: createStyled('div', () => ({
    flex: 1,
    minWidth: 0,
  })),
  RpsField: createStyled('div', () => ({
    width: '15%',
    flexShrink: 0,
  })),
};

export const overrides = {
  formControl: {
    ControlContainer: {
      style: {
        marginBottom: '0',
      },
    },
  } satisfies FormControlOverrides,
};
