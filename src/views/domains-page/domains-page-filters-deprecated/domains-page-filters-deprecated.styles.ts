import { type Theme } from 'baseui';
import { type CheckboxOverrides } from 'baseui/checkbox';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  checkbox: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        alignItems: 'center',
        paddingTop: $theme.sizing.scale400,
        paddingBottom: $theme.sizing.scale400,
        paddingLeft: $theme.sizing.scale300,
        paddingRight: $theme.sizing.scale700,
      }),
    },
    ToggleTrack: {
      style: {
        marginTop: 0,
        marginBottom: 0,
      },
    },
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelXSmall,
        paddingLeft: $theme.sizing.scale400,
      }),
    },
  } satisfies CheckboxOverrides,
};
