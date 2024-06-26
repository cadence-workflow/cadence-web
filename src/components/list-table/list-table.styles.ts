import { type Theme, styled as createStyled } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  ListRow: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ':not(:last-child)': {
        borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
      },
      display: 'flex',
      flexDirection: 'row',
      gap: $theme.sizing.scale300,
      flexWrap: 'wrap',
      minHeight: $theme.sizing.scale1200,
      paddingTop: $theme.sizing.scale550,
      paddingBottom: $theme.sizing.scale550,
      wordBreak: 'break-word',
    })
  ),
  ListItemLabel: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      minWidth: '160px',
      maxWidth: '160px',
      display: 'flex',
      ...$theme.typography.LabelSmall,
      lineHeight: $theme.typography.ParagraphSmall.lineHeight,
    })
  ),
  ListItemValue: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphSmall,
      display: 'flex',
      flex: '1 0 300px',
    })
  ),
};
