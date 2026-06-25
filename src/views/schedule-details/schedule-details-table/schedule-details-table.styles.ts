import { type Theme, styled as createStyled } from 'baseui';
import { type StyleObject } from 'styletron-react';

import { LABEL_COLUMN_WIDTH_PX } from './schedule-details-table.constants';

export const styled = {
  Table: createStyled(
    'table',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      width: '100%',
      borderCollapse: 'collapse',
      borderSpacing: 0,
      ...$theme.typography.ParagraphXSmall,
    })
  ),
  Row: createStyled(
    'tr',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ':not(:last-child)': {
        borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
      },
    })
  ),
  LabelCell: createStyled(
    'th',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelXSmall,
      width: `${LABEL_COLUMN_WIDTH_PX}px`,
      minWidth: `${LABEL_COLUMN_WIDTH_PX}px`,
      maxWidth: `${LABEL_COLUMN_WIDTH_PX}px`,
      textAlign: 'left',
      verticalAlign: 'top',
      paddingTop: $theme.sizing.scale400,
      paddingBottom: $theme.sizing.scale400,
      paddingLeft: 0,
      paddingRight: $theme.sizing.scale300,
      lineHeight: $theme.typography.ParagraphXSmall.lineHeight,
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
    })
  ),
  ValueCell: createStyled(
    'td',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphXSmall,
      verticalAlign: 'top',
      paddingTop: $theme.sizing.scale400,
      paddingBottom: $theme.sizing.scale400,
      paddingLeft: $theme.sizing.scale300,
      paddingRight: 0,
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
      whiteSpace: 'normal',
    })
  ),
};
