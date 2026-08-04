import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

const rowStyles = ($theme: Theme): StyleObject => ({
  display: 'flex',
  alignItems: 'center',
  paddingTop: $theme.sizing.scale200,
  paddingBottom: $theme.sizing.scale200,
  borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
  // the label and value of the last row make up the last two grid items
  ':nth-last-child(-n+2)': {
    borderBottomColor: 'transparent',
  },
});

export const styled = {
  Content: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      minWidth: '280px',
      maxWidth: '440px',
      ...$theme.typography.ParagraphXSmall,
    })
  ),
  Entry: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'grid',
      gridTemplateColumns: 'max-content minmax(0, 1fr)',
      ':not(:last-child)': {
        borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
      },
    })
  ),
  EntryTitle: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      gridColumn: '1 / -1',
      ...$theme.typography.LabelSmall,
      color: $theme.colors.contentPrimary,
      wordBreak: 'break-all',
      paddingTop: $theme.sizing.scale300,
      paddingBottom: $theme.sizing.scale300,
      marginLeft: $theme.sizing.scale500,
      marginRight: $theme.sizing.scale500,
    })
  ),
  RowLabel: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...rowStyles($theme),
      ...$theme.typography.LabelXSmall,
      lineHeight: $theme.typography.ParagraphXSmall.lineHeight,
      color: $theme.colors.contentSecondary,
      marginLeft: $theme.sizing.scale500,
      paddingRight: $theme.sizing.scale600,
    })
  ),
  RowValue: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...rowStyles($theme),
      color: $theme.colors.contentPrimary,
      wordBreak: 'break-all',
      marginRight: $theme.sizing.scale500,
    })
  ),
  ValueWithIcon: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale200,
    })
  ),
};
