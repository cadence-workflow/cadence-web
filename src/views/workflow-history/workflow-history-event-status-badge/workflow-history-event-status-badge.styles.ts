import { styled as createStyled, withStyle, type Theme } from 'baseui';
import { type BadgeProps, type BadgeOverrides } from 'baseui/badge';
import { type SkeletonOverrides } from 'baseui/skeleton/types';
import { Spinner } from 'baseui/spinner';
import { type StyleObject } from 'styletron-react';

export const styled = {
  BadgeContentContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      ...$theme.typography.LabelXSmall,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: $theme.sizing.scale100,
    })
  ),
  OngoingSpinner: withStyle(Spinner, ({ $theme }) => ({
    width: $theme.sizing.scale500,
    height: $theme.sizing.scale500,
    borderWidth: '2px',
    marginRight: '1px',
    marginLeft: '1px',
    borderTopColor: $theme.colors.contentInversePrimary,
    borderRightColor: $theme.colors.accent300,
    borderLeftColor: $theme.colors.accent300,
    borderBottomColor: $theme.colors.accent300,
  })),
};

export const overrides = {
  badge: {
    Badge: {
      style: ({
        $theme,
        $color,
        $hierarchy,
      }: {
        $theme: Theme;
        $color: BadgeProps['color'];
        $hierarchy: BadgeProps['hierarchy'];
      }): StyleObject => {
        if ($color === 'positive' && $hierarchy === 'secondary') {
          return {
            color: $theme.colors.positive500,
          };
        }

        return {};
      },
    },
  } satisfies BadgeOverrides,
  badgeSkeleton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }) => ({
        borderRadius: $theme.borders.radius200,
        flexShrink: 0,
      }),
    },
  } satisfies SkeletonOverrides,
};
