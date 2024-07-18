import { type Theme, styled as createStyled } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  FieldsContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      rowGap: $theme.sizing.scale800,
    })
  ),
  FieldContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      gap: $theme.sizing.scale1200,
    })
  ),
  Info: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      width: '300px',
      gap: $theme.sizing.scale200,
    })
  ),
  Title: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      color: $theme.colors.contentPrimary,
    })
  ),
  Description: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelXSmall,
      color: $theme.colors.contentTertiary,
      fontWeight: '400',
    })
  ),
  ButtonContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      paddingTop: $theme.sizing.scale900,
    })
  ),
};
