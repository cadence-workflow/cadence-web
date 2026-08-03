export type GetSkippedScheduleExecutionsParams = {
  cronExpression: string;
  inferenceStartMs: number | null;
  scheduleEndMs: number | null;
  oldestLoadedScheduleTimeMs: number | null;
  hasNextPage: boolean;
  nowMs: number;
  nextExecutionTimeMs?: number | null;
  actualTimesMs: number[];
};
