import { type Theme } from 'baseui';
import { type SwitchOverrides } from 'baseui/switch';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  switch: {
    Root: {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 0,
      } satisfies StyleObject,
    },
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
        display: 'flex',
        alignItems: 'center',
        gap: $theme.sizing.scale200,
      }),
    },
  } satisfies SwitchOverrides,
};
