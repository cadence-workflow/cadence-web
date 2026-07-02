import { SCHEDULE_OVERLAP_POLICIES } from '@/route-handlers/create-schedule/create-schedule.constants';
import { SCHEDULE_OVERLAP_POLICY_LABELS } from '@/views/shared/constants/schedule-policy-labels.constants';

export const USE_SCHEDULE_OVERLAP_POLICY = 'USE_SCHEDULE_POLICY' as const;

export const DEFAULT_BACKFILL_OVERLAP_POLICY = USE_SCHEDULE_OVERLAP_POLICY;

export const SCHEDULE_ACTION_BACKFILL_FORM_FIELD_IDS = {
  startTime: 'schedule-action-backfill-form-start-time',
  endTime: 'schedule-action-backfill-form-end-time',
} as const;

export const BACKFILL_SCHEDULE_FORM_FIELD_DESCRIPTIONS = {
  period: 'Time range to backfill missed workflow runs.',
  overlapPolicy:
    'Policy that controls what the scheduler should do if the previous action is still running.',
} as const;

export const BACKFILL_OVERLAP_POLICY_OPTIONS = [
  {
    id: USE_SCHEDULE_OVERLAP_POLICY,
    label: 'Schedule default policy',
  },
  ...SCHEDULE_OVERLAP_POLICIES.map((policy) => ({
    id: policy,
    label: SCHEDULE_OVERLAP_POLICY_LABELS[policy],
  })),
] as const;

export type BackfillOverlapPolicyOptionId =
  (typeof BACKFILL_OVERLAP_POLICY_OPTIONS)[number]['id'];

export type ExplicitBackfillOverlapPolicy =
  (typeof SCHEDULE_OVERLAP_POLICIES)[number];

export const isExplicitOverlapPolicy = (
  value: BackfillOverlapPolicyOptionId | undefined
): value is ExplicitBackfillOverlapPolicy =>
  value !== undefined && value !== USE_SCHEDULE_OVERLAP_POLICY;
