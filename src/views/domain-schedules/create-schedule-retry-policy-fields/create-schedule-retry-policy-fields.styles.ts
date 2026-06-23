import { type Theme } from 'baseui';
import { type CheckboxOverrides } from 'baseui/checkbox';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  toggle: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
      }),
    },
  } satisfies CheckboxOverrides,
};
