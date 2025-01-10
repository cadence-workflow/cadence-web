import { type UpdateDomainRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/UpdateDomainRequest';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';
import { type DomainInfo } from '@/views/domain-page/domain-page.types';

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

export type UpdateDomainResponse = DomainInfo;

export type Context = DefaultMiddlewaresContext;
