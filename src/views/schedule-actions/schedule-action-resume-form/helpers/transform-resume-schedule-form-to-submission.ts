import { isExplicitCatchUpPolicy } from '../schedule-action-resume-form.constants';
import {
  type ResumeScheduleFormData,
  type ResumeScheduleSubmissionData,
} from '../schedule-action-resume-form.types';

export default function transformResumeScheduleFormToSubmission(
  formData: ResumeScheduleFormData
): ResumeScheduleSubmissionData {
  const reason = formData.reason?.trim();

  return {
    ...(reason ? { reason } : {}),
    ...(isExplicitCatchUpPolicy(formData.catchUpPolicy)
      ? { catchUpPolicy: formData.catchUpPolicy }
      : {}),
  };
}
