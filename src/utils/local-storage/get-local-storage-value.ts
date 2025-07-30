import { type z } from 'zod';

import logger from '../logger';

export default function getLocalStorageValue<S extends z.ZodTypeAny>(
  key: string,
  schema: S
): z.infer<S> | null {
  if (typeof window === 'undefined') return null;

  try {
    const localStorageVal = localStorage.getItem(key);
    if (!localStorageVal) return null;

    return schema.parse(localStorageVal);
  } catch (error) {
    logger.warn({ key, error }, 'Failed to get value from local storage');
    return null;
  }
}
