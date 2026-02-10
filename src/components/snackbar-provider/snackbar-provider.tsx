'use client';
import {
  SnackbarProvider as BaseSnackbarProvider,
  PLACEMENT,
  DURATION,
} from 'baseui/snackbar';

import { overrides } from './snackbar-provider.styles';
import { type Props } from './snackbar-provider.types';

export default function SnackbarProvider({ children }: Props) {
  return (
    <BaseSnackbarProvider
      placement={PLACEMENT.bottom}
      overrides={overrides.snackbar}
      defaultDuration={DURATION.infinite}
    >
      {children}
    </BaseSnackbarProvider>
  );
}
