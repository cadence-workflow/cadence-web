import { withStyle } from 'baseui';

import PageSection from '@/components/page-section/page-section';

export const styled = {
  PageSection: withStyle(PageSection, () => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  })),
};
