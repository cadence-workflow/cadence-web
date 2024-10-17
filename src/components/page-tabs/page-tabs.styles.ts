import { styled as createStyled, type Theme } from 'baseui';
import { type TabOverrides, type TabsOverrides } from 'baseui/tabs-motion';
import type { StyleObject } from 'styletron-react';

import { getMediaQueryMargins } from '@/utils/media-query/get-media-queries-margins';

export const styled = {
  TabTitleContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: $theme.sizing.scale400,
  })),
};

export const overrides = {
  tabs: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        display: 'flex',
        flexDirection: 'column',
        borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
      }),
    },
    TabBar: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        width: '100%',
        alignSelf: 'center',
        ...getMediaQueryMargins($theme, (margin) => ({
          maxWidth: `${$theme.grid.maxWidth + 2 * margin}px`,
        })),
      }),
    },
    TabList: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...getMediaQueryMargins($theme),
        paddingBottom: 0,
        marginBottom: 0,
      }),
    },
    TabBorder: {
      style: {
        display: 'none',
      },
    },
    TabHighlight: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale0,
      }),
    },
  } satisfies TabsOverrides,
  tab: {
    TabPanel: {
      style: { display: 'none' },
    },
  } satisfies TabOverrides,
};
