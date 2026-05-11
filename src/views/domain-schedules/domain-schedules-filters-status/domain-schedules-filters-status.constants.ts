import { type DomainSchedulesStatus } from './domain-schedules-filters-status.types';

export const DOMAIN_SCHEDULES_STATUS_LABELS_MAP = {
  RUNNING: 'Running',
  PAUSED: 'Paused',
} as const satisfies Record<DomainSchedulesStatus, string>;
