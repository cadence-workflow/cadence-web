import type buildAuthCookieOptions from './build-auth-cookie-options';

export type ValidateAndReplayResult =
  | { ok: true }
  | { ok: false; reason: 'over-budget'; totalBytes: number }
  | { ok: false; reason: 'unknown-cookie-name'; name: string };

export type AuthCookieParams = {
  name: string;
  value: string;
  options: ReturnType<typeof buildAuthCookieOptions> & { expires?: Date };
};
