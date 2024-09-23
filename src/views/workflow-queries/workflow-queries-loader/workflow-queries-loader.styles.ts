import { styled as createStyled, withStyle } from 'baseui';

import PageSection from '@/components/page-section/page-section';

export const styled = {
  PageSection: withStyle(PageSection, () => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  })),
  PageContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale900,
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
  })),
  QueriesSidebar: createStyled('div', ({ $theme }) => ({
    [$theme.mediaQuery.medium]: {
      flex: '1 0 300px',
    },
    maxWidth: '450px',
    display: 'flex',
    flexDirection: 'column',
    rowGap: $theme.sizing.scale600,
  })),
  QueryResultView: createStyled('div', {
    flex: '1 0 300px',
  }),
};
