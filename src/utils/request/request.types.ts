export type RequestOptions = RequestInit & {
  omitUserHeaders?: boolean;
  /** Opt out of the 401 recovery pipeline (non-Cadence URLs). */
  skipAuthRecovery?: boolean;
  /** Internal retry-once bound: set by the 401 pipeline itself so a second
   * 401 throws instead of looping recovery forever. */
  _authRetried?: boolean;
};
