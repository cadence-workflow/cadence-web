import { withStyle } from 'baseui';
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
  TableMessage: withStyle(StyledTableLoadingMessage, {
    display: 'flex',
    justifyContent: 'center',
  }),
  TableHeadCell: withStyle<typeof StyledTableHeadCell, { $width: string }>(
    StyledTableHeadCell,
    ({ $theme, $width }) => ({
      ...$theme.typography.LabelXSmall,
      width: $width,
      color: '#5E5E5E',
    })
  ),
  TableBodyCell: withStyle<typeof StyledTableBodyCell, { $width: string }>(
    StyledTableBodyCell,
    ({ $width }) => ({
      width: $width,
      wordBreak: 'break-word',
    })
  ),
};
