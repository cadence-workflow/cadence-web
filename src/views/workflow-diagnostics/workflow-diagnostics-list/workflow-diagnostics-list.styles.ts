import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  IssuesGroupsContainer: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  }),
  IssuesTitle: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelLarge,
    })
  ),
  IssuesGroup: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale500,
      ':not(:first-child)': {
        paddingTop: $theme.sizing.scale600,
      },
      ':not(:last-child)': {
        borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
        paddingBottom: $theme.sizing.scale600,
      },
    })
  ),
};
