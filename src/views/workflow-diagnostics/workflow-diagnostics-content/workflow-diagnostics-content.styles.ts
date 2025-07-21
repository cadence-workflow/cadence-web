import { styled as createStyled, withStyle } from 'baseui';
import { type Theme } from 'baseui/theme';

import PageSection from '@/components/page-section/page-section';

export const styled = {
  ButtonsContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    gap: $theme.sizing.scale300,
  })),
  PageSection: withStyle(PageSection, ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale800,
  })),
  NoIssuesContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: $theme.sizing.scale600,
    padding: `${$theme.sizing.scale900} ${$theme.sizing.scale600}`,
  })),
  NoIssuesText: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.HeadingXSmall,
  })),
};
