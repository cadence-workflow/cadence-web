import {
  type ResumeScheduleFormData,
  type ResumeScheduleSubmissionData,
} from '../schedule-action-resume-form.types';

import isExplicitCatchUpPolicy from './is-explicit-catch-up-policy';

export default function transformResumeScheduleFormToSubmission(
  formData: ResumeScheduleFormData
): ResumeScheduleSubmissionData {
  const reason = formData.reason?.trim() || undefined;
  const catchUpPolicy = isExplicitCatchUpPolicy(formData.catchUpPolicy)
    ? formData.catchUpPolicy
    : undefined;

  return {
    reason,
    catchUpPolicy,
  };
}
