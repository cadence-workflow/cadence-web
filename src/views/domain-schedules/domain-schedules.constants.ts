import { type DomainSchedulesStatus } from './domain-schedules.types';

export const SCHEDULES_PAGE_SIZE = 25;

export const TABLE_CELL_PLACEHOLDER_TEXT = '-';

export const DOMAIN_SCHEDULES_STATUS_LABELS_MAP = {
  RUNNING: 'Running',
  PAUSED: 'Paused',
} as const satisfies Record<DomainSchedulesStatus, string>;
