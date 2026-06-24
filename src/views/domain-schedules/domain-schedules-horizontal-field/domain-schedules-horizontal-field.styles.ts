import { styled as createStyled } from 'baseui';
import { type FormControlOverrides } from 'baseui/form-control';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  horizontalFieldFormControl: {
    ControlContainer: {
      style: {
        marginBottom: 0,
      },
    },
  } satisfies FormControlOverrides,
};

export const styled = {
  FieldRow: createStyled<'div', { $bordered: boolean }>(
    'div',
    ({ $theme, $bordered }): StyleObject => ({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: $theme.sizing.scale600,
      marginBottom: $theme.sizing.scale600,
      boxShadow: $bordered
        ? `inset 2px 0 0 ${$theme.colors.borderOpaque}`
        : undefined,
    })
  ),
  FieldLabelColumn: createStyled<'div', { $indent: boolean }>(
    'div',
    ({ $theme, $indent }): StyleObject => ({
      flexBasis: $indent ? 'calc(38% - 10px)' : '38%',
      flexGrow: 0,
      flexShrink: 0,
      maxWidth: '280px',
      paddingTop: $theme.sizing.scale100,
      paddingRight: $theme.sizing.scale400,
      paddingLeft: $indent ? $theme.sizing.scale500 : 0,
    })
  ),
  FieldControlColumn: createStyled<'div', { $indent: boolean }>(
    'div',
    ({ $theme, $indent }): StyleObject => ({
      flex: 1,
      minWidth: 0,
      paddingRight: $indent ? $theme.sizing.scale500 : 0,
    })
  ),
  FieldLabel: createStyled(
    'label',
    ({ $theme }): StyleObject => ({
      ...$theme.typography.font250,
      color: $theme.colors.contentPrimary,
      display: 'block',
      width: '100%',
      padding: 0,
      margin: 0,
    })
  ),
  FieldLabelText: createStyled(
    'div',
    ({ $theme }): StyleObject => ({
      ...$theme.typography.font250,
      color: $theme.colors.contentPrimary,
      width: '100%',
    })
  ),
  FieldDescription: createStyled(
    'div',
    ({ $theme }): StyleObject => ({
      ...$theme.typography.font100,
      color: $theme.colors.contentTertiary,
      marginTop: $theme.sizing.scale200,
    })
  ),
};
