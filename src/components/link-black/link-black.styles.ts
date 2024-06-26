import { withStyle } from 'baseui';
import { StyledLink } from 'baseui/link';

export const styled = {
  LinkBase: withStyle<typeof StyledLink, { disabled: boolean }>(
    StyledLink,
    ({ $theme }) => ({
      ...$theme.typography.ParagraphSmall,
      '[disabled]': {
        pointerEvents: 'none',
        color: `${$theme.colors.contentStateDisabled} !important`,
      },
      ':visited': {
        color: 'inherit',
      },
    })
  ),
};
