import { type Theme, styled as createStyled } from 'baseui';
import { type StyleObject } from 'styletron-react';

const LABEL_COLUMN_WIDTH_PX = 160;

export const styled = {
  Table: createStyled(
    'table',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      width: '100%',
      borderCollapse: 'collapse',
      borderSpacing: 0,
      ...$theme.typography.ParagraphSmall,
    })
  ),
  Row: createStyled(
    'tr',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ':not(:last-child)': {
        borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
      },
      ':nth-child(even)': {
        backgroundColor: $theme.colors.backgroundSecondary,
      },
    })
  ),
  LabelCell: createStyled(
    'th',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      width: `${LABEL_COLUMN_WIDTH_PX}px`,
      minWidth: `${LABEL_COLUMN_WIDTH_PX}px`,
      maxWidth: `${LABEL_COLUMN_WIDTH_PX}px`,
      textAlign: 'left',
      verticalAlign: 'top',
      paddingTop: $theme.sizing.scale550,
      paddingBottom: $theme.sizing.scale550,
      paddingLeft: $theme.sizing.scale500,
      paddingRight: $theme.sizing.scale300,
      lineHeight: $theme.typography.ParagraphSmall.lineHeight,
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
    })
  ),
  ValueCell: createStyled(
    'td',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphSmall,
      verticalAlign: 'top',
      paddingTop: $theme.sizing.scale550,
      paddingBottom: $theme.sizing.scale550,
      paddingLeft: $theme.sizing.scale300,
      paddingRight: $theme.sizing.scale500,
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
      whiteSpace: 'normal',
    })
  ),
};
