import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Content: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      minWidth: '280px',
      maxWidth: '440px',
      maxHeight: '50vh',
      overflow: 'auto',
      ...$theme.typography.ParagraphXSmall,
    })
  ),
  Entry: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ':not(:last-child)': {
        borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
      },
    })
  ),
  EntryTitle: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      color: $theme.colors.contentPrimary,
      wordBreak: 'break-all',
      paddingTop: $theme.sizing.scale300,
      paddingBottom: $theme.sizing.scale300,
      marginLeft: $theme.sizing.scale500,
      marginRight: $theme.sizing.scale500,
    })
  ),
  EntryRow: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'grid',
      gridTemplateColumns: 'max-content minmax(0, 1fr)',
      alignItems: 'center',
      paddingTop: $theme.sizing.scale200,
      paddingBottom: $theme.sizing.scale200,
      borderBottom: '1px solid transparent',
      ':not(:last-child)': {
        borderBottomColor: $theme.colors.borderOpaque,
      },
    })
  ),
  RowLabel: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
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
      color: $theme.colors.contentPrimary,
      wordBreak: 'break-all',
      marginRight: $theme.sizing.scale500,
    })
  ),
};
