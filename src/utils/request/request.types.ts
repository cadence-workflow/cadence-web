export type RequestOptions = RequestInit & {
  omitUserHeaders?: boolean;
  /** Don't try to recover the session on a 401 (for non-Cadence URLs). */
  skipAuthRecovery?: boolean;
  /** Set by request() itself on its retry. Don't pass it. */
  _authRetried?: boolean;
};
