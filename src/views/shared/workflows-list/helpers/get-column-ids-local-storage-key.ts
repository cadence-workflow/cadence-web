/**
 * Returns the local storage key for persisted column IDs.
 *
 * Keyed by domain name rather than domain ID intentionally —
 * domains that share a name likely serve the same use case for a given user.
 */
export default function getColumnIdsLocalStorageKey(domain: string) {
  return `columns_${domain}`;
}
