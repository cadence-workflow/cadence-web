import logger from '../logger';

export default function clearLocalStorageValue(key: string) {
  if (typeof window === 'undefined') return;

  try {
    return localStorage.removeItem(key);
  } catch (error) {
    logger.warn({ key, error }, 'Failed to clear value from local storage');
  }
}
