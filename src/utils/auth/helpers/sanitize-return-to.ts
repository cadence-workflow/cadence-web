import { DEFAULT_AUTH_RETURN_TO } from '../auth.constants';

const SENTINEL_ORIGIN = 'http://cadence-web.invalid';

/** Trust-boundary guard for relative in-app paths passed through login redirects. */
export function sanitizeReturnTo(path: string | null | undefined): string {
  if (!path?.startsWith('/') || path.startsWith('//')) {
    return DEFAULT_AUTH_RETURN_TO;
  }

  // Parse against a sentinel origin to catch parser tricks a prefix check
  // misses: browsers normalize backslashes and strip tabs/newlines, so inputs
  // like "/\evil.test" or "/\t/evil.test" become protocol-relative URLs.
  let url: URL;
  try {
    url = new URL(path, SENTINEL_ORIGIN);
  } catch {
    return DEFAULT_AUTH_RETURN_TO;
  }
  // Dot-segment normalization can CREATE a protocol-relative path from a
  // safe-looking input ("/.//evil.test" → "//evil.test") — check the
  // normalized pathname, not just the raw input.
  if (url.origin !== SENTINEL_ORIGIN || url.pathname.startsWith('//')) {
    return DEFAULT_AUTH_RETURN_TO;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
