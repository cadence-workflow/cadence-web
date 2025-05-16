import { type BadgeOverrides } from 'baseui/badge/types';
import { type Theme } from 'baseui/theme';

import themeLight from '@/config/theme/theme-light.config';

export const overrides = {
  Badge: {
    Badge: {
      style: ({
        $theme,
        $hierarchy,
      }: {
        $theme: Theme;
        $hierarchy: string;
      }) => ({
        ...$theme.typography.LabelXSmall,
        ...($hierarchy === 'secondary'
          ? {
              color: $theme.colors.contentSecondary,
            }
          : null),
      }),
    },
  } satisfies BadgeOverrides,
};
