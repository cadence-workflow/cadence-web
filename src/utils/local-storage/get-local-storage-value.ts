import logger from '../logger';

export default function getLocalStorageValue(key: string) {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(key);
  } catch (error) {
    logger.warn({ key, error }, 'Failed to get value from local storage');
    return null;
  }
}
