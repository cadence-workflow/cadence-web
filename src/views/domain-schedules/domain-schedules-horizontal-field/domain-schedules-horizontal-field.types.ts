import type { ReactNode } from 'react';

export type Props = {
  label: ReactNode;
  description?: ReactNode;
  /** When set, associates the left column with the control via `htmlFor` / `id`. */
  htmlFor?: string;
  error?: ReactNode;
  caption?: ReactNode;
  /** Subfields are fields that are nested under a parent field.
   * Set to `true` to add a left border and indent the row content. */
  subfield?: boolean;
  children: ReactNode;
};
