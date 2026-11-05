/** Closed dayjs tokens only. */
export const DATE_TIME_FORMAT_MINUTES = 'YYYY/MM/DD HH:mm' as const;
export const DATE_TIME_FORMAT_SECONDS = 'YYYY-MM-DD HH:mm:ss' as const;

export type DateTimeDisplayFormat =
  | typeof DATE_TIME_FORMAT_MINUTES
  | typeof DATE_TIME_FORMAT_SECONDS;
