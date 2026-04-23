import { z } from 'zod';

import getLocalStorageValue from '@/utils/local-storage/get-local-storage-value';
import setLocalStorageValue from '@/utils/local-storage/set-local-storage-value';

export const COMPLETED_TOURS_STORAGE_KEY = 'guided-tour:completed';

const completedToursSchema = z
  .string()
  .transform((val, ctx) => {
    try {
      return JSON.parse(val);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid JSON',
      });
      return z.NEVER;
    }
  })
  .pipe(z.record(z.literal(true)));

function readCompletedTours(): Record<string, true> {
  return (
    getLocalStorageValue(COMPLETED_TOURS_STORAGE_KEY, completedToursSchema) ??
    {}
  );
}

export function isTourCompleted(tourId: string): boolean {
  return readCompletedTours()[tourId] === true;
}

export function markTourCompleted(tourId: string): void {
  const completed = readCompletedTours();
  if (completed[tourId]) return;
  setLocalStorageValue(
    COMPLETED_TOURS_STORAGE_KEY,
    JSON.stringify({ ...completed, [tourId]: true })
  );
}
