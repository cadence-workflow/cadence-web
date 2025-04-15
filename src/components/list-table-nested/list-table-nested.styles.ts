import { type Theme, styled as createStyled } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Table: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1050px',
  }),
  TableRow: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ':not(:last-child)': {
        borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
      },
      display: 'flex',
      [$theme.mediaQuery.medium]: {
        flexDirection: 'row',
        gap: $theme.sizing.scale1200,
      },
      flexDirection: 'column',
      gap: $theme.sizing.scale500,
      paddingTop: $theme.sizing.scale550,
      paddingBottom: $theme.sizing.scale550,
    })
  ),
  TitleBlock: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      [$theme.mediaQuery.medium]: {
        minWidth: '240px',
        maxWidth: '240px',
      },
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale100,
    })
  ),
  Title: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      fontWeight: '700',
    })
  ),
  Description: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphXSmall,
      lineHeight: '16px',
      color: $theme.colors.contentTertiary,
    })
  ),
  ContentContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphSmall,
    })
  ),
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
        justifyContent: 'space-between',
        alignItems: 'center',
        ':not(:last-child)': {
          borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
        },
      },
      flexDirection: 'column',
      alignItems: 'start',
      gap: $theme.sizing.scale200,
      paddingTop: $theme.sizing.scale100,
      paddingBottom: $theme.sizing.scale100,
    })
  ),
  SublistItemLabel: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      [$theme.mediaQuery.medium]: {
        minWidth: '120px',
      },
    })
  ),
  SublistItemValue: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphSmall,
    })
  ),
};
