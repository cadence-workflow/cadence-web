import { type DomainStatus } from './domain-status-tag.types';

export const DOMAIN_STATUS_NAMES = {
  DOMAIN_STATUS_INVALID: 'Invalid',
  DOMAIN_STATUS_REGISTERED: 'Registered',
  DOMAIN_STATUS_DEPRECATED: 'Deprecated',
  DOMAIN_STATUS_DELETED: 'Deleted',
} as const satisfies Record<DomainStatus, string>;
