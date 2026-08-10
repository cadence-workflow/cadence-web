import type { ReactNode } from 'react';

import { type FormControlOverrides } from 'baseui/form-control';

export type DomainSchedulesHorizontalFieldOverrides = {
  FormControl?: {
    props?: {
      overrides?: FormControlOverrides;
    };
  };
};

export type Props = {
  label: ReactNode;
  description?: ReactNode;
  /** When set, associates the left column with the control via `htmlFor` / `id`. */
  htmlFor?: string;
  error?: ReactNode;
  caption?: ReactNode;
  overrides?: DomainSchedulesHorizontalFieldOverrides;
  /** Subfields are fields that are nested under a parent field.
   * Set to `true` to add a left border and indent the row content. */
  subfield?: boolean;
  children: ReactNode;
};
