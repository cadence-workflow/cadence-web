import { type Theme } from 'baseui';
import { type CheckboxOverrides } from 'baseui/checkbox';
import { type FormControlOverrides } from 'baseui/form-control';
import { type StyleObject } from 'styletron-react';

import type { DomainSchedulesHorizontalFieldOverrides } from '@/views/domain-schedules/domain-schedules-horizontal-field/domain-schedules-horizontal-field.types';

export const overrides = {
  taskListWarningField: {
    FormControl: {
      props: {
        overrides: {
          Caption: {
            style: ({ $theme }: { $theme: Theme }): StyleObject => ({
              color: $theme.colors.warning500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }),
          },
        } satisfies FormControlOverrides,
      },
    },
  } satisfies DomainSchedulesHorizontalFieldOverrides,
  pauseOnFailureCheckbox: {
    Root: {
      style: (): StyleObject => ({
        // Default is `flex-start` for horizontal label placement; center with the tick.
        alignItems: 'center',
      }),
    },
    Label: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.font250,
        color: $theme.colors.contentPrimary,
      }),
    },
  } satisfies CheckboxOverrides,
};
