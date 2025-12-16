import { type Theme, withStyle } from 'baseui';

import PageSection from '@/components/page-section/page-section';

export const styled = {
  Container: withStyle(PageSection, ({ $theme }: { $theme: Theme }) => ({
    marginBottom: $theme.sizing.scale700,
  })),
};
