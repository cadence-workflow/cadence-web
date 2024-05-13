import { getMediaQueryMargins } from '@/utils/media-query/get-media-queries-margins';
import type { Theme } from 'baseui';
import { TabOverrides, TabsOverrides } from 'baseui/tabs-motion';
import type { StyleObject } from 'styletron-react';

export const overrides = {
  tabs: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid #F3F3F3',
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
