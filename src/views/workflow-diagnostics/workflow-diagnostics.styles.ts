import { withStyle } from 'baseui';
import { type Theme } from 'baseui/theme';

import PageSection from '@/components/page-section/page-section';

export const styled = {
  PageSection: withStyle(PageSection, ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale800,
  })),
};
