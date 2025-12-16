import { type Theme } from 'baseui';
import type { FormControlOverrides } from 'baseui/form-control/types';
import { type SelectOverrides } from 'baseui/select';
import { type TagOverrides } from 'baseui/tag';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  selectFormControl: {
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelXSmall,
      }),
    },
    ControlContainer: {
      style: (): StyleObject => ({
        margin: '0px',
      }),
    },
  } satisfies FormControlOverrides,
  select: {
    Tag: {
      props: {
        overrides: {
          Root: {
            style: ({ $theme }: { $theme: Theme }) => ({
              color: $theme.colors.contentPrimary,
              border: `1px solid ${$theme.colors.contentPrimary}`,
              backgroundColor: $theme.colors.backgroundSecondary,
              marginTop: $theme.sizing.scale0,
              marginLeft: $theme.sizing.scale0,
              marginRight: $theme.sizing.scale0,
              marginBottom: $theme.sizing.scale0,
            }),
          },
          Action: {
            style: ({ $theme }: { $theme: Theme }) => ({
              marginLeft: $theme.sizing.scale100,
            }),
          },
        } satisfies TagOverrides,
      },
    },
  } satisfies SelectOverrides,
};
