import { type BadgeOverrides } from 'baseui/badge/types';
import { type Theme } from 'baseui/theme';

export const overrides = {
  badge: {
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
