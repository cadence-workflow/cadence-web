import escapeVisibilityQueryValue from './escape-visibility-query-value';

export default function buildScheduleBackfillWorkflowsVisibilityQuery(
  scheduleId: string,
  backfillId: string
): string {
  return `CadenceScheduleID = "${escapeVisibilityQueryValue(scheduleId)}" AND CadenceScheduleBackfillID = "${escapeVisibilityQueryValue(backfillId)}"`;
}
