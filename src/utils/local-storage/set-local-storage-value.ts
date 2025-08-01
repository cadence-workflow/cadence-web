import logger from '../logger';

export default function setLocalStorageValue(key: string, value: string) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, value);
  } catch (error) {
    logger.warn({ key, error, value }, 'Failed to save value to local storage');
  }
}
