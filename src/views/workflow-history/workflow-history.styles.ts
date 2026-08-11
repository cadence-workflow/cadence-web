import { styled as createStyled, withStyle } from 'baseui';

import PageSection from '@/components/page-section/page-section';

export const styled = {
  Container: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    // This ensures the header section's z-index is relative to this container and does not
    // appear above external elements like popovers and modals.
    position: 'relative',
    zIndex: 0,
  }),
  ContentSection: withStyle(PageSection, ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingBottom: $theme.sizing.scale950,
  })),
};
