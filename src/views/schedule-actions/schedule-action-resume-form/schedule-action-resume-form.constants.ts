import { SCHEDULE_CATCH_UP_POLICIES } from '@/route-handlers/create-schedule/create-schedule.constants';
import { SCHEDULE_CATCH_UP_POLICY_LABELS } from '@/views/shared/constants/schedule-policy-labels.constants';

export const USE_SCHEDULE_CATCH_UP_POLICY = 'USE_SCHEDULE_POLICY' as const;

export const DEFAULT_RESUME_CATCH_UP_POLICY = USE_SCHEDULE_CATCH_UP_POLICY;

export const SCHEDULE_ACTION_RESUME_FORM_FIELD_IDS = {
  reason: 'schedule-action-resume-reason',
} as const;

export const RESUME_CATCH_UP_POLICY_OPTIONS = [
  {
    id: USE_SCHEDULE_CATCH_UP_POLICY,
    label: 'Schedule default policy',
  },
  ...SCHEDULE_CATCH_UP_POLICIES.map((policy) => ({
    id: policy,
    label: SCHEDULE_CATCH_UP_POLICY_LABELS[policy],
  })),
] as const;

export type ResumeCatchUpPolicyOptionId =
  (typeof RESUME_CATCH_UP_POLICY_OPTIONS)[number]['id'];

export type ExplicitResumeCatchUpPolicy =
  (typeof SCHEDULE_CATCH_UP_POLICIES)[number];

export const isExplicitCatchUpPolicy = (
  value: ResumeCatchUpPolicyOptionId | undefined
): value is ExplicitResumeCatchUpPolicy =>
  value !== undefined && value !== USE_SCHEDULE_CATCH_UP_POLICY;
