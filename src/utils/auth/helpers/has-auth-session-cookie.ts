import { type AuthServerRegistryEntry } from '../auth.types';

export default function hasAuthSessionCookie(
  cookies: { getAll: () => Array<{ name: string }> },
  cookieNames: AuthServerRegistryEntry['cookieNames']
): boolean {
  return cookies
    .getAll()
    .some(
      ({ name }) =>
        cookieNames.exact.includes(name) ||
        cookieNames.prefixes.some((prefix) => name.startsWith(prefix))
    );
}
