import { type DomainAccess } from '@/utils/auth/auth-shared.types';

export type DomainAccessResolverParams = {
  domain: string;
  cluster: string;
};

export type DomainAccessResolverValue = DomainAccess;
