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
      flexGrow: 1,
      overflow: 'hidden',
      overflowWrap: 'anywhere',
      ...$theme.typography.ParagraphSmall,
    })
  ),
};
