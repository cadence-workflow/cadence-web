import { type z } from 'zod';

import logger from '../logger';

export default function getLocalStorageValue<
  S extends z.ZodTypeAny = z.ZodString,
>(key: string, schema?: S): z.infer<S> | null {
  if (typeof window === 'undefined') return null;

  try {
    const localStorageVal = localStorage.getItem(key);
    if (localStorageVal === null) return null;

    if (schema) {
      return schema.parse(localStorageVal);
    }

    return localStorageVal;
  } catch (error) {
    logger.warn({ key, error }, 'Failed to get value from local storage');
    return null;
  }
}
