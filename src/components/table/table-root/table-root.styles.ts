import { withStyle } from 'baseui';
import { StyledRoot } from 'baseui/accordion';

export const styled = {
  TableRoot: withStyle(StyledRoot, {
    alignSelf: 'center',
    flex: '1 1 0',
    overflow: 'visible',
    width: '100%',
  }),
};
