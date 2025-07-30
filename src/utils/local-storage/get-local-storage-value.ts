export default function getLocalStorageValue(key: string) {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem(key);
}
