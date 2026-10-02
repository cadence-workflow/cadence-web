import { type ButtonOverrides } from 'baseui/button';
import type { StyleObject } from 'styletron-react';

export const overrides = {
  button: {
    BaseButton: {
      style: {
        width: '100%',
        justifyContent: 'flex-start',
      } satisfies StyleObject,
    },
  } satisfies ButtonOverrides,
};
