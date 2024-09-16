import { type Theme, withStyle } from 'baseui';
import {
  StyledRoot,
  StyledTableHeadCell,
  StyledTableBodyCell,
  StyledTableLoadingMessage,
} from 'baseui/table-semantic';

export const styled = {
  TableRoot: withStyle(StyledRoot, {
    alignSelf: 'center',
    flex: '1 1 0',
    overflow: 'visible',
    width: '100%',
  }),
  TableMessage: withStyle(
    StyledTableLoadingMessage,
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      justifyContent: 'center',
      justifySelf: 'stretch',
      // The base StyledTableLoadingMessage uses the shorthand property for paddding
      // https://styletron.org/concepts#shorthand-and-longhand-properties
      padding: `${$theme.sizing.scale600} 0`,
    })
  ),
  TableHeadCell: withStyle<typeof StyledTableHeadCell, { $width: string }>(
    StyledTableHeadCell,
    ({ $theme, $width }) => ({
      ...$theme.typography.LabelXSmall,
      width: $width,
      color: '#5E5E5E',
    })
  ),
  TableBodyCell: withStyle<typeof StyledTableBodyCell>(StyledTableBodyCell, {
    verticalAlign: 'middle',
  }),
};
