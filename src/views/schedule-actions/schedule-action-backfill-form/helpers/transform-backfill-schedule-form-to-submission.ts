import { type BackfillScheduleSubmissionData } from '@/route-handlers/backfill-schedule/backfill-schedule.types';

import { isExplicitOverlapPolicy } from '../schedule-action-backfill-form.constants';
import { type BackfillScheduleFormData } from '../schedule-action-backfill-form.types';

export default function transformBackfillScheduleFormToSubmission(
  formData: BackfillScheduleFormData
): BackfillScheduleSubmissionData {
  return {
    startTime: formData.startTime,
    endTime: formData.endTime,
    ...(isExplicitOverlapPolicy(formData.overlapPolicy)
      ? { overlapPolicy: formData.overlapPolicy }
      : {}),
  };
}
