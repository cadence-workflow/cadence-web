import { type BackfillScheduleSubmissionData } from '@/route-handlers/backfill-schedule/backfill-schedule.types';

import { USE_SCHEDULE_OVERLAP_POLICY } from '../schedule-action-backfill-form.constants';
import { type BackfillScheduleFormData } from '../schedule-action-backfill-form.types';

export default function transformBackfillScheduleFormToSubmission(
  formData: BackfillScheduleFormData
): BackfillScheduleSubmissionData {
  const backfillId = formData.backfillId?.trim() || undefined;
  const overlapPolicy =
    formData.overlapPolicy &&
    formData.overlapPolicy !== USE_SCHEDULE_OVERLAP_POLICY
      ? formData.overlapPolicy
      : undefined;

  return {
    startTime: formData.startTime,
    endTime: formData.endTime,
    backfillId,
    overlapPolicy,
  };
}
