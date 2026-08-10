import { type DomainAccess } from './auth-shared.types';

export const FULL_ACCESS: DomainAccess = {
  canRead: true,
  canWrite: true,
};

export const NO_ACCESS: DomainAccess = {
  canRead: false,
  canWrite: false,
};
