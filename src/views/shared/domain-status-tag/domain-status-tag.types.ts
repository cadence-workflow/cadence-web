import { type DomainStatus as DomainStatusProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/DomainStatus';

export type DomainStatus = DomainStatusProto;

export type Props = {
  status: DomainStatus;
};
