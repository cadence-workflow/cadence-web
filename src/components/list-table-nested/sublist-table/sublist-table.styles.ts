import { type Theme, styled as createStyled } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Sublist: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      flexGrow: 1,
      rowGap: $theme.sizing.scale400,
      [$theme.mediaQuery.medium]: {
        rowGap: 0,
      },
    })
  ),
  SublistItem: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      [$theme.mediaQuery.medium]: {
        flexDirection: 'row',
        alignItems: 'baseline',
        columnGap: $theme.sizing.scale700,
        ':not(:last-child)': {
          borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
        },
      },
      flexDirection: 'column',
      alignItems: 'start',
      rowGap: $theme.sizing.scale200,
      paddingTop: $theme.sizing.scale100,
      paddingBottom: $theme.sizing.scale100,
    })
  ),
  SublistItemLabel: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      overflow: 'hidden',
      overflowWrap: 'anywhere',
      [$theme.mediaQuery.medium]: {
        minWidth: '120px',
        maxWidth: '120px',
      },
    })
  ),
  SublistItemValue: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphSmall,
      overflow: 'hidden',
      overflowWrap: 'anywhere',
    })
  ),
};
