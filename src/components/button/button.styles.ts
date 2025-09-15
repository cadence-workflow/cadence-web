import { type Theme, styled as createStyled } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';

export const styled = {
  SkeletonLoader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    // https://github.com/uber/baseweb/blob/main/src/skeleton/skeleton.tsx
    // Background animation
    animationTimingFunction: 'ease-out',
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    backgroundSize: '400% 100%',
    animationName: {
      '0%': {
        backgroundPosition: '100% 50%',
      },
      '100%': {
        backgroundPosition: '0% 50%',
      },
    },
    // Background gradient
    backgroundImage: `linear-gradient(135deg,
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundSecondary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary},
            ${$theme.colors.backgroundTertiary})`,
  })),
};
export const overrides = (isSkeletonLoading: boolean) => ({
  button: {
    BaseButton: {
      style: {
        ...(isSkeletonLoading && {
          overflow: 'hidden',
          position: 'relative',
        }),
      },
    },
  } satisfies ButtonOverrides,
});
