import { withStyle } from 'baseui';
import { StyledTableBodyCell } from 'baseui/table-semantic';

export const styled = {
  TableBodyCell: withStyle<typeof StyledTableBodyCell>(StyledTableBodyCell, {
    verticalAlign: 'middle',
  }),
};
