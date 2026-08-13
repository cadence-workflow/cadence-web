import {
  type ExplicitResumeCatchUpPolicy,
  type ResumeCatchUpPolicyOptionId,
  USE_SCHEDULE_CATCH_UP_POLICY,
} from '../schedule-action-resume-form.constants';

export default function isExplicitCatchUpPolicy(
  value: ResumeCatchUpPolicyOptionId | undefined
): value is ExplicitResumeCatchUpPolicy {
  return value !== undefined && value !== USE_SCHEDULE_CATCH_UP_POLICY;
}
