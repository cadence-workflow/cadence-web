import { type BackfillScheduleSubmissionData } from '@/route-handlers/backfill-schedule/backfill-schedule.types';

import { isExplicitOverlapPolicy } from './is-explicit-overlap-policy';
import { type BackfillScheduleFormData } from '../schedule-action-backfill-form.types';

export default function transformBackfillScheduleFormToSubmission(
  formData: BackfillScheduleFormData
): BackfillScheduleSubmissionData {
  const backfillId = formData.backfillId?.trim() || undefined;
  const overlapPolicy = isExplicitOverlapPolicy(formData.overlapPolicy)
    ? formData.overlapPolicy
    : undefined;

  return {
    startTime: formData.startTime,
    endTime: formData.endTime,
    backfillId,
    overlapPolicy,
  };
}
