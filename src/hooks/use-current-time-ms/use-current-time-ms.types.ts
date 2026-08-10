export type UseCurrentTimeMsParams = {
  /** How often the returned timestamp is refreshed while enabled (ms). */
  intervalMs: number;
  /**
   * When false the timer is not scheduled and the last read time is held, so
   * a caller tracking something that has finished stops re-rendering.
   */
  isEnabled?: boolean;
};
