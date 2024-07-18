import { type UpdateDomainRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/UpdateDomainRequest';
import { type DomainInfo } from '@/views/domain-page/domain-page.types';

export type UpdateDomainFields = Omit<
  UpdateDomainRequest__Input,
  'securityToken' | 'name' | 'updateMask'
>;

export type Params = {
  cluster: string;
  domain: string;
  values: Partial<UpdateDomainFields>;
};

export type UpdateDomainResponse = DomainInfo;
