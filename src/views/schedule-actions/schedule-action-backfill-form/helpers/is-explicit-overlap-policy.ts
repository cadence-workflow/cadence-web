import {
  USE_SCHEDULE_OVERLAP_POLICY,
  type BackfillOverlapPolicyOptionId,
  type ExplicitBackfillOverlapPolicy,
} from '../schedule-action-backfill-form.constants';

export function isExplicitOverlapPolicy(
  value: BackfillOverlapPolicyOptionId | undefined
): value is ExplicitBackfillOverlapPolicy {
  return value !== undefined && value !== USE_SCHEDULE_OVERLAP_POLICY;
}
