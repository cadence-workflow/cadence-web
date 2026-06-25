import { type Theme, styled as createStyled } from 'baseui';
import { type StyleObject } from 'styletron-react';

import { LABEL_COLUMN_WIDTH_PX } from './schedule-details-table.constants';

export const styled = {
  Container: createStyled('div', (): StyleObject => ({
    width: '100%',
  })),
  Row: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: $theme.sizing.scale300,
      paddingTop: $theme.sizing.scale400,
      paddingBottom: $theme.sizing.scale400,
      wordBreak: 'break-word',
      ':not(:last-child)': {
        borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
      },
    })
  ),
  Label: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      minWidth: `${LABEL_COLUMN_WIDTH_PX}px`,
      maxWidth: `${LABEL_COLUMN_WIDTH_PX}px`,
      display: 'flex',
      ...$theme.typography.LabelSmall,
      lineHeight: $theme.typography.ParagraphSmall.lineHeight,
    })
  ),
  Value: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flex: '1 0 300px',
      ...$theme.typography.ParagraphSmall,
    })
  ),
};
