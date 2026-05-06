import { z } from 'zod';

import getLocalStorageValue from '@/utils/local-storage/get-local-storage-value';
import setLocalStorageValue from '@/utils/local-storage/set-local-storage-value';

import { COMPLETED_TOURS_STORAGE_KEY } from '../guided-tour.constants';

const completedToursSchema = z.record(z.literal(true));

function readCompletedTours(): Record<string, true> {
  const raw = getLocalStorageValue(COMPLETED_TOURS_STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    const result = completedToursSchema.safeParse(parsed);
    return result.success ? result.data : {};
  } catch {
    return {};
  }
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
