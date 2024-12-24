import { type Theme, withStyle } from 'baseui';
import { StyledTableLoadingMessage } from 'baseui/table-semantic';

export const styled = {
  TableFooterMessage: withStyle(
    StyledTableLoadingMessage,
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      justifyContent: 'center',
      justifySelf: 'stretch',
      // The base StyledTableLoadingMessage uses the shorthand property for padding
      // https://styletron.org/concepts#shorthand-and-longhand-properties
      padding: `${$theme.sizing.scale600} 0`,
    })
  ),
};
