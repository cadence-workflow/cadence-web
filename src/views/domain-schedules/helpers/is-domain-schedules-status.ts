import { DOMAIN_SCHEDULES_STATUS_LABELS_MAP } from '../domain-schedules.constants';
import { type DomainSchedulesStatus } from '../domain-schedules.types';

export function isDomainSchedulesStatus(
  value: string
): value is DomainSchedulesStatus {
  return value in DOMAIN_SCHEDULES_STATUS_LABELS_MAP;
}
