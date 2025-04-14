import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';
import { type UpdateDomainRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/UpdateDomainRequest';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type UpdateDomainFields = Omit<
  UpdateDomainRequest__Input,
  'securityToken' | 'name' | 'updateMask'
>;

export type UpdateDomainResponse = Domain;

export type Context = DefaultMiddlewaresContext;
