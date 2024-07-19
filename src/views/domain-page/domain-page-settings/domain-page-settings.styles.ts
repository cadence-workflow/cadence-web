import { styled as createStyled, type Theme } from 'baseui';
import { type ToasterOverrides } from 'baseui/toast';
import { type StyleObject } from 'styletron-react';

export const styled = {
  SettingsContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    paddingTop: $theme.sizing.scale950,
  })),
};

export const overrides = {
  toast: {
    ToastBody: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        columnGap: $theme.sizing.scale300,
        [$theme.mediaQuery.medium]: {
          width: '500px',
        },
      }),
    },
    ToastCloseIcon: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        alignSelf: 'center',
        width: $theme.sizing.scale800,
        height: $theme.sizing.scale800,
      }),
    },
  } satisfies ToasterOverrides,
};
