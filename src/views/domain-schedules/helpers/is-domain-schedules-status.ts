import { DOMAIN_SCHEDULES_STATUS_LABELS_MAP } from '../domain-schedules-filters-status/domain-schedules-filters-status.constants';
import { type DomainSchedulesStatus } from '../domain-schedules-filters-status/domain-schedules-filters-status.types';

export function isDomainSchedulesStatus(
  value: string
): value is DomainSchedulesStatus {
  return value in DOMAIN_SCHEDULES_STATUS_LABELS_MAP;
}
