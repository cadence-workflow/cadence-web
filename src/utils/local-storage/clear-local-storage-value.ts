export default function clearLocalStorageValue(key: string) {
  if (typeof window === undefined) return;
  localStorage.removeItem(key);
}
